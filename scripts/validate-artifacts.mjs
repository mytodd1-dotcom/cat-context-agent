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
  lineageMap: resolve(assetDir, "lineage-decision-map.json"),
  lineageMapMarkdown: resolve(assetDir, "lineage-decision-map.md"),
  judgePack: resolve(assetDir, "judge-evidence-pack.json"),
  readiness: resolve(assetDir, "submission-readiness-report.json"),
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
    lineageMap,
    lineageMapMarkdown,
    judgePack,
    readiness,
    judgePackMarkdown,
  ] = await Promise.all([
    readJson(paths.agentOutput),
    readJson(paths.metadata),
    readJson(paths.bridgePlan),
    readJson(paths.contextRead),
    readJson(paths.contracts),
    readJson(paths.liveRunbook),
    readFile(paths.liveRunbookMarkdown, "utf8"),
    readJson(paths.lineageMap),
    readFile(paths.lineageMapMarkdown, "utf8"),
    readJson(paths.judgePack),
    readJson(paths.readiness),
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
      "readiness report",
      readiness.status === "ready" &&
        readiness.checks.every((check) => check.ok) &&
        readiness.checks.some((check) => check.name === "context tool contracts"),
      "Readiness report should be ready, all checks passing, and include context tool contracts.",
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
      "hackathon-assets/lineage-decision-map.json",
      "hackathon-assets/judge-evidence-pack.json",
      "hackathon-assets/submission-readiness-report.json",
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
