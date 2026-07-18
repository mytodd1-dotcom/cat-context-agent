import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const exampleDir = resolve(root, "examples/cat-context-agent");
const assetDir = resolve(root, "hackathon-assets");

const paths = {
  agentOutput: resolve(exampleDir, "generated-agent-output.json"),
  metadata: resolve(exampleDir, "generated-datahub-metadata.json"),
  bridgePlan: resolve(exampleDir, "generated-datahub-bridge-plan.json"),
  contextRead: resolve(exampleDir, "generated-mcp-context-read.json"),
  contracts: resolve(assetDir, "context-tool-contracts.json"),
  liveRunbook: resolve(assetDir, "live-datahub-runbook.json"),
  liveRunbookMarkdown: resolve(assetDir, "live-datahub-runbook.md"),
  datahubReadinessDoctor: resolve(assetDir, "datahub-readiness-doctor.json"),
  datahubReadinessDoctorMarkdown: resolve(assetDir, "datahub-readiness-doctor.md"),
  datahubChecklist: resolve(assetDir, "datahub-integration-checklist.json"),
  datahubChecklistMarkdown: resolve(assetDir, "datahub-integration-checklist.md"),
  datahubClaimAudit: resolve(assetDir, "datahub-claim-audit.json"),
  datahubClaimAuditMarkdown: resolve(assetDir, "datahub-claim-audit.md"),
  datahubMcpHandoff: resolve(assetDir, "datahub-mcp-handoff.json"),
  datahubMcpHandoffMarkdown: resolve(assetDir, "datahub-mcp-handoff.md"),
  mcpAdapterSmoke: resolve(assetDir, "mcp-adapter-smoke-report.json"),
  mcpAdapterSmokeMarkdown: resolve(assetDir, "mcp-adapter-smoke-report.md"),
  submissionHonestyAudit: resolve(assetDir, "submission-honesty-audit.json"),
  submissionHonestyAuditMarkdown: resolve(assetDir, "submission-honesty-audit.md"),
  lineageMap: resolve(assetDir, "lineage-decision-map.json"),
  lineageMapMarkdown: resolve(assetDir, "lineage-decision-map.md"),
  safetyPolicyMatrix: resolve(assetDir, "safety-policy-matrix.json"),
  safetyPolicyMatrixMarkdown: resolve(assetDir, "safety-policy-matrix.md"),
  judgePack: resolve(assetDir, "judge-evidence-pack.json"),
  readiness: resolve(assetDir, "submission-readiness-report.json"),
  judgeWalkthrough: resolve(assetDir, "judge-walkthrough.json"),
  judgeWalkthroughMarkdown: resolve(assetDir, "judge-walkthrough.md"),
  judgeFaq: resolve(assetDir, "judge-faq.json"),
  judgeFaqMarkdown: resolve(assetDir, "judge-faq.md"),
  judgeQuickCard: resolve(assetDir, "judge-quick-card.json"),
  judgeQuickCardMarkdown: resolve(assetDir, "judge-quick-card.md"),
  judgeRubricMatrix: resolve(assetDir, "judge-rubric-matrix.json"),
  judgeRubricMatrixMarkdown: resolve(assetDir, "judge-rubric-matrix.md"),
  judgePackMarkdown: resolve(assetDir, "judge-evidence-pack.md"),
  reportJson: resolve(assetDir, "artifact-validation-report.json"),
  reportMarkdown: resolve(assetDir, "artifact-validation-report.md"),
};

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

function hasAll(values, expected) {
  return expected.every((item) => values.includes(item));
}

function result(name, ok, detail) {
  return { name, ok: Boolean(ok), detail };
}

function renderMarkdown(report) {
  return `# CAT Context Agent — Artifact Validation Report

Status: **${report.status}**  
Generated: \`${report.generated_at}\`

## Validation checks

${report.checks.map((check) => `- ${check.ok ? "✅" : "❌"} **${check.name}** — ${check.detail}`).join("\n")}

## Validated files

${report.validated_files.map((file) => `- \`${file}\``).join("\n")}
`;
}

export async function runArtifactValidation() {
  const [
    agentOutput,
    metadata,
    bridgePlan,
    contextRead,
    contracts,
    liveRunbook,
    liveRunbookMarkdown,
    datahubReadinessDoctor,
    datahubReadinessDoctorMarkdown,
    datahubChecklist,
    datahubChecklistMarkdown,
    datahubClaimAudit,
    datahubClaimAuditMarkdown,
    datahubMcpHandoff,
    datahubMcpHandoffMarkdown,
    mcpAdapterSmoke,
    mcpAdapterSmokeMarkdown,
    submissionHonestyAudit,
    submissionHonestyAuditMarkdown,
    lineageMap,
    lineageMapMarkdown,
    safetyPolicyMatrix,
    safetyPolicyMatrixMarkdown,
    judgePack,
    readiness,
    judgeWalkthrough,
    judgeWalkthroughMarkdown,
    judgeFaq,
    judgeFaqMarkdown,
    judgeQuickCard,
    judgeQuickCardMarkdown,
    judgeRubricMatrix,
    judgeRubricMatrixMarkdown,
    judgePackMarkdown,
  ] = await Promise.all([
    readJson(paths.agentOutput),
    readJson(paths.metadata),
    readJson(paths.bridgePlan),
    readJson(paths.contextRead),
    readJson(paths.contracts),
    readJson(paths.liveRunbook),
    readFile(paths.liveRunbookMarkdown, "utf8"),
    readJson(paths.datahubReadinessDoctor),
    readFile(paths.datahubReadinessDoctorMarkdown, "utf8"),
    readJson(paths.datahubChecklist),
    readFile(paths.datahubChecklistMarkdown, "utf8"),
    readJson(paths.datahubClaimAudit),
    readFile(paths.datahubClaimAuditMarkdown, "utf8"),
    readJson(paths.datahubMcpHandoff),
    readFile(paths.datahubMcpHandoffMarkdown, "utf8"),
    readJson(paths.mcpAdapterSmoke),
    readFile(paths.mcpAdapterSmokeMarkdown, "utf8"),
    readJson(paths.submissionHonestyAudit),
    readFile(paths.submissionHonestyAuditMarkdown, "utf8"),
    readJson(paths.lineageMap),
    readFile(paths.lineageMapMarkdown, "utf8"),
    readJson(paths.safetyPolicyMatrix),
    readFile(paths.safetyPolicyMatrixMarkdown, "utf8"),
    readJson(paths.judgePack),
    readJson(paths.readiness),
    readJson(paths.judgeWalkthrough),
    readFile(paths.judgeWalkthroughMarkdown, "utf8"),
    readJson(paths.judgeFaq),
    readFile(paths.judgeFaqMarkdown, "utf8"),
    readJson(paths.judgeQuickCard),
    readFile(paths.judgeQuickCardMarkdown, "utf8"),
    readJson(paths.judgeRubricMatrix),
    readFile(paths.judgeRubricMatrixMarkdown, "utf8"),
    readFile(paths.judgePackMarkdown, "utf8"),
  ]);

  const aspectNames = bridgePlan.proposals.map((proposal) => proposal.aspectName);
  const toolNames = contracts.tools.map((tool) => tool.name);
  const contextReadTools = contextRead.tool_read_plan.map((tool) => tool.name);

  const checks = [
    result(
      "decision summary",
      agentOutput.summary.total_requests === 3 &&
        agentOutput.summary.safe_to_queue === 1 &&
        agentOutput.summary.needs_approval === 1 &&
        agentOutput.summary.blocked === 1,
      "Agent output should include 3 requests: 1 safe, 1 approval-required, 1 blocked.",
    ),
    result(
      "DataHub metadata shape",
      metadata.entityUrn === "urn:li:dataset:(cat,messy_business_requests,PROD)" &&
        hasAll(Object.keys(metadata.aspects), ["datasetProperties", "schemaMetadata", "ownership", "glossaryTerms"]),
      "Generated metadata should include the expected dataset URN and four DataHub aspects.",
    ),
    result(
      "bridge plan mirrors DataHub aspects",
      bridgePlan.mode === "dry-run" &&
        hasAll(aspectNames, ["datasetProperties", "schemaMetadata", "ownership", "glossaryTerms"]),
      "Bridge plan should remain dry-run and map all expected aspects.",
    ),
    result(
      "context read tool path",
      hasAll(contextReadTools, ["datahub.get_entity", "datahub.get_lineage", "cat.get_agent_context_packet"]) &&
        contextRead.blocked.some((item) => item.request_id === "REQ-1044"),
      "Context read should include DataHub/CAT read tools and preserve the blocked customer action.",
    ),
    result(
      "tool contract coverage",
      contracts.protocol === "cat-context-tool-contracts-v0" &&
        hasAll(toolNames, ["datahub.get_entity", "datahub.get_lineage", "cat.get_agent_context_packet", "cat.write_receipt"]),
      "Tool contracts should cover DataHub reads, CAT context read, and guarded receipt write.",
    ),
    result(
      "live DataHub runbook",
      liveRunbook.protocol === "cat-live-datahub-runbook-v0" &&
        liveRunbook.status === "ready_for_local_datahub" &&
        liveRunbook.dry_run_payloads.length === 4 &&
        liveRunbook.commands.some((command) => command.command.includes("--post")) &&
        liveRunbookMarkdown.includes("DATAHUB_GMS_URL=http://localhost:8080 npm run datahub:bridge -- --post"),
      "Live runbook should document the opt-in local DataHub post path and preserve the dry-run payload coverage.",
    ),
    result(
      "DataHub readiness doctor",
      datahubReadinessDoctor.protocol === "cat-datahub-readiness-doctor-v0" &&
        datahubReadinessDoctor.status.startsWith("ready_") &&
        datahubReadinessDoctor.checks.length === 6 &&
        datahubReadinessDoctor.checks.every((item) => item.ok) &&
        datahubReadinessDoctor.probe.required_for_judging === false &&
        datahubReadinessDoctorMarkdown.includes("DataHub Readiness Doctor"),
      "Readiness doctor should prove dry-run DataHub artifacts are ready while live GMS remains optional.",
    ),
    result(
      "DataHub integration checklist",
      datahubChecklist.protocol === "cat-datahub-integration-checklist-v0" &&
        datahubChecklist.decision_gates.can_submit_now === true &&
        datahubChecklist.decision_gates.live_datahub_required_for_submission === false &&
        datahubChecklist.decision_gates.secrets_required === false &&
        datahubChecklist.phases.some((phase) => phase.command.includes("--post")) &&
        datahubChecklistMarkdown.includes("Live DataHub required to judge current submission: **no**"),
      "Integration checklist should separate no-credential judging from optional local DataHub posting.",
    ),
    result(
      "DataHub claim audit",
      datahubClaimAudit.protocol === "cat-datahub-claim-audit-v0" &&
        datahubClaimAudit.status === "passed" &&
        datahubClaimAudit.claims.length === 5 &&
        datahubClaimAudit.claims.every((claim) => claim.ok) &&
        datahubClaimAuditMarkdown.includes("DataHub Claim Audit"),
      "DataHub claim audit should pass every DataHub-specific claim check.",
    ),
    result(
      "DataHub MCP handoff",
      datahubMcpHandoff.protocol === "cat-datahub-mcp-handoff-v0" &&
        datahubMcpHandoff.status === "ready_for_mcp_adapter" &&
        hasAll(datahubMcpHandoff.tool_calls.map((tool) => tool.name), [
          "datahub.get_entity",
          "datahub.get_lineage",
          "cat.get_agent_context_packet",
          "cat.write_receipt",
        ]) &&
        datahubMcpHandoff.local_to_live_boundary.secrets_required_for_judging === false &&
        datahubMcpHandoffMarkdown.includes("DataHub MCP Handoff"),
      "DataHub MCP handoff should map read-before-action tools to bounded receipt writes.",
    ),
    result(
      "MCP adapter smoke test",
      mcpAdapterSmoke.protocol === "cat-mcp-adapter-smoke-v0" &&
        mcpAdapterSmoke.status === "passed" &&
        mcpAdapterSmoke.request_flows.length === 3 &&
        mcpAdapterSmoke.tool_sequence.length === 12 &&
        mcpAdapterSmoke.external_side_effects === "none" &&
        mcpAdapterSmoke.contract_checks.every((check) => check.ok) &&
        mcpAdapterSmokeMarkdown.includes("MCP Adapter Smoke Report"),
      "MCP adapter smoke test should prove read-before-write ordering and bounded local receipt writes.",
    ),
    result(
      "submission honesty audit",
      submissionHonestyAudit.protocol === "cat-submission-honesty-audit-v0" &&
        submissionHonestyAudit.status === "passed" &&
        submissionHonestyAudit.audits.length === 5 &&
        submissionHonestyAudit.audits.every((item) => item.ok) &&
        submissionHonestyAuditMarkdown.includes("Submission Honesty Audit"),
      "Honesty audit should prove public copy separates runnable evidence from optional live DataHub work and avoids overclaims.",
    ),
    result(
      "judge pack references generated evidence",
      judgePack.artifacts_to_inspect.includes("hackathon-assets/context-tool-contracts.md") &&
        judgePack.artifacts_to_inspect.includes("hackathon-assets/lineage-decision-map.md") &&
        judgePackMarkdown.includes("Do not guess, scrape, or invent contact details"),
      "Judge pack should point to context contracts and include the blocked-action receipt.",
    ),
    result(
      "lineage decision map",
      lineageMap.protocol === "cat-lineage-decision-map-v0" &&
        lineageMap.nodes.some((node) => node.id === "datahub_asset") &&
        lineageMap.edges.some((edge) => edge.from === "context_reads" && edge.to === "cat_decision_loop") &&
        lineageMap.decisions.length === 3 &&
        lineageMapMarkdown.includes("flowchart LR"),
      "Lineage map should show the DataHub asset, context reads, decision loop, and all three decision branches.",
    ),
    result(
      "safety policy matrix",
      safetyPolicyMatrix.protocol === "cat-safety-policy-matrix-v0" &&
        safetyPolicyMatrix.rules.some((rule) => rule.action === "send_external_outreach" && rule.class === "approval_required") &&
        safetyPolicyMatrix.blocked_actions.includes("scrape_contact_details") &&
        safetyPolicyMatrix.request_outcomes.length === 3 &&
        safetyPolicyMatrixMarkdown.includes("Safety Policy Matrix"),
      "Safety policy matrix should define allowed, approval-required, and blocked action boundaries for all three requests.",
    ),
    result(
      "readiness report",
      readiness.status === "ready" &&
        readiness.checks.every((check) => check.ok) &&
        readiness.checks.some((check) => check.name === "context tool contracts"),
      "Readiness report should be ready, all checks passing, and include context tool contracts.",
    ),
    result(
      "judge walkthrough",
      judgeWalkthrough.protocol === "cat-judge-walkthrough-v0" &&
        judgeWalkthrough.status === "ready" &&
        judgeWalkthrough.steps.length === 5 &&
        judgeWalkthrough.evidence_snapshot.external_side_effects === "none" &&
        judgeWalkthroughMarkdown.includes("Five-minute path"),
      "Judge walkthrough should document the shortest proof path and preserve the no-external-side-effects boundary.",
    ),
    result(
      "judge FAQ",
      judgeFaq.protocol === "cat-judge-faq-v0" &&
        judgeFaq.status === "ready" &&
        judgeFaq.questions.length === 5 &&
        judgeFaq.quick_facts.external_side_effects === "none" &&
        judgeFaqMarkdown.includes("Judge FAQ"),
      "Judge FAQ should answer the hard reviewer questions with evidence files and verification commands.",
    ),
    result(
      "judge quick card",
      judgeQuickCard.protocol === "cat-judge-quick-card-v0" &&
        judgeQuickCard.status === "ready" &&
        judgeQuickCard.time_budget_minutes === 2 &&
        judgeQuickCard.fastest_local_command === "npm run evidence:reproduce" &&
        judgeQuickCard.datahub_evidence.local_datahub_required_for_judging === false &&
        judgeQuickCard.safety_boundary.external_side_effects === "none" &&
        judgeQuickCardMarkdown.includes("2-Minute Judge Card"),
      "Judge quick card should give reviewers the fastest links, proof command, claim map, and safety boundary.",
    ),
    result(
      "judge rubric matrix",
      judgeRubricMatrix.protocol === "cat-judge-rubric-matrix-v0" &&
        judgeRubricMatrix.status === "ready" &&
        judgeRubricMatrix.criteria.length === 6 &&
        judgeRubricMatrix.criteria.some((item) => item.criterion === "Use of DataHub") &&
        judgeRubricMatrix.criteria.some((item) => item.criterion === "Technical Execution") &&
        judgeRubricMatrix.signals.external_side_effects === "none" &&
        judgeRubricMatrixMarkdown.includes("Judge Rubric Matrix"),
      "Judge rubric matrix should map the official criteria to concrete CAT evidence and limitations.",
    ),
  ];

  const report = {
    status: checks.every((check) => check.ok) ? "valid" : "invalid",
    generated_at: "demo-static-run",
    checks,
    validated_files: [
      "examples/cat-context-agent/generated-agent-output.json",
      "examples/cat-context-agent/generated-datahub-metadata.json",
      "examples/cat-context-agent/generated-datahub-bridge-plan.json",
      "examples/cat-context-agent/generated-mcp-context-read.json",
      "hackathon-assets/context-tool-contracts.json",
      "hackathon-assets/live-datahub-runbook.json",
      "hackathon-assets/datahub-readiness-doctor.json",
      "hackathon-assets/datahub-integration-checklist.json",
      "hackathon-assets/datahub-claim-audit.json",
      "hackathon-assets/datahub-mcp-handoff.json",
      "hackathon-assets/mcp-adapter-smoke-report.json",
      "hackathon-assets/submission-honesty-audit.json",
      "hackathon-assets/lineage-decision-map.json",
      "hackathon-assets/safety-policy-matrix.json",
      "hackathon-assets/judge-evidence-pack.json",
      "hackathon-assets/submission-readiness-report.json",
      "hackathon-assets/judge-walkthrough.json",
      "hackathon-assets/judge-faq.json",
      "hackathon-assets/judge-quick-card.json",
      "hackathon-assets/judge-rubric-matrix.json",
    ],
  };

  await mkdir(assetDir, { recursive: true });
  await Promise.all([
    writeFile(paths.reportJson, `${JSON.stringify(report, null, 2)}\n`),
    writeFile(paths.reportMarkdown, renderMarkdown(report)),
  ]);

  if (report.status !== "valid") {
    throw new Error(`Artifact validation failed: ${checks.filter((check) => !check.ok).map((check) => check.name).join(", ")}`);
  }

  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const report = await runArtifactValidation();
  console.log(JSON.stringify({
    status: report.status,
    checks: report.checks.length,
    validated_files: report.validated_files.length,
  }, null, 2));
  console.log(`Wrote ${paths.reportJson}`);
  console.log(`Wrote ${paths.reportMarkdown}`);
}
