import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runDemo } from "./cat-context-demo.mjs";
import { runBridge } from "./datahub-local-bridge.mjs";
import { runDataHubIntegrationChecklist } from "./datahub-integration-checklist.mjs";
import { runDataHubPayloadPreview } from "./datahub-payload-preview.mjs";
import { runLiveDataHubRunbook } from "./live-datahub-runbook.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = resolve(root, "hackathon-assets");
const doctorJsonPath = resolve(assetDir, "datahub-readiness-doctor.json");
const doctorMarkdownPath = resolve(assetDir, "datahub-readiness-doctor.md");
const defaultGmsUrl = process.env.DATAHUB_GMS_URL ?? "http://localhost:8080";
const probeTimeoutMs = Number.parseInt(process.env.CAT_DATAHUB_PROBE_TIMEOUT_MS ?? "800", 10);

function check(name, ok, detail) {
  return { name, ok: Boolean(ok), detail };
}

async function probeLocalDataHub(gmsUrl) {
  const baseUrl = gmsUrl.replace(/\/$/, "");
  const endpoint = `${baseUrl}/health`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      signal: AbortSignal.timeout(Number.isFinite(probeTimeoutMs) ? probeTimeoutMs : 800),
    });

    return {
      endpoint,
      reachable: response.ok,
      status_code: response.status,
      status_text: response.statusText,
      required_for_judging: false,
      note: response.ok
        ? "Local DataHub appears reachable; operator may optionally run the explicit --post command."
        : "Local DataHub responded but did not return a healthy status; dry-run judging remains available.",
    };
  } catch (error) {
    return {
      endpoint,
      reachable: false,
      error: error instanceof Error ? error.message : String(error),
      required_for_judging: false,
      note: "Local DataHub is not reachable from this environment; this is acceptable because the submission is judgeable from dry-run artifacts.",
    };
  }
}

function renderMarkdown(report) {
  return `# CAT Context Agent — DataHub Readiness Doctor

Generated: \`${report.generated_at}\`  
Status: **${report.status}**  
Local GMS URL: \`${report.datahub_gms_url}\`

This doctor checks whether the optional local DataHub path is ready without posting any metadata. A failed or unavailable local GMS is not a submission failure; live DataHub remains an opt-in verification step.

## Probe result

- Endpoint: \`${report.probe.endpoint}\`
- Reachable: \`${report.probe.reachable}\`
- Required for judging: \`${report.probe.required_for_judging}\`
- Note: ${report.probe.note}

## Checks

${report.checks.map((item) => `- ${item.ok ? "✅" : "❌"} **${item.name}** — ${item.detail}`).join("\n")}

## Safe next command

\`\`\`bash
${report.safe_next_command}
\`\`\`

## Optional live command

\`\`\`bash
${report.optional_live_command}
\`\`\`

## Evidence files

${report.evidence_files.map((file) => `- \`${file}\``).join("\n")}
`;
}

export async function runDataHubReadinessDoctor() {
  const [demo, bridge, payloadPreview, runbook, checklist, probe] = await Promise.all([
    runDemo(),
    runBridge(),
    runDataHubPayloadPreview(),
    runLiveDataHubRunbook(),
    runDataHubIntegrationChecklist(),
    probeLocalDataHub(defaultGmsUrl),
  ]);

  const proposalNames = bridge.plan.proposals.map((proposal) => proposal.aspectName);
  const expectedAspects = ["datasetProperties", "schemaMetadata", "ownership", "glossaryTerms"];

  const checks = [
    check(
      "demo artifacts regenerated",
      demo.summary.total_requests === 3 &&
        demo.summary.safe_to_queue === 1 &&
        demo.summary.needs_approval === 1 &&
        demo.summary.blocked === 1,
      "The local CAT decision runner still produces one safe, one approval-required, and one blocked outcome.",
    ),
    check(
      "dry-run DataHub proposals ready",
      bridge.plan.mode === "dry-run" &&
        expectedAspects.every((aspect) => proposalNames.includes(aspect)) &&
        bridge.plan.live_ingest_contract.action === "ingestProposal",
      "The bridge has four DataHub Rest.li ingestProposal metadata bodies and did not post because --post was not supplied.",
    ),
    check(
      "payload preview matches bridge",
      payloadPreview.mode === "dry-run" &&
        payloadPreview.requests.length === expectedAspects.length &&
        expectedAspects.every((aspect) => payloadPreview.aspect_names.includes(aspect)),
      "The judge-readable payload preview matches the bridge proposal set.",
    ),
    check(
      "local DataHub remains optional",
      checklist.decision_gates.live_datahub_required_for_submission === false &&
        probe.required_for_judging === false,
      probe.reachable
        ? "A local GMS appears reachable, but judges still do not need it for the dry-run evidence path."
        : "No local GMS is reachable here, and the checklist correctly keeps live DataHub optional.",
    ),
    check(
      "live mutation is guarded",
      runbook.commands.some((command) => command.command.includes("--post")) &&
        checklist.phases.some((phase) => phase.mode === "optional_local_datahub" && phase.command.includes("--post")),
      "The only metadata mutation path is the explicit DATAHUB_GMS_URL + --post command against local Rest.li ingestProposal.",
    ),
    check(
      "no secrets or remote GMS required",
      checklist.decision_gates.secrets_required === false && checklist.decision_gates.do_not_use_remote_gms === true,
      "The runnable judging path requires no secrets and keeps remote/production DataHub posting out of scope.",
    ),
  ];

  const report = {
    protocol: "cat-datahub-readiness-doctor-v0",
    project: "CAT Context Agent",
    generated_at: "demo-static-run",
    status: checks.every((item) => item.ok)
      ? probe.reachable
        ? "ready_with_local_datahub"
        : "ready_without_live_datahub"
      : "needs_attention",
    datahub_gms_url: defaultGmsUrl,
    probe,
    checks,
    safe_next_command: "npm run evidence:reproduce",
    optional_live_command: "DATAHUB_GMS_URL=http://localhost:8080 npm run datahub:bridge -- --post",
    evidence_files: [
      "hackathon-assets/datahub-readiness-doctor.md",
      "hackathon-assets/datahub-payload-preview.md",
      "hackathon-assets/live-datahub-runbook.md",
      "hackathon-assets/datahub-integration-checklist.md",
      "examples/cat-context-agent/generated-datahub-bridge-plan.json",
      "examples/cat-context-agent/generated-mcp-context-read.json",
    ],
  };

  await mkdir(assetDir, { recursive: true });
  await Promise.all([
    writeFile(doctorJsonPath, `${JSON.stringify(report, null, 2)}\n`),
    writeFile(doctorMarkdownPath, renderMarkdown(report)),
  ]);

  if (report.status === "needs_attention") {
    throw new Error(`DataHub readiness doctor failed: ${checks.filter((item) => !item.ok).map((item) => item.name).join(", ")}`);
  }

  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const report = await runDataHubReadinessDoctor();
  console.log(JSON.stringify({
    protocol: report.protocol,
    status: report.status,
    local_datahub_reachable: report.probe.reachable,
    checks: report.checks.length,
    output: [
      "hackathon-assets/datahub-readiness-doctor.json",
      "hackathon-assets/datahub-readiness-doctor.md",
    ],
  }, null, 2));
  console.log(`Wrote ${doctorJsonPath}`);
  console.log(`Wrote ${doctorMarkdownPath}`);
}
