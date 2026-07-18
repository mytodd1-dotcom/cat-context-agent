import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = resolve(root, "hackathon-assets");
const contractsJsonPath = resolve(assetDir, "context-tool-contracts.json");
const contractsMarkdownPath = resolve(assetDir, "context-tool-contracts.md");

const contracts = {
  protocol: "cat-context-tool-contracts-v0",
  purpose:
    "Machine-readable tool boundary for the CAT Context Agent demo. These contracts show how the local artifacts map to DataHub/MCP-style reads and guarded CAT actions.",
  safety_boundary: {
    default_mode: "read_before_action",
    blocked_without_verified_context: [
      "send_external_outreach_without_verified_contact",
      "invent_missing_owner",
      "scrape_contact_details",
    ],
    human_approval_required_for: [
      "external_customer_follow_up_when_owner_is_missing",
      "low_confidence_fields_below_policy_threshold",
    ],
  },
  tools: [
    {
      name: "datahub.get_entity",
      kind: "DataHub read",
      purpose: "Read dataset properties, schema metadata, ownership, and glossary terms before agent action.",
      input_schema: {
        type: "object",
        required: ["urn"],
        properties: {
          urn: {
            type: "string",
            example: "urn:li:dataset:(cat,messy_business_requests,PROD)",
          },
        },
      },
      output_contract: {
        aspects: ["datasetProperties", "schemaMetadata", "ownership", "glossaryTerms"],
      },
      local_demo_source: "examples/cat-context-agent/generated-datahub-bridge-plan.json",
    },
    {
      name: "datahub.get_lineage",
      kind: "DataHub read",
      purpose: "Confirm the dataset's path from uploaded CSV through context mapping and decision receipts.",
      input_schema: {
        type: "object",
        required: ["urn", "direction"],
        properties: {
          urn: {
            type: "string",
            example: "urn:li:dataset:(cat,messy_business_requests,PROD)",
          },
          direction: {
            type: "string",
            enum: ["upstream", "downstream"],
            example: "downstream",
          },
        },
      },
      output_contract: {
        lineage_steps: ["uploaded_csv", "cat_context_mapper", "agent_decision_loop", "approval_queue"],
      },
      local_demo_source: "examples/cat-context-agent/generated-agent-context-packet.json",
    },
    {
      name: "cat.get_agent_context_packet",
      kind: "CAT guarded read",
      purpose: "Read the minimum action-safety contract derived from DataHub context before deciding next steps.",
      input_schema: {
        type: "object",
        required: ["asset"],
        properties: {
          asset: {
            type: "string",
            example: "urn:li:dataset:(cat,messy_business_requests,PROD)",
          },
          request_id: {
            type: "string",
            example: "REQ-1042",
          },
        },
      },
      output_contract: {
        required_sections: [
          "governance",
          "schema_confidence",
          "allowed_actions",
          "blocked_actions",
          "receipts",
        ],
      },
      local_demo_source: "examples/cat-context-agent/generated-mcp-context-read.json",
    },
    {
      name: "cat.write_receipt",
      kind: "CAT guarded write",
      purpose:
        "Persist a decision receipt after the agent has read context and chosen safe-to-queue, approval-required, or blocked.",
      input_schema: {
        type: "object",
        required: ["request_id", "decision", "source_asset", "context_checked", "safe_next_step"],
        properties: {
          request_id: { type: "string", example: "REQ-1044" },
          decision: {
            type: "string",
            enum: ["safe_to_queue_internal_task", "needs_approval", "blocked"],
          },
          source_asset: {
            type: "string",
            example: "urn:li:dataset:(cat,messy_business_requests,PROD)",
          },
          context_checked: {
            type: "array",
            items: { type: "string" },
            example: ["schema", "owner", "contact", "lineage", "policy"],
          },
          safe_next_step: { type: "string" },
          blocked_action: { type: ["string", "null"] },
          confidence: { type: "number", minimum: 0, maximum: 1 },
        },
      },
      output_contract: {
        receipt_written_to: "approval_queue_or_receipt_log",
        external_side_effects: "none",
      },
      local_demo_source: "examples/cat-context-agent/generated-agent-output.json",
    },
  ],
};

function renderMarkdown() {
  return `# CAT Context Agent — Context Tool Contracts

Protocol: \`${contracts.protocol}\`

${contracts.purpose}

## Safety boundary

- Default mode: \`${contracts.safety_boundary.default_mode}\`
- Blocked without verified context: ${contracts.safety_boundary.blocked_without_verified_context.map((item) => `\`${item}\``).join(", ")}
- Human approval required for: ${contracts.safety_boundary.human_approval_required_for.map((item) => `\`${item}\``).join(", ")}

## Tools

${contracts.tools.map((tool) => `### \`${tool.name}\`

- Kind: ${tool.kind}
- Purpose: ${tool.purpose}
- Local demo source: \`${tool.local_demo_source}\`
- Required input: ${(tool.input_schema.required ?? []).map((item) => `\`${item}\``).join(", ")}
`).join("\n")}
`;
}

export async function runContextToolContracts() {
  await mkdir(assetDir, { recursive: true });
  await Promise.all([
    writeFile(contractsJsonPath, `${JSON.stringify(contracts, null, 2)}\n`),
    writeFile(contractsMarkdownPath, renderMarkdown()),
  ]);
  return contracts;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const output = await runContextToolContracts();
  console.log(JSON.stringify({
    protocol: output.protocol,
    tools: output.tools.map((tool) => tool.name),
    blocked_without_verified_context: output.safety_boundary.blocked_without_verified_context,
  }, null, 2));
  console.log(`Wrote ${contractsJsonPath}`);
  console.log(`Wrote ${contractsMarkdownPath}`);
}
