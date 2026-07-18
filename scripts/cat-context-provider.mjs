import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const exampleDir = resolve(root, "examples/cat-context-agent");

const paths = {
  agentOutput: resolve(exampleDir, "generated-agent-output.json"),
  bridgePlan: resolve(exampleDir, "generated-datahub-bridge-plan.json"),
  agentContext: resolve(exampleDir, "generated-agent-context-packet.json"),
  contextRead: resolve(exampleDir, "generated-mcp-context-read.json"),
};

function getArgValue(name) {
  const prefixed = `${name}=`;
  const found = process.argv.slice(2).find((arg) => arg.startsWith(prefixed));
  if (found) return found.slice(prefixed.length);

  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function buildToolReadPlan({ bridgePlan, agentContext, requestId }) {
  return [
    {
      name: "datahub.get_entity",
      purpose: "Read cataloged dataset identity, schema, ownership, and glossary context before the agent chooses an action.",
      arguments: {
        urn: bridgePlan.entityUrn,
      },
      expected_reads: bridgePlan.proposals.map((proposal) => proposal.aspectName),
    },
    {
      name: "datahub.get_lineage",
      purpose: "Confirm the data came from the uploaded CSV through CAT's context mapper and decision loop.",
      arguments: {
        urn: bridgePlan.entityUrn,
        direction: "downstream",
      },
      expected_reads: agentContext.lineage,
    },
    {
      name: "cat.get_agent_context_packet",
      purpose: "Read CAT's minimum action-safety contract derived from DataHub context.",
      arguments: {
        asset: agentContext.datahub_asset,
        request_id: requestId ?? "all",
      },
      expected_reads: ["governance", "schema_confidence", "allowed_actions", "blocked_actions", "receipts"],
    },
  ];
}

function summarizeContext({ agentContext, bridgePlan }) {
  const lowConfidenceFields = Object.entries(agentContext.schema_confidence)
    .filter(([, confidence]) => confidence < agentContext.governance.approval_required_when_confidence_below)
    .map(([field, confidence]) => ({ field, confidence }));

  return {
    asset: bridgePlan.entityUrn,
    provider: "local-datahub-mcp-adapter",
    owner_required_for_external_outreach: agentContext.governance.owner_required_for_external_outreach,
    verified_contact_required_for_external_outreach:
      agentContext.governance.verified_contact_required_for_external_outreach,
    approval_required_when_confidence_below: agentContext.governance.approval_required_when_confidence_below,
    low_confidence_fields: lowConfidenceFields,
    allowed_actions: agentContext.allowed_actions,
    blocked_actions: agentContext.blocked_actions,
    policy_summary:
      "Internal review tasks may be queued from trusted context; external outreach is blocked unless owner and verified contact context exist.",
  };
}

function buildDecisionView({ output, agentContext, requestId }) {
  const receipts = requestId
    ? output.receipts.filter((receipt) => receipt.request_id === requestId)
    : output.receipts;

  if (requestId && receipts.length === 0) {
    throw new Error(`No generated receipt found for request_id=${requestId}`);
  }

  return receipts.map((receipt) => ({
    request_id: receipt.request_id,
    decision: receipt.decision,
    missing_context: receipt.missing_context,
    safe_next_step: receipt.safe_next_step,
    blocked_action: receipt.blocked_action,
    confidence: receipt.confidence,
    context_sources: unique([
      output.source_asset,
      ...receipt.context_checked.map((item) => `context:${item}`),
      `policy:${agentContext.protocol}`,
    ]),
  }));
}

export async function buildContextRead({ requestId = getArgValue("--request-id") } = {}) {
  const [outputRaw, bridgeRaw, agentContextRaw] = await Promise.all([
    readFile(paths.agentOutput, "utf8"),
    readFile(paths.bridgePlan, "utf8"),
    readFile(paths.agentContext, "utf8"),
  ]);

  const output = JSON.parse(outputRaw);
  const bridgePlan = JSON.parse(bridgeRaw);
  const agentContext = JSON.parse(agentContextRaw);
  const decisions = buildDecisionView({ output, agentContext, requestId });

  return {
    protocol: "cat-mcp-context-read-v0",
    generated_at: "demo-static-run",
    mode: "local-dry-run",
    request_filter: requestId ?? "all",
    provider_boundary:
      "This artifact simulates the MCP/DataHub read contract while keeping the hackathon demo runnable without Docker, credentials, or external network access.",
    tool_read_plan: buildToolReadPlan({ bridgePlan, agentContext, requestId }),
    context: summarizeContext({ agentContext, bridgePlan }),
    decisions,
    approval_queue: decisions
      .filter((decision) => decision.decision === "needs_approval")
      .map((decision) => ({
        request_id: decision.request_id,
        question: "Who owns this customer contact and is external follow-up approved?",
        reason: decision.safe_next_step,
      })),
    blocked: decisions
      .filter((decision) => decision.decision === "blocked")
      .map((decision) => ({
        request_id: decision.request_id,
        blocked_action: decision.blocked_action,
        reason: "Verified contact context is missing, so the agent must not infer or scrape it.",
      })),
  };
}

export async function runContextProvider() {
  const contextRead = await buildContextRead();
  await writeFile(paths.contextRead, `${JSON.stringify(contextRead, null, 2)}\n`);
  return contextRead;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const contextRead = await runContextProvider();
  console.log(JSON.stringify({
    mode: contextRead.mode,
    provider: contextRead.context.provider,
    request_filter: contextRead.request_filter,
    decisions: contextRead.decisions.length,
    approval_queue: contextRead.approval_queue.length,
    blocked: contextRead.blocked.length,
    tool_reads: contextRead.tool_read_plan.map((tool) => tool.name),
  }, null, 2));
  console.log(`Wrote ${paths.contextRead}`);
}
