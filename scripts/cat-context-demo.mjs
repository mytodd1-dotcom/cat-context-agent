import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const exampleDir = resolve(root, "examples/cat-context-agent");

const inputPaths = {
  csv: resolve(exampleDir, "messy-business-requests.csv"),
  context: resolve(exampleDir, "datahub-context-map.json"),
};

const outputPath = resolve(exampleDir, "generated-agent-output.json");
const datahubMetadataPath = resolve(exampleDir, "generated-datahub-metadata.json");
const agentContextPath = resolve(exampleDir, "generated-agent-context-packet.json");

function parseCsv(text) {
  const rows = [];
  let current = "";
  let row = [];
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(current);
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      current = "";
      continue;
    }

    current += char;
  }

  if (current.length || row.length) {
    row.push(current);
    if (row.some((cell) => cell.length > 0)) rows.push(row);
  }

  const [headers, ...records] = rows;
  return records.map((record) =>
    Object.fromEntries(headers.map((header, index) => [header, record[index] ?? ""])),
  );
}

function isMissing(value) {
  return value == null || value.trim() === "" || ["missing", "owner unknown"].includes(value.trim().toLowerCase());
}

function evaluateRequest(row, context) {
  const missing = [];
  if (isMissing(row.contact_email)) missing.push("verified_contact");
  if (isMissing(row.owner)) missing.push("owner");

  const externalOutreach = /follow-up|churn/i.test(row.request_type);
  const ownerRequired = context.governance.owner_required_for_external_outreach;
  const contactRequired = context.governance.verified_contact_required_for_external_outreach;
  const highPriority = row.priority?.toLowerCase() === "high";

  let decision = "safe_to_queue_internal_task";
  let status = "Safe to queue";
  let safeNextStep = `Create ${row.owner || "internal"} review task for ${row.request_type}`;
  let blockedAction = null;
  let confidence = 0.91;
  let reason = "Action stays inside the business and required owner/contact context is present.";

  if (externalOutreach && contactRequired && isMissing(row.contact_email)) {
    decision = "blocked";
    status = "Blocked";
    safeNextStep = "Request a verified contact before customer action";
    blockedAction = "Do not guess, scrape, or invent contact details";
    confidence = 0.69;
    reason = "External outreach is unsafe because verified contact data is blank or missing.";
  } else if (externalOutreach && ownerRequired && isMissing(row.owner)) {
    decision = "needs_approval";
    status = "Needs human approval";
    safeNextStep = "Ask for missing customer contact owner before follow-up";
    blockedAction = "Do not send external follow-up";
    confidence = highPriority ? 0.78 : 0.74;
    reason = "The request may be valuable, but owner context is unknown.";
  }

  return {
    receipt_id: `cat-demo-${row.request_id}`,
    request_id: row.request_id,
    account: row.account,
    source_asset: context.asset.urn,
    context_checked: ["schema", "owner", "contact", "lineage", "policy"],
    missing_context: missing,
    decision,
    status,
    safe_next_step: safeNextStep,
    blocked_action: blockedAction,
    confidence,
    reason,
  };
}

function buildDataHubMetadata(context, receipts) {
  const fields = context.schema.map((field) => ({
    fieldPath: field.field,
    type: "string",
    nativeDataType: "string",
    description: `${field.meaning}; confidence=${field.confidence}`,
  }));

  return {
    note: "DataHub-ready metadata payload for the hackathon demo. The next build step is posting equivalent aspects through DataHub ingestion/MCP.",
    entityUrn: context.asset.urn,
    aspects: {
      datasetProperties: {
        name: context.asset.name,
        description:
          "Messy business request data used by CAT Context Agent to demonstrate context-aware safety decisions.",
        customProperties: {
          cat_source_file: context.asset.source_file,
          cat_demo: "true",
          cat_decisions_total: String(receipts.length),
          cat_decisions_blocked: String(receipts.filter((receipt) => receipt.decision === "blocked").length),
          cat_decisions_needs_approval: String(receipts.filter((receipt) => receipt.decision === "needs_approval").length),
        },
      },
      schemaMetadata: {
        platform: context.asset.platform,
        version: 0,
        hash: "cat-context-agent-demo",
        platformSchema: {
          schemaType: "CSV",
          rawSchema: context.schema.map((field) => `${field.field}: string`).join("\n"),
        },
        fields,
      },
      ownership: {
        owners: [
          {
            owner: "urn:li:corpuser:cat-context-agent",
            type: "DATAOWNER",
          },
        ],
      },
      glossaryTerms: {
        terms: [
          { term: "urn:li:glossaryTerm:ContextBeforeAction" },
          { term: "urn:li:glossaryTerm:HumanApprovalRequired" },
          { term: "urn:li:glossaryTerm:NoUnverifiedOutreach" },
        ],
      },
    },
  };
}

function buildAgentContextPacket(context, output) {
  return {
    protocol: "cat-agent-context-v0",
    purpose: "Context packet an agent should read before recommending workflow action.",
    datahub_asset: context.asset.urn,
    lineage: context.lineage,
    governance: context.governance,
    schema_confidence: Object.fromEntries(context.schema.map((field) => [field.field, field.confidence])),
    decision_summary: output.summary,
    allowed_actions: [
      "create_internal_review_task",
      "ask_missing_context_question",
      "write_receipt",
    ],
    blocked_actions: [
      "send_external_outreach_without_verified_contact",
      "invent_missing_owner",
      "scrape_contact_details",
    ],
    receipts: output.receipts.map((receipt) => ({
      receipt_id: receipt.receipt_id,
      request_id: receipt.request_id,
      decision: receipt.decision,
      safe_next_step: receipt.safe_next_step,
      blocked_action: receipt.blocked_action,
    })),
  };
}

export async function runDemo() {
  const [csv, contextRaw] = await Promise.all([
    readFile(inputPaths.csv, "utf8"),
    readFile(inputPaths.context, "utf8"),
  ]);

  const context = JSON.parse(contextRaw);
  const rows = parseCsv(csv);
  const receipts = rows.map((row) => evaluateRequest(row, context));

  const output = {
    generated_at: "demo-static-run",
    demo: "CAT Context Agent local proof",
    source_asset: context.asset.urn,
    source_file: context.asset.source_file,
    summary: {
      total_requests: receipts.length,
      safe_to_queue: receipts.filter((receipt) => receipt.decision === "safe_to_queue_internal_task").length,
      needs_approval: receipts.filter((receipt) => receipt.decision === "needs_approval").length,
      blocked: receipts.filter((receipt) => receipt.decision === "blocked").length,
    },
    receipts,
  };

  const datahubMetadata = buildDataHubMetadata(context, receipts);
  const agentContextPacket = buildAgentContextPacket(context, output);

  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
  await writeFile(datahubMetadataPath, `${JSON.stringify(datahubMetadata, null, 2)}\n`);
  await writeFile(agentContextPath, `${JSON.stringify(agentContextPacket, null, 2)}\n`);
  return output;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const output = await runDemo();
  console.log(JSON.stringify(output.summary, null, 2));
  console.log(`Wrote ${outputPath}`);
  console.log(`Wrote ${datahubMetadataPath}`);
  console.log(`Wrote ${agentContextPath}`);
}
