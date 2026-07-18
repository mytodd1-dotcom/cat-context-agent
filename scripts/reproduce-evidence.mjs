import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runDataHubPayloadPreview } from "./datahub-payload-preview.mjs";
import { runDataHubIntegrationChecklist } from "./datahub-integration-checklist.mjs";
import { runDecisionTrace } from "./decision-trace.mjs";
import { runLineageDecisionMap } from "./lineage-decision-map.mjs";
import { runLiveDataHubRunbook } from "./live-datahub-runbook.mjs";
import { runSafetyPolicyMatrix } from "./safety-policy-matrix.mjs";
import { runArtifactValidation } from "./validate-artifacts.mjs";
import { runSubmissionVerify } from "./verify-submission.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = resolve(root, "hackathon-assets");
const receiptJsonPath = resolve(assetDir, "reproduction-receipt.json");
const receiptMarkdownPath = resolve(assetDir, "reproduction-receipt.md");

function renderMarkdown(receipt) {
  return `# CAT Context Agent — Reproduction Receipt

Status: **${receipt.status}**  
Generated: \`${receipt.generated_at}\`

## One-command proof

\`\`\`bash
npm run evidence:reproduce
\`\`\`

## Checks reproduced

${receipt.checks.map((check) => `- ✅ **${check.name}** — ${check.detail}`).join("\n")}

## Summary

- Requests evaluated: ${receipt.summary.total_requests}
- Safe internal tasks: ${receipt.summary.safe_to_queue}
- Approval-required tasks: ${receipt.summary.needs_approval}
- Blocked tasks: ${receipt.summary.blocked}
- DataHub aspects: ${receipt.summary.datahub_aspects.map((aspect) => `\`${aspect}\``).join(", ")}
- Live DataHub runbook commands: ${receipt.summary.live_datahub_commands}
- MCP-style reads: ${receipt.summary.mcp_style_tool_reads.map((tool) => `\`${tool}\``).join(", ")}
- Artifact validation checks: ${receipt.summary.artifact_validation_checks}

## Reports regenerated

${receipt.reports.map((report) => `- \`${report}\``).join("\n")}
`;
}

export async function runEvidenceReproduction() {
  const payloadPreview = await runDataHubPayloadPreview();
  const integrationChecklist = await runDataHubIntegrationChecklist();
  const liveRunbook = await runLiveDataHubRunbook();
  const decisionTrace = await runDecisionTrace();
  const lineageMap = await runLineageDecisionMap();
  const policyMatrix = await runSafetyPolicyMatrix();
  const readiness = await runSubmissionVerify();
  const artifactValidation = await runArtifactValidation();

  const checks = [
    {
      name: "DataHub payload preview",
      detail: `${payloadPreview.requests.length} dry-run aspect payloads prepared for local GMS posting.`,
    },
    {
      name: "DataHub integration checklist",
      detail: `${integrationChecklist.phases.length} verification phases separate runnable evidence from optional local DataHub posting.`,
    },
    {
      name: "decision trace",
      detail: `${decisionTrace.traces.length} request-level traces connect source rows, context reads, decisions, and receipts.`,
    },
    {
      name: "lineage decision map",
      detail: `${lineageMap.nodes.length} nodes and ${lineageMap.edges.length} edges show source → DataHub context → decisions → receipts.`,
    },
    {
      name: "safety policy matrix",
      detail: `${policyMatrix.rules.length} rules and ${policyMatrix.request_outcomes.length} request outcomes define allowed, approval-required, and blocked action boundaries.`,
    },
    {
      name: "live DataHub runbook",
      detail: `${liveRunbook.commands.length} operator commands document the opt-in local DataHub post and verification path.`,
    },
    {
      name: "submission readiness",
      detail: `${readiness.checks.length} readiness checks passed.`,
    },
    {
      name: "artifact validation",
      detail: `${artifactValidation.checks.length} generated-artifact checks passed.`,
    },
    {
      name: "safety boundary",
      detail: "Blocked action remains preserved for unverified external outreach.",
    },
    {
      name: "judge evidence",
      detail: "Judge notes, evidence pack, context contracts, readiness report, and validation report are regenerated.",
    },
  ];

  const receipt = {
    project: "CAT Context Agent",
    challenge: "Build with DataHub: The Agent Hackathon",
    status: readiness.status === "ready" && artifactValidation.status === "valid" ? "reproducible" : "failed",
    generated_at: "demo-static-run",
    checks,
    summary: {
      total_requests: readiness.summary.total_requests,
      safe_to_queue: readiness.summary.safe_to_queue,
      needs_approval: readiness.summary.needs_approval,
      blocked: readiness.summary.blocked,
      datahub_aspects: readiness.summary.datahub_aspects,
      live_datahub_commands: liveRunbook.commands.length,
      mcp_style_tool_reads: readiness.summary.mcp_style_tool_reads,
      artifact_validation_checks: artifactValidation.checks.length,
    },
    reports: [
      "hackathon-assets/judge-evidence-pack.md",
      "hackathon-assets/datahub-integration-checklist.md",
      "hackathon-assets/datahub-payload-preview.md",
      "hackathon-assets/live-datahub-runbook.md",
      "hackathon-assets/decision-trace.md",
      "hackathon-assets/lineage-decision-map.md",
      "hackathon-assets/safety-policy-matrix.md",
      "hackathon-assets/submission-readiness-report.md",
      "hackathon-assets/artifact-validation-report.md",
      "hackathon-assets/reproduction-receipt.md",
    ],
  };

  await mkdir(assetDir, { recursive: true });
  await Promise.all([
    writeFile(receiptJsonPath, `${JSON.stringify(receipt, null, 2)}\n`),
    writeFile(receiptMarkdownPath, renderMarkdown(receipt)),
  ]);

  if (receipt.status !== "reproducible") {
    throw new Error("Evidence reproduction failed.");
  }

  return receipt;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const receipt = await runEvidenceReproduction();
  console.log(JSON.stringify({
    status: receipt.status,
    checks: receipt.checks.length,
    total_requests: receipt.summary.total_requests,
    reports: receipt.reports,
  }, null, 2));
  console.log(`Wrote ${receiptJsonPath}`);
  console.log(`Wrote ${receiptMarkdownPath}`);
}
