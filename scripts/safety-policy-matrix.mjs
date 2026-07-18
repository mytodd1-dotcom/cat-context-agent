import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runContextProvider } from "./cat-context-provider.mjs";
import { runDemo } from "./cat-context-demo.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = resolve(root, "hackathon-assets");

const paths = {
  matrixJson: resolve(assetDir, "safety-policy-matrix.json"),
  matrixMarkdown: resolve(assetDir, "safety-policy-matrix.md"),
};

const policyRules = [
  {
    action: "create_internal_review_task",
    class: "allowed",
    required_context: ["schema", "owner", "lineage", "policy"],
    reason: "Internal work can be queued when source, owner, and policy context are known.",
    allowed_when: "Owner is known and the action stays inside the business workflow.",
    fallback: "Ask for missing context or write an approval receipt.",
  },
  {
    action: "ask_missing_context_question",
    class: "allowed",
    required_context: ["schema", "missing_context", "policy"],
    reason: "Asking a human is safe when the agent lacks ownership, contact, or confidence context.",
    allowed_when: "Any required context is missing or below the approval threshold.",
    fallback: "Block external work until the answer is supplied.",
  },
  {
    action: "write_receipt",
    class: "allowed",
    required_context: ["source_asset", "context_checked", "decision"],
    reason: "Receipts are the audit trail for every recommendation, approval gate, or block.",
    allowed_when: "The agent has read context and selected a decision status.",
    fallback: "Do not claim a recommendation without a receipt.",
  },
  {
    action: "send_external_outreach",
    class: "approval_required",
    required_context: ["verified_contact", "owner", "policy_approval"],
    reason: "External-facing work can affect customers and must not be triggered from low-trust context.",
    allowed_when: "Verified contact, accountable owner, and explicit outreach approval are present.",
    fallback: "Create an approval task or block if contact is missing.",
  },
  {
    action: "invent_missing_owner",
    class: "blocked",
    required_context: ["owner"],
    reason: "The agent must not hallucinate accountability when ownership is missing.",
    allowed_when: "Never.",
    fallback: "Ask who owns the request.",
  },
  {
    action: "scrape_contact_details",
    class: "blocked",
    required_context: ["verified_contact"],
    reason: "The agent must not go outside the trusted context boundary to fill missing customer data.",
    allowed_when: "Never.",
    fallback: "Request a verified contact from the human owner.",
  },
];

function outcomeForDecision(decision) {
  if (decision.decision === "safe_to_queue_internal_task") return "allowed";
  if (decision.decision === "needs_approval") return "approval_required";
  return "blocked";
}

function renderMarkdown(matrix) {
  return `# CAT Context Agent — Safety Policy Matrix

Generated: \`${matrix.generated_at}\`  
Default mode: \`${matrix.default_mode}\`  
Source asset: \`${matrix.source_asset}\`

This artifact makes CAT's action boundary explicit: the agent may do safe internal work, must ask for approval when context is incomplete, and must block unsafe external action.

## Policy rules

| Action | Class | Required context | Allowed when | Fallback |
| --- | --- | --- | --- | --- |
${matrix.rules.map((rule) => `| \`${rule.action}\` | \`${rule.class}\` | ${rule.required_context.map((item) => `\`${item}\``).join("<br>")} | ${rule.allowed_when} | ${rule.fallback} |`).join("\n")}

## Request outcomes

| Request | Decision | Policy outcome | Missing context | Safe next step | Blocked action |
| --- | --- | --- | --- | --- | --- |
${matrix.request_outcomes.map((item) => `| \`${item.request_id}\` | \`${item.decision}\` | \`${item.policy_outcome}\` | ${item.missing_context.length ? item.missing_context.map((value) => `\`${value}\``).join("<br>") : "—"} | ${item.safe_next_step} | ${item.blocked_action ?? "—"} |`).join("\n")}

## Guardrail summary

- Allowed actions: ${matrix.allowed_actions.map((action) => `\`${action}\``).join(", ")}
- Blocked actions: ${matrix.blocked_actions.map((action) => `\`${action}\``).join(", ")}
- Approval threshold: confidence below \`${matrix.approval_required_when_confidence_below}\`
- External outreach requires both verified contact and accountable owner context.
`;
}

export async function runSafetyPolicyMatrix() {
  const [contextRead, demo] = await Promise.all([
    runContextProvider(),
    runDemo(),
  ]);

  const receiptsById = new Map(demo.receipts.map((receipt) => [receipt.request_id, receipt]));

  const matrix = {
    protocol: "cat-safety-policy-matrix-v0",
    generated_at: "demo-static-run",
    source_asset: demo.source_asset,
    default_mode: "read_before_action",
    approval_required_when_confidence_below: contextRead.context.approval_required_when_confidence_below,
    allowed_actions: contextRead.context.allowed_actions,
    blocked_actions: contextRead.context.blocked_actions,
    rules: policyRules,
    request_outcomes: contextRead.decisions.map((decision) => {
      const receipt = receiptsById.get(decision.request_id);
      return {
        request_id: decision.request_id,
        account: receipt?.account ?? "unknown",
        decision: decision.decision,
        policy_outcome: outcomeForDecision(decision),
        missing_context: decision.missing_context,
        confidence: decision.confidence,
        safe_next_step: decision.safe_next_step,
        blocked_action: decision.blocked_action,
        receipt_id: receipt?.receipt_id ?? decision.request_id,
      };
    }),
  };

  await mkdir(assetDir, { recursive: true });
  await Promise.all([
    writeFile(paths.matrixJson, `${JSON.stringify(matrix, null, 2)}\n`),
    writeFile(paths.matrixMarkdown, renderMarkdown(matrix)),
  ]);

  return matrix;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const matrix = await runSafetyPolicyMatrix();
  console.log(JSON.stringify({
    protocol: matrix.protocol,
    rules: matrix.rules.length,
    request_outcomes: matrix.request_outcomes.length,
    blocked_actions: matrix.blocked_actions,
    output: [
      "hackathon-assets/safety-policy-matrix.json",
      "hackathon-assets/safety-policy-matrix.md",
    ],
  }, null, 2));
  console.log(`Wrote ${paths.matrixJson}`);
  console.log(`Wrote ${paths.matrixMarkdown}`);
}
