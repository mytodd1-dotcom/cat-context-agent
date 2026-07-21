import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { inspectLiveSchemaAndLineage } from "./datahub-mcp-live-client.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const output = resolve(root, "evidence/live-datahub-remediation.json");
const urn = "urn:li:dataset:(urn:li:dataPlatform:demo,analytics.daily_revenue,PROD)";

function content(result) {
  return result?.structuredContent ?? {};
}

const result = await inspectLiveSchemaAndLineage({ urn });
const fields = content(result.schema).fields ?? [];
const upstreams = content(result.lineage).upstreams?.searchResults ?? [];
const missingDescriptions = fields
  .filter((field) => !field.description?.trim())
  .map((field) => ({ field_path: field.fieldPath, native_type: field.nativeDataType }));

const packet = {
  proof_kind: "official-datahub-mcp-snapshot",
  generated_at: new Date().toISOString(),
  mcp_server: "mcp-server-datahub@0.6.0",
  datahub: {
    urn,
    dataset: content(result.entities).result?.[0]?.name,
    fields,
    upstreams: upstreams.map((item) => ({
      urn: item.entity?.urn,
      name: item.entity?.name,
      degree: item.degree,
    })),
  },
  finding: {
    status: missingDescriptions.length ? "needs_metadata" : "clear",
    missing_descriptions: missingDescriptions,
    impact_scope: `${upstreams.length} immediate upstream dataset${upstreams.length === 1 ? "" : "s"}`,
  },
  proposed_remediation: {
    action: "prepare_description_update",
    target_field: missingDescriptions[0]?.field_path ?? null,
    draft_description: "Net revenue in USD after refunds and discounts; confirm the final business definition with the analytics owner.",
    acceptance_checks: [
      "The field has an approved definition.",
      "The definition names the unit and adjustment rules.",
      "A human approves the metadata write before it is sent to DataHub.",
    ],
  },
  safety_boundary: "This snapshot performs read-only MCP calls. CAT prepares a proposed change; it does not write metadata without an explicit human approval.",
};

await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(packet, null, 2)}\n`);
console.log(output);
