import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runContextProvider } from "./cat-context-provider.mjs";
import { runDemo } from "./cat-context-demo.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const exampleDir = resolve(root, "examples/cat-context-agent");
const assetDir = resolve(root, "hackathon-assets");

const paths = {
  csv: resolve(exampleDir, "messy-business-requests.csv"),
  traceJson: resolve(assetDir, "decision-trace.json"),
  traceMarkdown: resolve(assetDir, "decision-trace.md"),
};

function parseCsv(text) {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  const headers = headerLine.split(",");
  return lines.map((line) => {
    const cells = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
  });
}

function renderMarkdown(trace) {
  return `# CAT Context Agent — Decision Trace

Generated: \`${trace.generated_at}\`  
Source asset: \`${trace.source_asset}\`

This file shows the end-to-end path from messy row → DataHub/MCP context read → agent decision → receipt.

## Trace table

| Request | Account | Data issue | Context reads | Decision | Safe next step | Blocked action |
| --- | --- | --- | --- | --- | --- | --- |
${trace.traces.map((item) => `| \`${item.request_id}\` | ${item.account} | ${item.data_issue} | ${item.context_reads.map((read) => `\`${read}\``).join("<br>")} | \`${item.decision}\` | ${item.safe_next_step} | ${item.blocked_action ?? "—"} |`).join("\n")}

## What judges should notice

- The agent does not act directly on raw rows.
- Every decision cites DataHub-style context and CAT policy context.
- Missing owner/contact context changes the allowed action.
- Unsafe external outreach becomes approval-gated or blocked work.
`;
}

function dataIssueFor(row, receipt) {
  if (receipt.missing_context.includes("verified_contact")) return "verified contact missing";
  if (receipt.missing_context.includes("owner")) return "owner context missing";
  if (row.request_type === "invoice mismatch") return "internal finance review";
  return "context sufficient";
}

export async function runDecisionTrace() {
  const [demo, contextRead, csvRaw] = await Promise.all([
    runDemo(),
    runContextProvider(),
    readFile(paths.csv, "utf8"),
  ]);

  const rows = parseCsv(csvRaw);
  const rowsById = new Map(rows.map((row) => [row.request_id, row]));
  const decisionsById = new Map(contextRead.decisions.map((decision) => [decision.request_id, decision]));
  const toolReads = contextRead.tool_read_plan.map((tool) => tool.name);

  const traces = demo.receipts.map((receipt) => {
    const row = rowsById.get(receipt.request_id);
    const decision = decisionsById.get(receipt.request_id);

    if (!row) throw new Error(`Missing source row for ${receipt.request_id}`);
    if (!decision) throw new Error(`Missing context decision for ${receipt.request_id}`);

    return {
      request_id: receipt.request_id,
      account: receipt.account,
      request_type: row.request_type,
      data_issue: dataIssueFor(row, receipt),
      context_reads: toolReads,
      context_sources: decision.context_sources,
      missing_context: receipt.missing_context,
      decision: receipt.decision,
      status: receipt.status,
      safe_next_step: receipt.safe_next_step,
      blocked_action: receipt.blocked_action,
      receipt_id: receipt.receipt_id,
      confidence: receipt.confidence,
    };
  });

  const trace = {
    protocol: "cat-decision-trace-v0",
    generated_at: "demo-static-run",
    source_asset: demo.source_asset,
    source_file: demo.source_file,
    tool_read_plan: toolReads,
    traces,
  };

  await mkdir(assetDir, { recursive: true });
  await Promise.all([
    writeFile(paths.traceJson, `${JSON.stringify(trace, null, 2)}\n`),
    writeFile(paths.traceMarkdown, renderMarkdown(trace)),
  ]);

  return trace;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const trace = await runDecisionTrace();
  console.log(JSON.stringify({
    protocol: trace.protocol,
    requests: trace.traces.length,
    decisions: trace.traces.map((item) => item.decision),
    output: [
      "hackathon-assets/decision-trace.json",
      "hackathon-assets/decision-trace.md",
    ],
  }, null, 2));
  console.log(`Wrote ${paths.traceJson}`);
  console.log(`Wrote ${paths.traceMarkdown}`);
}
