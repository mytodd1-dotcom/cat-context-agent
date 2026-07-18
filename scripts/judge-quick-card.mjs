import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runDataHubReadinessDoctor } from "./datahub-readiness-doctor.mjs";
import { runMcpAdapterSmoke } from "./mcp-adapter-smoke.mjs";
import { runSafetyPolicyMatrix } from "./safety-policy-matrix.mjs";
import { runSubmissionHonestyAudit } from "./submission-honesty-audit.mjs";
import { runSubmissionVerify } from "./verify-submission.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = resolve(root, "hackathon-assets");
const quickCardJsonPath = resolve(assetDir, "judge-quick-card.json");
const quickCardMarkdownPath = resolve(assetDir, "judge-quick-card.md");

function renderMarkdown(card) {
  return `# CAT Context Agent — 2-Minute Judge Card

Generated: \`${card.generated_at}\`  
Status: **${card.status}**  
Suggested review time: **${card.time_budget_minutes} minutes**

This is the shortest possible scoring card for judges who want the live links, one proof command, claim map, and safety boundary without reading every artifact first.

## Open first

${card.open_first.map((item) => `### ${item.step}. ${item.label}

${item.url.startsWith("http") ? `[${item.url}](${item.url})` : `\`${item.url}\``}

Why: ${item.why}`).join("\n\n")}

## Fastest proof

\`\`\`bash
${card.fastest_local_command}
\`\`\`

Full validation:

\`\`\`bash
${card.full_validation_command}
\`\`\`

## Claim snapshot

| Claim | What proves it | Files |
| --- | --- | --- |
${card.claim_snapshot.map((item) => `| ${item.claim} | ${item.proof} | ${item.files.map((file) => `\`${file}\``).join("<br>")} |`).join("\n")}

## DataHub evidence

- Aspects prepared: ${card.datahub_evidence.aspects.map((aspect) => `\`${aspect}\``).join(", ")}
- MCP-style reads: ${card.datahub_evidence.mcp_style_reads.map((tool) => `\`${tool}\``).join(", ")}
- Local DataHub required for judging: \`${card.datahub_evidence.local_datahub_required_for_judging}\`
- DataHub doctor status: \`${card.datahub_evidence.datahub_doctor_status}\`

## Safety boundary

- External side effects: \`${card.safety_boundary.external_side_effects}\`
- Blocked actions: ${card.safety_boundary.blocked_actions.map((action) => `\`${action}\``).join(", ")}
- No secrets required: \`${card.safety_boundary.secrets_required}\`
- Public copy honesty status: \`${card.safety_boundary.honesty_status}\`

## What is real now

${card.what_is_real_now.map((item) => `- ${item}`).join("\n")}

## What remains optional / next

${card.optional_next_steps.map((item) => `- ${item}`).join("\n")}
`;
}

export async function runJudgeQuickCard(inputs = {}) {
  const readiness = inputs.readiness ?? (await runSubmissionVerify());
  const datahubDoctor = inputs.datahubDoctor ?? (await runDataHubReadinessDoctor());
  const mcpSmoke = inputs.mcpSmoke ?? (await runMcpAdapterSmoke());
  const honestyAudit = inputs.honestyAudit ?? (await runSubmissionHonestyAudit());
  const policyMatrix = inputs.policyMatrix ?? (await runSafetyPolicyMatrix());

  const card = {
    protocol: "cat-judge-quick-card-v0",
    project: "CAT Context Agent",
    challenge: "Build with DataHub: The Agent Hackathon",
    generated_at: "demo-static-run",
    status:
      readiness.status === "ready" &&
      datahubDoctor.status.startsWith("ready_") &&
      mcpSmoke.status === "passed" &&
      honestyAudit.status === "passed"
        ? "ready"
        : "needs_attention",
    time_budget_minutes: 2,
    canonical_links: {
      live_demo: "https://cat-context-agent.flyguy.chatgpt.site",
      repository: "https://github.com/mytodd1-dotcom/cat-context-agent",
      demo_video: "https://youtu.be/Gcbhl5_YlSM",
    },
    open_first: [
      {
        step: 1,
        label: "Live demo",
        url: "https://cat-context-agent.flyguy.chatgpt.site",
        why: "Fastest visual scan of the messy data, context read, approval queue, and receipt-backed action plan.",
      },
      {
        step: 2,
        label: "Demo video",
        url: "https://youtu.be/Gcbhl5_YlSM",
        why: "Two-minute narrated walkthrough of the context-before-action loop.",
      },
      {
        step: 3,
        label: "Scoring brief",
        url: "hackathon-assets/judge-scoring-brief.md",
        why: "Maps each major judging claim to concrete files.",
      },
      {
        step: 4,
        label: "One-command reproduction receipt",
        url: "hackathon-assets/reproduction-receipt.md",
        why: "Shows the generated proof chain and the command that regenerates it.",
      },
    ],
    fastest_local_command: "npm run evidence:reproduce",
    full_validation_command: "npm run ci:local",
    claim_snapshot: [
      {
        claim: "DataHub is the context layer.",
        proof: "The demo prepares dataset identity, schema, ownership, glossary, and lineage context before agent decisions.",
        files: [
          "examples/cat-context-agent/generated-datahub-metadata.json",
          "hackathon-assets/datahub-payload-preview.md",
          "hackathon-assets/datahub-mcp-handoff.md",
        ],
      },
      {
        claim: "The agent does real workflow work.",
        proof: "Three messy requests become one safe internal task, one approval-required task, and one blocked external outreach attempt.",
        files: [
          "examples/cat-context-agent/generated-agent-output.json",
          "hackathon-assets/decision-trace.md",
          "hackathon-assets/lineage-decision-map.md",
        ],
      },
      {
        claim: "Unsafe automation is constrained.",
        proof: "Missing owners, unclear contacts, and external outreach are approval-gated or blocked before action.",
        files: [
          "hackathon-assets/safety-policy-matrix.md",
          "hackathon-assets/submission-honesty-audit.md",
          "hackathon-assets/judge-faq.md",
        ],
      },
      {
        claim: "The submission is reproducible.",
        proof: "The local proof chain regenerates artifacts, validates them, and builds/tests the page.",
        files: [
          "hackathon-assets/reproduction-receipt.md",
          "hackathon-assets/artifact-validation-report.md",
          "hackathon-assets/judge-walkthrough.md",
        ],
      },
    ],
    datahub_evidence: {
      aspects: readiness.summary.datahub_aspects,
      mcp_style_reads: readiness.summary.mcp_style_tool_reads,
      local_datahub_required_for_judging: datahubDoctor.probe.required_for_judging,
      datahub_doctor_status: datahubDoctor.status,
    },
    safety_boundary: {
      external_side_effects: mcpSmoke.external_side_effects,
      blocked_actions: policyMatrix.blocked_actions,
      secrets_required: false,
      honesty_status: honestyAudit.status,
    },
    what_is_real_now: [
      "Public live demo and public GitHub repository are available.",
      "Local scripts generate DataHub-ready dry-run metadata and MCP-style context reads.",
      "The agent decision output, approval queue, safety policy matrix, and receipts are inspectable files.",
      "The evidence chain is runnable without DataHub credentials, Docker, customer data, or off-platform actions.",
    ],
    optional_next_steps: [
      "Run the optional local DataHub GMS post path from the runbook when judges want live local metadata mutation.",
      "Replace the static context packet with live DataHub MCP / Agent Context Kit reads.",
      "Write approved workflow receipt outcomes back as DataHub-linked auditable metadata.",
    ],
    outputs: [
      "hackathon-assets/judge-quick-card.json",
      "hackathon-assets/judge-quick-card.md",
    ],
  };

  await mkdir(assetDir, { recursive: true });
  await Promise.all([
    writeFile(quickCardJsonPath, `${JSON.stringify(card, null, 2)}\n`),
    writeFile(quickCardMarkdownPath, renderMarkdown(card)),
  ]);

  if (card.status !== "ready") {
    throw new Error("Judge quick card is not ready.");
  }

  return card;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const card = await runJudgeQuickCard();
  console.log(JSON.stringify({
    protocol: card.protocol,
    status: card.status,
    time_budget_minutes: card.time_budget_minutes,
    open_first: card.open_first.length,
    fastest_local_command: card.fastest_local_command,
    output: card.outputs,
  }, null, 2));
  console.log(`Wrote ${quickCardJsonPath}`);
  console.log(`Wrote ${quickCardMarkdownPath}`);
}
