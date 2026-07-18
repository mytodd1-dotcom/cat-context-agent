import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const exampleDir = resolve(root, "examples/cat-context-agent");
const datahubMetadataPath = resolve(exampleDir, "generated-datahub-metadata.json");
const agentContextPath = resolve(exampleDir, "generated-agent-context-packet.json");
const bridgePlanPath = resolve(exampleDir, "generated-datahub-bridge-plan.json");

const args = new Set(process.argv.slice(2));
const shouldPost = args.has("--post");
const gmsUrl = process.env.DATAHUB_GMS_URL ?? "http://localhost:8080";

function toMetadataChangeProposal(entityUrn, aspectName, aspect) {
  return {
    entityType: "dataset",
    entityUrn,
    changeType: "UPSERT",
    aspectName,
    aspect,
  };
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`POST ${url} failed with ${response.status}: ${text.slice(0, 500)}`);
  }

  return text;
}

export async function buildBridgePlan() {
  const [metadataRaw, contextRaw] = await Promise.all([
    readFile(datahubMetadataPath, "utf8"),
    readFile(agentContextPath, "utf8"),
  ]);

  const metadata = JSON.parse(metadataRaw);
  const agentContext = JSON.parse(contextRaw);
  const proposals = Object.entries(metadata.aspects).map(([aspectName, aspect]) =>
    toMetadataChangeProposal(metadata.entityUrn, aspectName, aspect),
  );

  return {
    mode: shouldPost ? "post" : "dry-run",
    datahub_gms_url: gmsUrl,
    entityUrn: metadata.entityUrn,
    proposals,
    agent_context_summary: {
      protocol: agentContext.protocol,
      allowed_actions: agentContext.allowed_actions,
      blocked_actions: agentContext.blocked_actions,
      decision_summary: agentContext.decision_summary,
    },
    next_endpoint: `${gmsUrl.replace(/\/$/, "")}/openapi/entities/v1/`,
    note:
      "Dry-run by default. Run DATAHUB_GMS_URL=http://localhost:8080 npm run datahub:bridge -- --post after starting DataHub locally.",
  };
}

export async function runBridge() {
  const plan = await buildBridgePlan();
  await writeFile(bridgePlanPath, `${JSON.stringify(plan, null, 2)}\n`);

  if (!shouldPost) return { plan, posted: [] };

  const endpoint = `${gmsUrl.replace(/\/$/, "")}/openapi/entities/v1/`;
  const posted = [];
  for (const proposal of plan.proposals) {
    posted.push({
      aspectName: proposal.aspectName,
      response: await postJson(endpoint, proposal),
    });
  }

  return { plan, posted };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await runBridge();
  console.log(JSON.stringify({
    mode: result.plan.mode,
    entityUrn: result.plan.entityUrn,
    proposals: result.plan.proposals.map((proposal) => proposal.aspectName),
    posted_count: result.posted.length,
  }, null, 2));
  console.log(`Wrote ${bridgePlanPath}`);
}
