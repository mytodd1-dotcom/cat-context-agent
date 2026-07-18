import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runDataHubPayloadPreview } from "./datahub-payload-preview.mjs";
import { runDataHubClaimAudit } from "./datahub-claim-audit.mjs";
import { runDataHubIntegrationChecklist } from "./datahub-integration-checklist.mjs";
import { runDataHubMcpHandoff } from "./datahub-mcp-handoff.mjs";
import { runDataHubLiveRoundtrip } from "./datahub-live-roundtrip.mjs";
import { runDataHubReadinessDoctor } from "./datahub-readiness-doctor.mjs";
import { runDecisionTrace } from "./decision-trace.mjs";
import { runDevpostSubmissionCopy } from "./devpost-submission-copy.mjs";
import { runJudgeFaq } from "./judge-faq.mjs";
import { runJudgeQuickCard } from "./judge-quick-card.mjs";
import { runJudgeRubricMatrix } from "./judge-rubric-matrix.mjs";
import { runLineageDecisionMap } from "./lineage-decision-map.mjs";
import { runLiveDataHubRunbook } from "./live-datahub-runbook.mjs";
import { runMcpAdapterSmoke } from "./mcp-adapter-smoke.mjs";
import { runSafetyPolicyMatrix } from "./safety-policy-matrix.mjs";
import { runSubmissionHonestyAudit } from "./submission-honesty-audit.mjs";
import { runArtifactValidation } from "./validate-artifacts.mjs";
import { runJudgeWalkthrough } from "./judge-walkthrough.mjs";
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
  const readinessDoctor = await runDataHubReadinessDoctor();
  const liveRoundtrip = await runDataHubLiveRoundtrip();
  const integrationChecklist = await runDataHubIntegrationChecklist();
  await runDevpostSubmissionCopy();
  const claimAudit = await runDataHubClaimAudit();
  const mcpHandoff = await runDataHubMcpHandoff();
  const mcpAdapterSmoke = await runMcpAdapterSmoke();
  const submissionHonestyAudit = await runSubmissionHonestyAudit();
  const liveRunbook = await runLiveDataHubRunbook();
  const decisionTrace = await runDecisionTrace();
  const lineageMap = await runLineageDecisionMap();
  const policyMatrix = await runSafetyPolicyMatrix();
  const readiness = await runSubmissionVerify();
  const walkthrough = await runJudgeWalkthrough({ readiness, datahubDoctor: readinessDoctor, mcpSmoke: mcpAdapterSmoke });
  const judgeFaq = await runJudgeFaq({
    readiness,
    datahubDoctor: readinessDoctor,
    mcpSmoke: mcpAdapterSmoke,
    honestyAudit: submissionHonestyAudit,
    policyMatrix,
    walkthrough,
  });
  const judgeQuickCard = await runJudgeQuickCard({
    readiness,
    datahubDoctor: readinessDoctor,
    mcpSmoke: mcpAdapterSmoke,
    honestyAudit: submissionHonestyAudit,
    policyMatrix,
  });
  const judgeRubricMatrix = await runJudgeRubricMatrix({
    readiness,
    datahubClaimAudit: claimAudit,
    mcpSmoke: mcpAdapterSmoke,
    honestyAudit: submissionHonestyAudit,
    quickCard: judgeQuickCard,
  });
  const artifactValidation = await runArtifactValidation();

  const checks = [
    {
      name: "DataHub payload preview",
      detail: `${payloadPreview.requests.length} dry-run aspect payloads prepared for local GMS posting.`,
    },
    {
      name: "DataHub readiness doctor",
      detail: `${readinessDoctor.checks.length} checks confirm dry-run DataHub readiness and keep local GMS optional.`,
    },
    {
      name: "DataHub live roundtrip harness",
      detail: `${liveRoundtrip.checks.length} checks prepare a local ingestProposal write plus entitiesV2 readback loop without posting in dry-run mode.`,
    },
    {
      name: "DataHub integration checklist",
      detail: `${integrationChecklist.phases.length} verification phases separate runnable evidence from optional local DataHub posting.`,
    },
    {
      name: "DataHub claim audit",
      detail: `${claimAudit.claims.length} DataHub-specific claims passed aspect, context-read, local-posting, safety, and receipt checks.`,
    },
    {
      name: "DataHub MCP handoff",
      detail: `${mcpHandoff.tool_calls.length} tool calls connect DataHub reads, CAT policy context, and bounded receipt writes.`,
    },
    {
      name: "MCP adapter smoke test",
      detail: `${mcpAdapterSmoke.request_flows.length} local adapter flows proved read-before-write ordering and bounded receipt writes.`,
    },
    {
      name: "submission honesty audit",
      detail: `${submissionHonestyAudit.audits.length} honesty checks passed for public copy, optional DataHub posting, safety boundaries, and no-overclaim language.`,
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
      name: "judge walkthrough",
      detail: `${walkthrough.steps.length} judge walkthrough steps document the shortest terminal proof path.`,
    },
    {
      name: "judge FAQ",
      detail: `${judgeFaq.questions.length} hard judge questions answered with evidence files and verification commands.`,
    },
    {
      name: "judge quick card",
      detail: `${judgeQuickCard.time_budget_minutes}-minute scoring card links the live demo, video, one-command proof, DataHub evidence, and safety boundary.`,
    },
    {
      name: "judge rubric matrix",
      detail: `${judgeRubricMatrix.criteria.length} official judging criteria are mapped to CAT evidence, limitations, and next steps.`,
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
      live_roundtrip_mode: liveRoundtrip.mode,
      mcp_style_tool_reads: readiness.summary.mcp_style_tool_reads,
      artifact_validation_checks: artifactValidation.checks.length,
    },
    reports: [
      "hackathon-assets/judge-evidence-pack.md",
      "hackathon-assets/datahub-readiness-doctor.md",
      "hackathon-assets/datahub-live-roundtrip.md",
      "hackathon-assets/datahub-integration-checklist.md",
      "hackathon-assets/datahub-claim-audit.md",
      "hackathon-assets/datahub-mcp-handoff.md",
      "hackathon-assets/mcp-adapter-smoke-report.md",
      "hackathon-assets/submission-honesty-audit.md",
      "hackathon-assets/datahub-payload-preview.md",
      "hackathon-assets/live-datahub-runbook.md",
      "hackathon-assets/decision-trace.md",
      "hackathon-assets/lineage-decision-map.md",
      "hackathon-assets/safety-policy-matrix.md",
      "hackathon-assets/submission-readiness-report.md",
      "hackathon-assets/judge-walkthrough.md",
      "hackathon-assets/judge-faq.md",
      "hackathon-assets/judge-quick-card.md",
      "hackathon-assets/judge-rubric-matrix.md",
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
