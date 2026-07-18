import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runContextProvider } from "./cat-context-provider.mjs";
import { runDemo } from "./cat-context-demo.mjs";
import { runContextToolContracts } from "./context-tool-contracts.mjs";
import { runDataHubIntegrationChecklist } from "./datahub-integration-checklist.mjs";
import { runBridge } from "./datahub-local-bridge.mjs";
import { runSafetyPolicyMatrix } from "./safety-policy-matrix.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = resolve(root, "hackathon-assets");

const paths = {
  auditJson: resolve(assetDir, "datahub-claim-audit.json"),
  auditMarkdown: resolve(assetDir, "datahub-claim-audit.md"),
};

const expectedAspects = ["datasetProperties", "schemaMetadata", "ownership", "glossaryTerms"];
const expectedContextReads = ["datahub.get_entity", "datahub.get_lineage", "cat.get_agent_context_packet"];

function claim(name, ok, evidence, files) {
  return { name, ok: Boolean(ok), evidence, files };
}

function renderMarkdown(audit) {
  return `# CAT Context Agent — DataHub Claim Audit

Generated: \`${audit.generated_at}\`  
Status: **${audit.status}**

This audit gives judges a compact pass/fail view of the DataHub-specific claims in the submission.

## Claim checks

${audit.claims.map((item) => `- ${item.ok ? "✅" : "❌"} **${item.name}** — ${item.evidence}
  - Files: ${item.files.map((file) => `\`${file}\``).join(", ")}`).join("\n")}

## Audit summary

- DataHub aspects checked: ${audit.summary.datahub_aspects.map((aspect) => `\`${aspect}\``).join(", ")}
- Context reads checked: ${audit.summary.context_reads.map((tool) => `\`${tool}\``).join(", ")}
- Live DataHub required for judging: \`${audit.summary.live_datahub_required_for_submission}\`
- Secrets required: \`${audit.summary.secrets_required}\`
- Blocked actions preserved: ${audit.summary.blocked_actions.map((action) => `\`${action}\``).join(", ")}
`;
}

export async function runDataHubClaimAudit() {
  await runDemo();
  const [bridge, contextRead, checklist, policyMatrix, contracts] = await Promise.all([
    runBridge(),
    runContextProvider(),
    runDataHubIntegrationChecklist(),
    runSafetyPolicyMatrix(),
    runContextToolContracts(),
  ]);

  const aspectNames = bridge.plan.proposals.map((proposal) => proposal.aspectName);
  const contextReads = contextRead.tool_read_plan.map((tool) => tool.name);
  const contractToolNames = contracts.tools.map((tool) => tool.name);
  const localPostCommand = checklist.phases.find((phase) => phase.mode === "optional_local_datahub")?.command ?? "";

  const claims = [
    claim(
      "DataHub aspect coverage",
      expectedAspects.every((aspect) => aspectNames.includes(aspect)) &&
        bridge.plan.entityUrn === "urn:li:dataset:(cat,messy_business_requests,PROD)",
      "Dataset identity plus datasetProperties, schemaMetadata, ownership, and glossaryTerms are generated for the CAT source asset.",
      [
        "examples/cat-context-agent/generated-datahub-metadata.json",
        "examples/cat-context-agent/generated-datahub-bridge-plan.json",
      ],
    ),
    claim(
      "DataHub context read path",
      expectedContextReads.every((tool) => contextReads.includes(tool)) && contextRead.decisions.length === 3,
      "The agent reads entity, lineage, and CAT context packet data before surfacing decisions.",
      [
        "examples/cat-context-agent/generated-mcp-context-read.json",
        "hackathon-assets/context-tool-contracts.md",
      ],
    ),
    claim(
      "Local-only live posting boundary",
      checklist.decision_gates.live_datahub_required_for_submission === false &&
        checklist.decision_gates.secrets_required === false &&
        localPostCommand.includes("DATAHUB_GMS_URL=http://localhost:8080") &&
        localPostCommand.includes("--post"),
      "The current submission is judgeable without credentials, and the only live mutation command targets a local GMS explicitly.",
      [
        "hackathon-assets/datahub-integration-checklist.md",
        "hackathon-assets/live-datahub-runbook.md",
      ],
    ),
    claim(
      "Guarded action policy",
      policyMatrix.blocked_actions.includes("send_external_outreach_without_verified_contact") &&
        policyMatrix.blocked_actions.includes("scrape_contact_details") &&
        policyMatrix.request_outcomes.some((item) => item.request_id === "REQ-1044" && item.policy_outcome === "blocked"),
      "Unsafe outreach remains blocked when verified contact context is missing.",
      [
        "hackathon-assets/safety-policy-matrix.md",
        "examples/cat-context-agent/generated-agent-output.json",
      ],
    ),
    claim(
      "Receipt write is bounded",
      contractToolNames.includes("cat.write_receipt") &&
        contracts.tools.some((tool) => tool.name === "cat.write_receipt" && tool.output_contract.external_side_effects === "none"),
      "The guarded write path records a receipt without external side effects.",
      [
        "hackathon-assets/context-tool-contracts.md",
        "examples/cat-context-agent/generated-agent-output.json",
      ],
    ),
  ];

  const audit = {
    protocol: "cat-datahub-claim-audit-v0",
    project: "CAT Context Agent",
    generated_at: "demo-static-run",
    status: claims.every((item) => item.ok) ? "passed" : "failed",
    claims,
    summary: {
      datahub_aspects: aspectNames,
      context_reads: contextReads,
      live_datahub_required_for_submission: checklist.decision_gates.live_datahub_required_for_submission,
      secrets_required: checklist.decision_gates.secrets_required,
      blocked_actions: policyMatrix.blocked_actions,
    },
  };

  await mkdir(assetDir, { recursive: true });
  await Promise.all([
    writeFile(paths.auditJson, `${JSON.stringify(audit, null, 2)}\n`),
    writeFile(paths.auditMarkdown, renderMarkdown(audit)),
  ]);

  if (audit.status !== "passed") {
    throw new Error(`DataHub claim audit failed: ${claims.filter((item) => !item.ok).map((item) => item.name).join(", ")}`);
  }

  return audit;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const audit = await runDataHubClaimAudit();
  console.log(JSON.stringify({
    protocol: audit.protocol,
    status: audit.status,
    claims: audit.claims.length,
    output: [
      "hackathon-assets/datahub-claim-audit.json",
      "hackathon-assets/datahub-claim-audit.md",
    ],
  }, null, 2));
  console.log(`Wrote ${paths.auditJson}`);
  console.log(`Wrote ${paths.auditMarkdown}`);
}
