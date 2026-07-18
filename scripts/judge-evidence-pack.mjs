import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const exampleDir = resolve(root, "examples/cat-context-agent");
const assetDir = resolve(root, "hackathon-assets");

const paths = {
  output: resolve(exampleDir, "generated-agent-output.json"),
  metadata: resolve(exampleDir, "generated-datahub-metadata.json"),
  bridge: resolve(exampleDir, "generated-datahub-bridge-plan.json"),
  contextRead: resolve(exampleDir, "generated-mcp-context-read.json"),
  packJson: resolve(assetDir, "judge-evidence-pack.json"),
  packMarkdown: resolve(assetDir, "judge-evidence-pack.md"),
};

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

function countByDecision(receipts) {
  return receipts.reduce((counts, receipt) => {
    counts[receipt.decision] = (counts[receipt.decision] ?? 0) + 1;
    return counts;
  }, {});
}

function markdownTable(rows) {
  return [
    "| Request | Decision | Safe next step | Blocked action |",
    "| --- | --- | --- | --- |",
    ...rows.map((row) =>
      `| ${row.request_id} | ${row.decision} | ${row.safe_next_step} | ${row.blocked_action ?? "—"} |`,
    ),
  ].join("\n");
}

function buildEvidencePack({ output, metadata, bridge, contextRead }) {
  const decisionCounts = countByDecision(output.receipts);
  const lowConfidenceFields = contextRead.context.low_confidence_fields.map((field) => field.field);
  const datahubAspects = bridge.proposals.map((proposal) => proposal.aspectName);
  const toolReads = contextRead.tool_read_plan.map((tool) => tool.name);

  return {
    project: "CAT Context Agent",
    challenge: "Build with DataHub: The Agent Hackathon",
    category: "Agents That Do Real Work",
    repo_url: "https://github.com/mytodd1-dotcom/cat-context-agent",
    live_demo_url: "https://cat-context-agent.flyguy.chatgpt.site",
    demo_video: "https://youtu.be/Gcbhl5_YlSM",
    evidence_generated_at: "demo-static-run",
    summary: {
      source_asset: output.source_asset,
      total_requests: output.summary.total_requests,
      decisions: decisionCounts,
      datahub_entity: metadata.entityUrn,
      datahub_aspects: datahubAspects,
      mcp_style_tool_reads: toolReads,
      low_confidence_fields: lowConfidenceFields,
    },
    safety_claims: [
      "The agent reads schema, ownership, lineage, and policy context before recommending action.",
      "Internal tasks can be queued when owner/contact context is sufficient.",
      "External outreach is approval-gated or blocked when owner/contact context is missing.",
      "Every recommendation emits a receipt with source asset, checked context, confidence, and blocked action.",
    ],
    judge_commands: [
      "npm install",
      "npm run demo",
      "npm run datahub:bridge",
      "npm run datahub:payload",
      "npm run datahub:runbook",
      "npm run datahub:doctor",
      "npm run datahub:checklist",
      "npm run datahub:audit",
      "npm run datahub:mcp",
      "npm run mcp:smoke",
      "npm run submission:honesty",
      "npm run context:read",
      "npm run judge:walkthrough",
      "npm run judge:faq",
      "npm run judge:quick",
      "npm run judge:rubric",
      "npm run lineage:map",
      "npm run policy:matrix",
      "npm run judge:pack",
      "npm test",
    ],
    artifacts_to_inspect: [
      "examples/cat-context-agent/messy-business-requests.csv",
      "examples/cat-context-agent/generated-agent-output.json",
      "examples/cat-context-agent/generated-datahub-metadata.json",
      "examples/cat-context-agent/generated-datahub-bridge-plan.json",
      "hackathon-assets/datahub-payload-preview.md",
      "hackathon-assets/live-datahub-runbook.md",
      "hackathon-assets/datahub-readiness-doctor.md",
      "hackathon-assets/datahub-integration-checklist.md",
      "hackathon-assets/datahub-claim-audit.md",
      "hackathon-assets/datahub-mcp-handoff.md",
      "hackathon-assets/mcp-adapter-smoke-report.md",
      "hackathon-assets/submission-honesty-audit.md",
      "examples/cat-context-agent/generated-mcp-context-read.json",
      "hackathon-assets/judge-walkthrough.md",
      "hackathon-assets/judge-faq.md",
      "hackathon-assets/judge-quick-card.md",
      "hackathon-assets/judge-rubric-matrix.md",
      "hackathon-assets/decision-trace.md",
      "hackathon-assets/lineage-decision-map.md",
      "hackathon-assets/safety-policy-matrix.md",
      "hackathon-assets/context-tool-contracts.md",
      "hackathon-assets/artifact-validation-report.md",
      "hackathon-assets/reproduction-receipt.md",
      "hackathon-assets/judge-scoring-brief.md",
      "hackathon-assets/cat-context-agent-demo-preview.mp4",
    ],
    decisions: output.receipts.map((receipt) => ({
      request_id: receipt.request_id,
      account: receipt.account,
      decision: receipt.decision,
      missing_context: receipt.missing_context,
      safe_next_step: receipt.safe_next_step,
      blocked_action: receipt.blocked_action,
      confidence: receipt.confidence,
    })),
  };
}

function renderMarkdown(pack) {
  return `# CAT Context Agent — Judge Evidence Pack

Repo: [${pack.repo_url}](${pack.repo_url})  
Live demo / test URL: [${pack.live_demo_url}](${pack.live_demo_url})  
Demo video: [${pack.demo_video}](${pack.demo_video})  
Challenge: ${pack.challenge} / ${pack.category}

## What this proves

CAT Context Agent turns messy business requests into safe, traceable workflow decisions by reading DataHub-style context before action.

- Source asset: \`${pack.summary.source_asset}\`
- DataHub entity: \`${pack.summary.datahub_entity}\`
- Requests evaluated: ${pack.summary.total_requests}
- Decisions: \`${JSON.stringify(pack.summary.decisions)}\`
- DataHub aspects prepared: ${pack.summary.datahub_aspects.map((aspect) => `\`${aspect}\``).join(", ")}
- MCP-style reads simulated: ${pack.summary.mcp_style_tool_reads.map((tool) => `\`${tool}\``).join(", ")}
- Low-confidence fields surfaced: ${pack.summary.low_confidence_fields.map((field) => `\`${field}\``).join(", ")}

## Safety claims

${pack.safety_claims.map((claim) => `- ${claim}`).join("\n")}

## Decision receipts

${markdownTable(pack.decisions)}

## Reproduce locally

\`\`\`bash
${pack.judge_commands.join("\n")}
\`\`\`

## Files worth inspecting

${pack.artifacts_to_inspect.map((artifact) => `- \`${artifact}\``).join("\n")}
`;
}

export async function runJudgeEvidencePack() {
  const [output, metadata, bridge, contextRead] = await Promise.all([
    readJson(paths.output),
    readJson(paths.metadata),
    readJson(paths.bridge),
    readJson(paths.contextRead),
  ]);

  const pack = buildEvidencePack({ output, metadata, bridge, contextRead });
  await mkdir(assetDir, { recursive: true });
  await Promise.all([
    writeFile(paths.packJson, `${JSON.stringify(pack, null, 2)}\n`),
    writeFile(paths.packMarkdown, renderMarkdown(pack)),
  ]);
  return pack;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const pack = await runJudgeEvidencePack();
  console.log(JSON.stringify({
    project: pack.project,
    total_requests: pack.summary.total_requests,
    decisions: pack.summary.decisions,
    datahub_aspects: pack.summary.datahub_aspects,
    mcp_style_tool_reads: pack.summary.mcp_style_tool_reads,
  }, null, 2));
  console.log(`Wrote ${paths.packJson}`);
  console.log(`Wrote ${paths.packMarkdown}`);
}
