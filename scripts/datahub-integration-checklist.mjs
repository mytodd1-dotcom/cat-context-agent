import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runContextToolContracts } from "./context-tool-contracts.mjs";
import { runLiveDataHubRunbook } from "./live-datahub-runbook.mjs";
import { runSafetyPolicyMatrix } from "./safety-policy-matrix.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = resolve(root, "hackathon-assets");

const paths = {
  checklistJson: resolve(assetDir, "datahub-integration-checklist.json"),
  checklistMarkdown: resolve(assetDir, "datahub-integration-checklist.md"),
};

function renderMarkdown(checklist) {
  return `# CAT Context Agent — DataHub Integration Checklist

Generated: \`${checklist.generated_at}\`  
Protocol: \`${checklist.protocol}\`  
Live DataHub required to judge current submission: **${checklist.decision_gates.live_datahub_required_for_submission ? "yes" : "no"}**

This checklist separates the runnable submission from the optional local DataHub verification path. It is meant to prevent judges from guessing which parts are already proven, which parts require a local GMS, and which parts are intentionally blocked until the context boundary is stronger.

## Decision gates

| Gate | Value |
| --- | --- |
| Can submit now | \`${checklist.decision_gates.can_submit_now}\` |
| Requires secrets | \`${checklist.decision_gates.secrets_required}\` |
| Use remote/production GMS | \`${!checklist.decision_gates.do_not_use_remote_gms}\` |
| Live DataHub required for judging | \`${checklist.decision_gates.live_datahub_required_for_submission}\` |

## Verification phases

| Phase | Mode | Command | Acceptance |
| --- | --- | --- | --- |
${checklist.phases.map((phase) => `| ${phase.name} | \`${phase.mode}\` | \`${phase.command}\` | ${phase.acceptance} |`).join("\n")}

## Integration boundaries

${checklist.boundaries.map((item) => `- ${item}`).join("\n")}

## Evidence files

${checklist.evidence_files.map((file) => `- \`${file}\``).join("\n")}
`;
}

export async function runDataHubIntegrationChecklist() {
  const [runbook, policyMatrix, contracts] = await Promise.all([
    runLiveDataHubRunbook(),
    runSafetyPolicyMatrix(),
    runContextToolContracts(),
  ]);

  const checklist = {
    protocol: "cat-datahub-integration-checklist-v0",
    project: "CAT Context Agent",
    generated_at: "demo-static-run",
    decision_gates: {
      can_submit_now: true,
      live_datahub_required_for_submission: false,
      secrets_required: false,
      do_not_use_remote_gms: true,
    },
    summary:
      "The current submission is judgeable from local generated evidence. A local DataHub GMS can optionally receive the same generated aspects, but production/remote posting and customer-data writeback are intentionally out of scope.",
    phases: [
      {
        name: "Reproduce the no-credential proof",
        mode: "runnable_now",
        command: "npm run evidence:reproduce",
        acceptance: "Reproduction receipt is marked reproducible and includes generated DataHub, policy, and validation artifacts.",
      },
      {
        name: "Inspect the DataHub aspect payloads",
        mode: "runnable_now",
        command: "npm run datahub:payload",
        acceptance: `${runbook.dry_run_payloads.length} dry-run aspect payloads are produced without contacting GMS.`,
      },
      {
        name: "Confirm context tool boundaries",
        mode: "runnable_now",
        command: "npm run context:contracts",
        acceptance: `${contracts.tools.length} read/write contracts document the DataHub reads and guarded CAT receipt write.`,
      },
      {
        name: "Confirm safe action policy",
        mode: "runnable_now",
        command: "npm run policy:matrix",
        acceptance: `${policyMatrix.rules.length} policy rules preserve allowed, approval-required, and blocked action classes.`,
      },
      {
        name: "Post to local DataHub GMS",
        mode: "optional_local_datahub",
        command: "DATAHUB_GMS_URL=http://localhost:8080 npm run datahub:bridge -- --post",
        acceptance: "Only a local GMS receives the four UPSERT proposals; dry-run evidence remains the fallback if GMS is unavailable.",
      },
    ],
    boundaries: [
      "Do not require judges to run Docker or provide credentials to validate the core submission.",
      `When judges do run local DataHub, use the Rest.li ingestProposal endpoint: ${runbook.live_ingest_contract.endpoint}.`,
      "Do not post to a remote or production DataHub instance from the demo.",
      "Do not include customer secrets, access tokens, or real contact data in generated artifacts.",
      "Do not replace approval gates with external outreach automation when owner or contact context is missing.",
      "Treat DataHub posting as verification of context artifacts, not as permission for unsafe workflow writes.",
    ],
    evidence_files: [
      "hackathon-assets/reproduction-receipt.md",
      "hackathon-assets/datahub-payload-preview.md",
      "hackathon-assets/live-datahub-runbook.md",
      "hackathon-assets/datahub-payload-preview.json",
      "hackathon-assets/context-tool-contracts.md",
      "hackathon-assets/safety-policy-matrix.md",
      "examples/cat-context-agent/generated-datahub-bridge-plan.json",
      "examples/cat-context-agent/generated-mcp-context-read.json",
    ],
  };

  await mkdir(assetDir, { recursive: true });
  await Promise.all([
    writeFile(paths.checklistJson, `${JSON.stringify(checklist, null, 2)}\n`),
    writeFile(paths.checklistMarkdown, renderMarkdown(checklist)),
  ]);

  return checklist;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const checklist = await runDataHubIntegrationChecklist();
  console.log(JSON.stringify({
    protocol: checklist.protocol,
    phases: checklist.phases.length,
    can_submit_now: checklist.decision_gates.can_submit_now,
    live_datahub_required_for_submission: checklist.decision_gates.live_datahub_required_for_submission,
    output: [
      "hackathon-assets/datahub-integration-checklist.json",
      "hackathon-assets/datahub-integration-checklist.md",
    ],
  }, null, 2));
  console.log(`Wrote ${paths.checklistJson}`);
  console.log(`Wrote ${paths.checklistMarkdown}`);
}
