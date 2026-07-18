import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildBridgePlan } from "./datahub-local-bridge.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = resolve(root, "hackathon-assets");
const previewJsonPath = resolve(assetDir, "datahub-payload-preview.json");
const previewMarkdownPath = resolve(assetDir, "datahub-payload-preview.md");

function requestId(aspectName) {
  return `cat-datahub-upsert-${aspectName}`;
}

function renderMarkdown(preview) {
  return `# CAT Context Agent — DataHub Payload Preview

Mode: **${preview.mode}**  
Endpoint: \`${preview.endpoint}\`  
Generated: \`${preview.generated_at}\`

This is a dry-run preview of the metadata change proposal-style payloads CAT prepares for a local DataHub GMS run.

The live command sends DataHub Rest.li \`ingestProposal\` action bodies. Dry-run mode writes the exact request shape without contacting GMS.

## Live ingest contract

- Method: \`${preview.live_ingest_contract.method}\`
- Endpoint: \`${preview.live_ingest_contract.endpoint}\`
- Rest.li protocol: \`${preview.live_ingest_contract.headers["X-RestLi-Protocol-Version"]}\`
- Body shape: \`${preview.live_ingest_contract.body_shape}\`
- Aspect encoding: ${preview.live_ingest_contract.aspect_encoding}

## Aspect upserts

| Request | Aspect | Purpose |
| --- | --- | --- |
${preview.requests.map((request) => `| \`${request.id}\` | \`${request.aspectName}\` | ${request.purpose} |`).join("\n")}

## Local post command

\`\`\`bash
DATAHUB_GMS_URL=http://localhost:8080 npm run datahub:bridge -- --post
\`\`\`

## Safety note

${preview.safety_note}
`;
}

function purposeFor(aspectName) {
  const purposes = {
    datasetProperties: "Identify the messy business request dataset and expose CAT decision totals as metadata.",
    schemaMetadata: "Describe the CSV schema and field confidence before the agent acts.",
    ownership: "Attach a known CAT demo data owner so missing ownership can be detected instead of invented.",
    glossaryTerms: "Mark policy terms such as context-before-action and no unverified outreach.",
  };

  return purposes[aspectName] ?? "Carry DataHub context needed by the CAT agent before action.";
}

export async function runDataHubPayloadPreview() {
  const plan = await buildBridgePlan();
  const endpoint = plan.next_endpoint;

  const preview = {
    protocol: "cat-datahub-payload-preview-v0",
    mode: "dry-run",
    generated_at: "demo-static-run",
    endpoint,
    method: "POST",
    content_type: "application/json",
    live_ingest_contract: plan.live_ingest_contract,
    entityUrn: plan.entityUrn,
    aspect_names: plan.proposals.map((proposal) => proposal.aspectName),
    requests: plan.proposals.map((proposal) => ({
      id: requestId(proposal.aspectName),
      method: "POST",
      endpoint,
      headers: plan.live_ingest_contract.headers,
      aspectName: proposal.aspectName,
      purpose: purposeFor(proposal.aspectName),
      body: proposal.restli.requestBody,
      preview_aspect: proposal.aspect,
    })),
    local_post_command: "DATAHUB_GMS_URL=http://localhost:8080 npm run datahub:bridge -- --post",
    safety_note:
      "The preview does not contact DataHub, use credentials, or mutate external state. Posting is opt-in via the explicit --post bridge command after starting local DataHub.",
  };

  await mkdir(assetDir, { recursive: true });
  await Promise.all([
    writeFile(previewJsonPath, `${JSON.stringify(preview, null, 2)}\n`),
    writeFile(previewMarkdownPath, renderMarkdown(preview)),
  ]);

  return preview;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const preview = await runDataHubPayloadPreview();
  console.log(JSON.stringify({
    protocol: preview.protocol,
    mode: preview.mode,
    requests: preview.requests.length,
    aspect_names: preview.aspect_names,
    output: [
      "hackathon-assets/datahub-payload-preview.json",
      "hackathon-assets/datahub-payload-preview.md",
    ],
  }, null, 2));
  console.log(`Wrote ${previewJsonPath}`);
  console.log(`Wrote ${previewMarkdownPath}`);
}
