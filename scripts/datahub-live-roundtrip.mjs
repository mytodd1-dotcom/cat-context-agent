import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildBridgePlan } from "./datahub-local-bridge.mjs";
import { runDataHubPayloadPreview } from "./datahub-payload-preview.mjs";
import { runDemo } from "./cat-context-demo.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = resolve(root, "hackathon-assets");
const reportJsonPath = resolve(assetDir, "datahub-live-roundtrip.json");
const reportMarkdownPath = resolve(assetDir, "datahub-live-roundtrip.md");

const args = new Set(process.argv.slice(2));
const shouldPost = args.has("--post");
const shouldReadback = shouldPost || args.has("--readback");
const gmsUrl = process.env.DATAHUB_GMS_URL ?? "http://localhost:8080";
const probeTimeoutMs = Number.parseInt(process.env.CAT_DATAHUB_PROBE_TIMEOUT_MS ?? "2500", 10);
const restliProtocolVersion = "2.0.0";
const expectedAspects = ["datasetProperties", "schemaMetadata", "ownership", "glossaryTerms"];

function normalizeBaseUrl(rawUrl) {
  return rawUrl.replace(/\/$/, "");
}

function isLocalGms(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    return ["localhost", "127.0.0.1", "::1", "[::1]"].includes(parsed.hostname);
  } catch {
    return false;
  }
}

function buildReadbackPlan(plan) {
  const baseUrl = normalizeBaseUrl(gmsUrl);
  const encodedUrn = encodeURIComponent(plan.entityUrn);
  const aspectList = plan.proposals.map((proposal) => proposal.aspectName);

  return {
    entity_endpoint: `${baseUrl}/entitiesV2/${encodedUrn}?aspects=List(${aspectList.join(",")})`,
    aspect_endpoints: aspectList.map((aspectName) => ({
      aspectName,
      endpoint: `${baseUrl}/aspects/${encodedUrn}?aspect=${encodeURIComponent(aspectName)}&version=0`,
    })),
    expected_aspects: aspectList,
    acceptance: [
      "GMS accepts all four Metadata Change Proposal UPSERT bodies.",
      "entitiesV2 readback returns the CAT dataset URN.",
      "Readback includes datasetProperties, schemaMetadata, ownership, and glossaryTerms.",
      "Agent decisions still preserve one safe, one approval-required, and one blocked request.",
    ],
  };
}

function check(name, ok, detail) {
  return { name, ok: Boolean(ok), detail };
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-RestLi-Protocol-Version": restliProtocolVersion,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(Number.isFinite(probeTimeoutMs) ? probeTimeoutMs : 2500),
  });

  const text = await response.text();
  return {
    ok: response.ok,
    status_code: response.status,
    status_text: response.statusText,
    body_preview: text.slice(0, 500),
  };
}

async function getJson(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-RestLi-Protocol-Version": restliProtocolVersion,
    },
    signal: AbortSignal.timeout(Number.isFinite(probeTimeoutMs) ? probeTimeoutMs : 2500),
  });

  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  return {
    ok: response.ok,
    status_code: response.status,
    status_text: response.statusText,
    json,
    body_preview: text.slice(0, 500),
  };
}

function extractReadbackAspects(readback) {
  const aspects = readback?.json?.aspects ?? readback?.json?.value?.aspects ?? {};
  return Object.keys(aspects);
}

function renderMarkdown(report) {
  return `# CAT Context Agent — DataHub Live Roundtrip Harness

Generated: \`${report.generated_at}\`  
Status: **${report.status}**  
Mode: \`${report.mode}\`  
Local GMS URL: \`${report.datahub_gms_url}\`

This harness is the bridge between the dry-run submission and a real local DataHub verification loop. By default it does **not** post metadata. With a local DataHub GMS running, the operator can add \`--post\` to write the same Metadata Change Proposal bodies and verify readback from Rest.li.

## Safety boundary

- Mutations performed: \`${report.mutations_performed}\`
- Local-only GMS required for mutation: \`${report.safety.local_only_gms_required}\`
- Remote/production DataHub posting allowed: \`${report.safety.remote_or_production_posting_allowed}\`
- Secrets required for dry-run: \`${report.safety.secrets_required_for_dry_run}\`

${report.mutations_performed ? "Metadata was posted only to the configured local GMS URL." : "No metadata was posted in this run."}

## Write path

- Endpoint: \`${report.write_plan.endpoint}\`
- Action: \`${report.write_plan.action}\`
- Rest.li protocol: \`${report.write_plan.headers["X-RestLi-Protocol-Version"]}\`
- Aspects: ${report.write_plan.aspects.map((aspect) => `\`${aspect}\``).join(", ")}

## Readback path

- Entity readback: \`${report.readback_plan.entity_endpoint}\`

${report.readback_plan.aspect_endpoints.map((item) => `- \`${item.aspectName}\`: \`${item.endpoint}\``).join("\n")}

## Checks

${report.checks.map((item) => `- ${item.ok ? "✅" : "❌"} **${item.name}** — ${item.detail}`).join("\n")}

## Optional live command

\`\`\`bash
${report.optional_live_command}
\`\`\`
`;
}

export async function runDataHubLiveRoundtrip() {
  const [demo, payloadPreview, bridgePlan] = await Promise.all([
    runDemo(),
    runDataHubPayloadPreview(),
    buildBridgePlan(),
  ]);

  const readbackPlan = buildReadbackPlan(bridgePlan);
  const proposalNames = bridgePlan.proposals.map((proposal) => proposal.aspectName);
  const localOnly = isLocalGms(gmsUrl);

  const baseChecks = [
    check(
      "roundtrip payload coverage",
      expectedAspects.every((aspect) => proposalNames.includes(aspect)) &&
        payloadPreview.requests.length === expectedAspects.length,
      "The same four DataHub aspects are available for dry-run, post, and readback verification.",
    ),
    check(
      "write path is explicit",
      bridgePlan.live_ingest_contract.action === "ingestProposal" &&
        bridgePlan.next_endpoint.endsWith("/aspects?action=ingestProposal"),
      "The write path is DataHub Rest.li ingestProposal, not a hidden side effect.",
    ),
    check(
      "readback path is explicit",
      readbackPlan.entity_endpoint.includes("/entitiesV2/") &&
        readbackPlan.aspect_endpoints.length === expectedAspects.length,
      "The readback path points to DataHub entitiesV2 plus per-aspect latest-version reads.",
    ),
    check(
      "mutation guard is local-only",
      !shouldPost || localOnly,
      shouldPost
        ? "The requested mutation target is local, so posting is allowed."
        : "Dry-run mode performs no mutation and still documents the local-only mutation gate.",
    ),
    check(
      "agent decision boundary preserved",
      demo.summary.safe_to_queue === 1 && demo.summary.needs_approval === 1 && demo.summary.blocked === 1,
      "The local DataHub path does not weaken CAT's safe, approval-required, and blocked decisions.",
    ),
  ];

  if (shouldPost && !localOnly) {
    const report = {
      protocol: "cat-datahub-live-roundtrip-v0",
      project: "CAT Context Agent",
      generated_at: "demo-static-run",
      status: "blocked_nonlocal_gms",
      mode: "blocked",
      datahub_gms_url: gmsUrl,
      mutations_performed: false,
      safety: {
        local_only_gms_required: true,
        remote_or_production_posting_allowed: false,
        secrets_required_for_dry_run: false,
      },
      write_plan: {
        endpoint: bridgePlan.next_endpoint,
        action: "ingestProposal",
        headers: bridgePlan.live_ingest_contract.headers,
        aspects: proposalNames,
      },
      readback_plan: readbackPlan,
      posted: [],
      readback: null,
      checks: baseChecks,
      optional_live_command: "DATAHUB_GMS_URL=http://localhost:8080 npm run datahub:roundtrip -- --post",
    };
    await mkdir(assetDir, { recursive: true });
    await Promise.all([
      writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`),
      writeFile(reportMarkdownPath, renderMarkdown(report)),
    ]);
    throw new Error("Refusing to post DataHub metadata to a non-local GMS URL.");
  }

  const posted = [];
  let readback = null;

  if (shouldPost) {
    for (const proposal of bridgePlan.proposals) {
      posted.push({
        aspectName: proposal.aspectName,
        endpoint: bridgePlan.next_endpoint,
        result: await postJson(bridgePlan.next_endpoint, proposal.restli.requestBody),
      });
    }
  }

  if (shouldReadback && localOnly) {
    readback = await getJson(readbackPlan.entity_endpoint);
  }

  const readbackAspects = extractReadbackAspects(readback);
  const liveChecks = shouldPost
    ? [
        check(
          "all proposals posted",
          posted.length === expectedAspects.length && posted.every((item) => item.result.ok),
          "A local GMS accepted all four Metadata Change Proposal UPSERT bodies.",
        ),
        check(
          "entity readback succeeded",
          Boolean(readback?.ok) && readback?.json?.urn === bridgePlan.entityUrn,
          "entitiesV2 returned the CAT dataset URN from local DataHub.",
        ),
        check(
          "readback includes expected aspects",
          expectedAspects.every((aspect) => readbackAspects.includes(aspect)),
          "Local DataHub readback includes the aspects CAT needs before agent action.",
        ),
      ]
    : [
        check(
          "dry-run has no external side effects",
          posted.length === 0 && readback === null,
          "No metadata was posted and no local GMS readback was attempted without --post or --readback.",
        ),
      ];

  const checks = [...baseChecks, ...liveChecks];
  const status = checks.every((item) => item.ok)
    ? shouldPost
      ? "roundtrip_verified"
      : "ready_for_local_roundtrip"
    : "needs_attention";

  const report = {
    protocol: "cat-datahub-live-roundtrip-v0",
    project: "CAT Context Agent",
    generated_at: "demo-static-run",
    status,
    mode: shouldPost ? "post_and_readback" : "dry-run",
    datahub_gms_url: gmsUrl,
    mutations_performed: shouldPost,
    safety: {
      local_only_gms_required: true,
      remote_or_production_posting_allowed: false,
      secrets_required_for_dry_run: false,
    },
    write_plan: {
      endpoint: bridgePlan.next_endpoint,
      action: "ingestProposal",
      headers: bridgePlan.live_ingest_contract.headers,
      aspects: proposalNames,
    },
    readback_plan: readbackPlan,
    posted,
    readback: readback
      ? {
          endpoint: readbackPlan.entity_endpoint,
          ok: readback.ok,
          status_code: readback.status_code,
          urn: readback.json?.urn ?? null,
          aspect_names: readbackAspects,
          body_preview: readback.body_preview,
        }
      : null,
    checks,
    optional_live_command: "DATAHUB_GMS_URL=http://localhost:8080 npm run datahub:roundtrip -- --post",
  };

  await mkdir(assetDir, { recursive: true });
  await Promise.all([
    writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`),
    writeFile(reportMarkdownPath, renderMarkdown(report)),
  ]);

  if (report.status === "needs_attention") {
    throw new Error(`DataHub live roundtrip failed: ${checks.filter((item) => !item.ok).map((item) => item.name).join(", ")}`);
  }

  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const report = await runDataHubLiveRoundtrip();
  console.log(JSON.stringify({
    protocol: report.protocol,
    status: report.status,
    mode: report.mode,
    mutations_performed: report.mutations_performed,
    write_aspects: report.write_plan.aspects,
    readback_endpoint: report.readback_plan.entity_endpoint,
    output: [
      "hackathon-assets/datahub-live-roundtrip.json",
      "hackathon-assets/datahub-live-roundtrip.md",
    ],
  }, null, 2));
  console.log(`Wrote ${reportJsonPath}`);
  console.log(`Wrote ${reportMarkdownPath}`);
}
