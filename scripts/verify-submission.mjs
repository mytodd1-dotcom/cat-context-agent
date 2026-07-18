import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runContextProvider } from "./cat-context-provider.mjs";
import { runDemo } from "./cat-context-demo.mjs";
import { runBridge } from "./datahub-local-bridge.mjs";
import { runJudgeEvidencePack } from "./judge-evidence-pack.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = resolve(root, "hackathon-assets");
const reportJsonPath = resolve(assetDir, "submission-readiness-report.json");
const reportMarkdownPath = resolve(assetDir, "submission-readiness-report.md");

function assertCondition(condition, message) {
  if (!condition) throw new Error(message);
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

function check(name, condition, details) {
  return {
    name,
    ok: Boolean(condition),
    details,
  };
}

function renderMarkdown(report) {
  return `# CAT Context Agent — Submission Readiness Report

Status: **${report.status}**  
Generated: \`${report.generated_at}\`

## Checks

${report.checks.map((item) => `- ${item.ok ? "✅" : "❌"} **${item.name}** — ${item.details}`).join("\n")}

## Summary

- Requests evaluated: ${report.summary.total_requests}
- Safe internal tasks: ${report.summary.safe_to_queue}
- Approval-required tasks: ${report.summary.needs_approval}
- Blocked tasks: ${report.summary.blocked}
- DataHub aspects: ${report.summary.datahub_aspects.map((aspect) => `\`${aspect}\``).join(", ")}
- MCP-style reads: ${report.summary.mcp_style_tool_reads.map((tool) => `\`${tool}\``).join(", ")}

## Artifacts regenerated

${report.artifacts.map((artifact) => `- \`${artifact}\``).join("\n")}
`;
}

export async function runSubmissionVerify() {
  const demo = await runDemo();
  const bridge = await runBridge();
  const contextRead = await runContextProvider();
  const pack = await runJudgeEvidencePack();

  const datahubMetadata = await readJson(resolve(root, "examples/cat-context-agent/generated-datahub-metadata.json"));

  const datahubAspects = bridge.plan.proposals.map((proposal) => proposal.aspectName);
  const toolReads = contextRead.tool_read_plan.map((tool) => tool.name);

  const checks = [
    check(
      "demo decision totals",
      demo.summary.total_requests === 3 &&
        demo.summary.safe_to_queue === 1 &&
        demo.summary.needs_approval === 1 &&
        demo.summary.blocked === 1,
      "Expected 3 requests: 1 safe internal task, 1 approval-required task, and 1 blocked task.",
    ),
    check(
      "DataHub metadata payload",
      datahubMetadata.entityUrn === "urn:li:dataset:(cat,messy_business_requests,PROD)" &&
        ["datasetProperties", "schemaMetadata", "ownership", "glossaryTerms"].every((aspect) =>
          datahubAspects.includes(aspect),
        ),
      "Expected dataset URN plus datasetProperties, schemaMetadata, ownership, and glossaryTerms aspects.",
    ),
    check(
      "MCP-style context reads",
      ["datahub.get_entity", "datahub.get_lineage", "cat.get_agent_context_packet"].every((tool) =>
        toolReads.includes(tool),
      ),
      "Expected the agent read path to include DataHub entity, DataHub lineage, and CAT context packet reads.",
    ),
    check(
      "safety boundary",
      contextRead.context.blocked_actions.includes("send_external_outreach_without_verified_contact") &&
        contextRead.blocked.some((item) => item.request_id === "REQ-1044"),
      "Expected unverified external outreach to remain blocked.",
    ),
    check(
      "judge pack",
      pack.summary.total_requests === 3 &&
        pack.safety_claims.some((claim) => claim.includes("External outreach")) &&
        pack.artifacts_to_inspect.includes("examples/cat-context-agent/generated-mcp-context-read.json"),
      "Expected judge evidence pack to summarize commands, safety claims, and inspectable artifacts.",
    ),
  ];

  for (const item of checks) {
    assertCondition(item.ok, `Submission verification failed: ${item.name}`);
  }

  const report = {
    status: "ready",
    generated_at: "demo-static-run",
    summary: {
      total_requests: demo.summary.total_requests,
      safe_to_queue: demo.summary.safe_to_queue,
      needs_approval: demo.summary.needs_approval,
      blocked: demo.summary.blocked,
      datahub_aspects: datahubAspects,
      mcp_style_tool_reads: toolReads,
    },
    checks,
    artifacts: [
      "examples/cat-context-agent/generated-agent-output.json",
      "examples/cat-context-agent/generated-datahub-metadata.json",
      "examples/cat-context-agent/generated-datahub-bridge-plan.json",
      "examples/cat-context-agent/generated-mcp-context-read.json",
      "hackathon-assets/judge-evidence-pack.md",
      "hackathon-assets/submission-readiness-report.md",
    ],
  };

  await mkdir(assetDir, { recursive: true });
  await Promise.all([
    writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`),
    writeFile(reportMarkdownPath, renderMarkdown(report)),
  ]);

  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const report = await runSubmissionVerify();
  console.log(JSON.stringify({
    status: report.status,
    checks: report.checks.length,
    total_requests: report.summary.total_requests,
    datahub_aspects: report.summary.datahub_aspects,
    mcp_style_tool_reads: report.summary.mcp_style_tool_reads,
  }, null, 2));
  console.log(`Wrote ${reportJsonPath}`);
  console.log(`Wrote ${reportMarkdownPath}`);
}
