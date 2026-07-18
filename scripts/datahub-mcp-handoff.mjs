import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runContextProvider } from "./cat-context-provider.mjs";
import { runDemo } from "./cat-context-demo.mjs";
import { runContextToolContracts } from "./context-tool-contracts.mjs";
import { runBridge } from "./datahub-local-bridge.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = resolve(root, "hackathon-assets");

const paths = {
  handoffJson: resolve(assetDir, "datahub-mcp-handoff.json"),
  handoffMarkdown: resolve(assetDir, "datahub-mcp-handoff.md"),
};

function renderMarkdown(handoff) {
  return `# CAT Context Agent — DataHub MCP Handoff

Generated: \`${handoff.generated_at}\`  
Status: **${handoff.status}**

This artifact shows the intended handoff between DataHub context, MCP-style reads, CAT's action policy, and bounded receipt writes.

## Handoff flow

${handoff.handoff_flow.map((step) => `1. **${step.name}** — ${step.detail}`).join("\n")}

## Tool calls

| Tool | Purpose | Sample arguments | Safety boundary |
| --- | --- | --- | --- |
${handoff.tool_calls.map((tool) => `| \`${tool.name}\` | ${tool.purpose} | \`${JSON.stringify(tool.sample_arguments)}\` | ${tool.safety_boundary} |`).join("\n")}

## Request outcomes from context

| Request | Decision | Required context | Receipt side effect |
| --- | --- | --- | --- |
${handoff.request_outcomes.map((outcome) => `| ${outcome.request_id} | \`${outcome.decision}\` | ${outcome.required_context.map((item) => `\`${item}\``).join(", ")} | ${outcome.receipt_side_effect} |`).join("\n")}

## Local-to-live boundary

- Current mode: \`${handoff.local_to_live_boundary.current_mode}\`
- Local post command: \`${handoff.local_to_live_boundary.local_post_command}\`
- Remote/production posting: **${handoff.local_to_live_boundary.remote_or_production_posting}**
- Secrets required for judging: **${handoff.local_to_live_boundary.secrets_required_for_judging ? "yes" : "no"}**
- External side effects in this handoff: **${handoff.local_to_live_boundary.external_side_effects}**
`;
}

function buildToolCalls({ bridge, contextRead, contracts }) {
  const contractByName = Object.fromEntries(contracts.tools.map((tool) => [tool.name, tool]));
  const readByName = Object.fromEntries(contextRead.tool_read_plan.map((tool) => [tool.name, tool]));
  const sideEffectBoundary = (toolName) =>
    contractByName[toolName].output_contract.external_side_effects ?? "read-only; no external side effects";

  return [
    {
      name: "datahub.get_entity",
      purpose: "Fetch the DataHub dataset identity and metadata aspects before the agent reasons about work.",
      sample_arguments: readByName["datahub.get_entity"].arguments,
      expected_context: readByName["datahub.get_entity"].expected_reads,
      safety_boundary: sideEffectBoundary("datahub.get_entity"),
    },
    {
      name: "datahub.get_lineage",
      purpose: "Confirm the source-to-agent path so receipts cite the right upstream asset.",
      sample_arguments: readByName["datahub.get_lineage"].arguments,
      expected_context: readByName["datahub.get_lineage"].expected_reads,
      safety_boundary: sideEffectBoundary("datahub.get_lineage"),
    },
    {
      name: "cat.get_agent_context_packet",
      purpose: "Transform DataHub-derived context into CAT's action-safety contract.",
      sample_arguments: readByName["cat.get_agent_context_packet"].arguments,
      expected_context: readByName["cat.get_agent_context_packet"].expected_reads,
      safety_boundary: sideEffectBoundary("cat.get_agent_context_packet"),
    },
    {
      name: "cat.write_receipt",
      purpose: "Persist the safe, approval-required, or blocked outcome after context has been read.",
      sample_arguments: {
        source_asset: bridge.plan.entityUrn,
        receipt_ids: contextRead.decisions.map((decision) => `cat-demo-${decision.request_id}`),
      },
      expected_context: ["source_asset", "context_checked", "decision", "safe_next_step", "blocked_action"],
      safety_boundary: sideEffectBoundary("cat.write_receipt"),
    },
  ];
}

export async function runDataHubMcpHandoff() {
  const demo = await runDemo();
  const [bridge, contextRead, contracts] = await Promise.all([
    runBridge(),
    runContextProvider(),
    runContextToolContracts(),
  ]);

  const handoff = {
    protocol: "cat-datahub-mcp-handoff-v0",
    project: "CAT Context Agent",
    generated_at: "demo-static-run",
    status: "ready_for_mcp_adapter",
    datahub_entity: bridge.plan.entityUrn,
    handoff_flow: [
      {
        name: "CSV becomes a cataloged asset",
        detail: "The messy business request sample is anchored to a DataHub dataset URN.",
      },
      {
        name: "MetadataChangeProposal payloads are prepared",
        detail: "datasetProperties, schemaMetadata, ownership, and glossaryTerms are generated in dry-run mode.",
      },
      {
        name: "Local DataHub posting is opt-in",
        detail: "The same payloads can be posted only to a local GMS with the explicit --post command.",
      },
      {
        name: "MCP-style context reads happen before action",
        detail: "The agent reads entity, lineage, and CAT context packet data before surfacing decisions.",
      },
      {
        name: "Policy gates decide what is safe",
        detail: "Known owner/contact context permits internal queueing; missing contact context blocks external outreach.",
      },
      {
        name: "Receipt write is bounded",
        detail: "CAT writes a receipt with no external side effects instead of performing outreach.",
      },
    ],
    tool_calls: buildToolCalls({ bridge, contextRead, contracts }),
    request_outcomes: demo.receipts.map((receipt) => ({
      request_id: receipt.request_id,
      decision: receipt.decision,
      required_context: receipt.context_checked,
      receipt_side_effect: "local receipt only; no external outreach or payment action",
    })),
    local_to_live_boundary: {
      current_mode: contextRead.mode,
      local_post_command: "DATAHUB_GMS_URL=http://localhost:8080 npm run datahub:bridge -- --post",
      remote_or_production_posting: "blocked unless the operator intentionally changes DATAHUB_GMS_URL",
      secrets_required_for_judging: false,
      external_side_effects: "none in dry-run evidence; optional local DataHub metadata write only",
    },
  };

  await mkdir(assetDir, { recursive: true });
  await Promise.all([
    writeFile(paths.handoffJson, `${JSON.stringify(handoff, null, 2)}\n`),
    writeFile(paths.handoffMarkdown, renderMarkdown(handoff)),
  ]);

  return handoff;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const handoff = await runDataHubMcpHandoff();
  console.log(JSON.stringify({
    protocol: handoff.protocol,
    status: handoff.status,
    datahub_entity: handoff.datahub_entity,
    tool_calls: handoff.tool_calls.map((tool) => tool.name),
    output: [
      "hackathon-assets/datahub-mcp-handoff.json",
      "hackathon-assets/datahub-mcp-handoff.md",
    ],
  }, null, 2));
  console.log(`Wrote ${paths.handoffJson}`);
  console.log(`Wrote ${paths.handoffMarkdown}`);
}
