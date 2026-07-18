import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runContextProvider } from "./cat-context-provider.mjs";
import { runDecisionTrace } from "./decision-trace.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = resolve(root, "hackathon-assets");

const paths = {
  mapJson: resolve(assetDir, "lineage-decision-map.json"),
  mapMarkdown: resolve(assetDir, "lineage-decision-map.md"),
};

const fixedNodes = [
  {
    id: "uploaded_csv",
    label: "Uploaded messy CSV",
    type: "source",
    evidence: "examples/cat-context-agent/messy-business-requests.csv",
  },
  {
    id: "datahub_asset",
    label: "DataHub dataset asset",
    type: "catalog",
    evidence: "examples/cat-context-agent/generated-datahub-metadata.json",
  },
  {
    id: "context_reads",
    label: "MCP/DataHub context reads",
    type: "context",
    evidence: "examples/cat-context-agent/generated-mcp-context-read.json",
  },
  {
    id: "cat_decision_loop",
    label: "CAT agent decision loop",
    type: "agent",
    evidence: "hackathon-assets/decision-trace.md",
  },
  {
    id: "approval_queue",
    label: "Approval queue",
    type: "workflow",
    evidence: "examples/cat-context-agent/generated-agent-output.json",
  },
  {
    id: "receipt_store",
    label: "Receipt artifacts",
    type: "receipt",
    evidence: "examples/cat-context-agent/agent-receipts.json",
  },
];

const fixedEdges = [
  ["uploaded_csv", "datahub_asset", "catalogs as"],
  ["datahub_asset", "context_reads", "read before action"],
  ["context_reads", "cat_decision_loop", "grounds"],
  ["cat_decision_loop", "approval_queue", "routes uncertain work"],
  ["cat_decision_loop", "receipt_store", "writes evidence"],
];

function mermaidId(id) {
  return id.replace(/[^a-zA-Z0-9_]/g, "_");
}

function mermaidLabel(text) {
  return text.replace(/"/g, "'");
}

function decisionNodeFor(trace) {
  return {
    id: `decision_${trace.request_id}`,
    label: `${trace.request_id}: ${trace.decision}`,
    type: "decision",
    evidence: trace.receipt_id,
    request_id: trace.request_id,
    account: trace.account,
    safe_next_step: trace.safe_next_step,
    blocked_action: trace.blocked_action,
    confidence: trace.confidence,
  };
}

function buildMermaid(map) {
  const nodeLines = map.nodes.map((node) => {
    const shape = node.type === "decision" ? ["{{", "}}"] : ["[", "]"];
    return `  ${mermaidId(node.id)}${shape[0]}"${mermaidLabel(node.label)}"${shape[1]}`;
  });
  const edgeLines = map.edges.map((edge) =>
    `  ${mermaidId(edge.from)} -->|"${mermaidLabel(edge.label)}"| ${mermaidId(edge.to)}`,
  );
  return ["flowchart LR", ...nodeLines, ...edgeLines].join("\n");
}

function renderMarkdown(map) {
  return `# CAT Context Agent — Lineage Decision Map

Generated: \`${map.generated_at}\`  
Source asset: \`${map.source_asset}\`

This artifact shows the judge-visible source → DataHub context → agent decision → approval queue → receipt chain.

\`\`\`mermaid
${map.mermaid}
\`\`\`

## Decision branches

| Request | Account | Decision | Safe next step | Blocked action | Receipt |
| --- | --- | --- | --- | --- | --- |
${map.decisions.map((decision) => `| \`${decision.request_id}\` | ${decision.account} | \`${decision.decision}\` | ${decision.safe_next_step} | ${decision.blocked_action ?? "—"} | \`${decision.receipt_id}\` |`).join("\n")}

## Evidence anchors

${map.nodes.map((node) => `- **${node.label}** — \`${node.evidence}\``).join("\n")}

## Why this matters

- It makes DataHub the visible context layer in the decision path.
- It shows that CAT reads context before routing work.
- It separates safe internal work, approval-required work, and blocked work.
- It gives every decision an artifact judges can inspect.
`;
}

export async function runLineageDecisionMap() {
  const [trace, contextRead] = await Promise.all([
    runDecisionTrace(),
    runContextProvider(),
  ]);

  const decisionNodes = trace.traces.map(decisionNodeFor);
  const decisionEdges = trace.traces.flatMap((item) => [
    ["context_reads", `decision_${item.request_id}`, "context applied"],
    [`decision_${item.request_id}`, item.decision === "safe_to_queue_internal_task" ? "approval_queue" : "receipt_store", item.decision],
  ]);

  const map = {
    protocol: "cat-lineage-decision-map-v0",
    generated_at: "demo-static-run",
    source_asset: trace.source_asset,
    context_tools: contextRead.tool_read_plan.map((tool) => tool.name),
    nodes: [...fixedNodes, ...decisionNodes],
    edges: [...fixedEdges, ...decisionEdges].map(([from, to, label]) => ({ from, to, label })),
    decisions: trace.traces.map((item) => ({
      request_id: item.request_id,
      account: item.account,
      decision: item.decision,
      safe_next_step: item.safe_next_step,
      blocked_action: item.blocked_action,
      receipt_id: item.receipt_id,
    })),
  };

  map.mermaid = buildMermaid(map);

  await mkdir(assetDir, { recursive: true });
  await Promise.all([
    writeFile(paths.mapJson, `${JSON.stringify(map, null, 2)}\n`),
    writeFile(paths.mapMarkdown, renderMarkdown(map)),
  ]);

  return map;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const map = await runLineageDecisionMap();
  console.log(JSON.stringify({
    protocol: map.protocol,
    nodes: map.nodes.length,
    edges: map.edges.length,
    decisions: map.decisions.length,
    output: [
      "hackathon-assets/lineage-decision-map.json",
      "hackathon-assets/lineage-decision-map.md",
    ],
  }, null, 2));
  console.log(`Wrote ${paths.mapJson}`);
  console.log(`Wrote ${paths.mapMarkdown}`);
}
