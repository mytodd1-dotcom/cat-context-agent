import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runDataHubPayloadPreview } from "./datahub-payload-preview.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = resolve(root, "hackathon-assets");
const runbookJsonPath = resolve(assetDir, "live-datahub-runbook.json");
const runbookMarkdownPath = resolve(assetDir, "live-datahub-runbook.md");

const project = "CAT Context Agent";
const challenge = "Build with DataHub: The Agent Hackathon";

function renderMarkdown(runbook) {
  return `# CAT Context Agent — Live DataHub Runbook

Generated: \`${runbook.generated_at}\`  
Status: **${runbook.status}**

This runbook turns the dry-run CAT demo into a local DataHub verification path. The repository stays runnable without Docker or credentials, while the live post step remains explicit and opt-in.

## Goal

${runbook.goal}

## Prerequisites

${runbook.prerequisites.map((item) => `- ${item}`).join("\n")}

## Commands

${runbook.commands.map((command) => `### ${command.name}

\`\`\`bash
${command.command}
\`\`\`

Expected: ${command.expected}`).join("\n\n")}

## Acceptance checks

${runbook.acceptance_checks.map((check) => `- ✅ **${check.name}** — ${check.detail}`).join("\n")}

## Explicit safety boundary

${runbook.safety_boundary.map((item) => `- ${item}`).join("\n")}

## Fallback if DataHub is not running

${runbook.fallback}
`;
}

export async function runLiveDataHubRunbook() {
  const preview = await runDataHubPayloadPreview();

  const runbook = {
    protocol: "cat-live-datahub-runbook-v0",
    project,
    challenge,
    generated_at: "demo-static-run",
    status: "ready_for_local_datahub",
    goal:
      "Post CAT's generated datasetProperties, schemaMetadata, ownership, and glossaryTerms aspects to a local DataHub GMS, then use the same context to justify safe, approval-gated, and blocked agent actions.",
    entityUrn: preview.entityUrn,
    dry_run_payloads: preview.requests.map((request) => ({
      id: request.id,
      aspectName: request.aspectName,
      endpoint: request.endpoint,
      purpose: request.purpose,
    })),
    prerequisites: [
      "Node 22+ dependencies installed with npm install or npm ci.",
      "A local DataHub GMS instance reachable at DATAHUB_GMS_URL, usually http://localhost:8080.",
      "No cloud credentials are required for the repo evidence path.",
      "Live posting is intentionally blocked unless the operator passes --post.",
    ],
    commands: [
      {
        name: "Regenerate the local CAT decision artifacts",
        command: "npm run demo",
        expected:
          "generated-agent-output.json, generated-datahub-metadata.json, and generated-agent-context-packet.json are updated.",
      },
      {
        name: "Preview the DataHub metadata payloads",
        command: "npm run datahub:payload",
        expected:
          "hackathon-assets/datahub-payload-preview.md lists four DataHub aspects without contacting GMS.",
      },
      {
        name: "Post to local DataHub only after GMS is running",
        command: "DATAHUB_GMS_URL=http://localhost:8080 npm run datahub:bridge -- --post",
        expected:
          "The bridge posts four UPSERT proposals to /openapi/entities/v1/ and leaves generated-datahub-bridge-plan.json as a receipt.",
      },
      {
        name: "Read context before agent action",
        command: "npm run context:read -- --request-id REQ-1042",
        expected:
          "generated-mcp-context-read.json shows datahub.get_entity, datahub.get_lineage, and cat.get_agent_context_packet before the approval decision.",
      },
      {
        name: "Reproduce the judge evidence chain",
        command: "npm run evidence:reproduce",
        expected:
          "The reproduction receipt confirms payload preview, live runbook, decision trace, readiness, validation, and safety checks.",
      },
    ],
    acceptance_checks: [
      {
        name: "aspect coverage",
        detail: `${preview.requests.length} DataHub aspect payloads are prepared: ${preview.aspect_names.join(", ")}.`,
      },
      {
        name: "local-first verification",
        detail: "Judges can inspect every generated artifact without external credentials or a hosted service.",
      },
      {
        name: "live mutation is explicit",
        detail: "Only the documented DATAHUB_GMS_URL + --post command mutates a local DataHub instance.",
      },
      {
        name: "agent safety remains preserved",
        detail: "The blocked external outreach case remains blocked even after the DataHub post path is enabled.",
      },
    ],
    safety_boundary: [
      "Do not post to a remote or production DataHub instance from the demo unless the operator intentionally changes DATAHUB_GMS_URL.",
      "Do not add secrets, tokens, or customer data to the generated artifacts.",
      "Do not let the agent send external outreach when contact ownership or approval context is missing.",
      "Treat failed DataHub posting as a setup issue, not permission to bypass context reads.",
    ],
    fallback:
      "If local DataHub is not available during judging, use npm run datahub:payload plus npm run decision:trace. Those commands prove the same aspect payloads and read-before-action decisions in dry-run mode.",
  };

  await mkdir(assetDir, { recursive: true });
  await Promise.all([
    writeFile(runbookJsonPath, `${JSON.stringify(runbook, null, 2)}\n`),
    writeFile(runbookMarkdownPath, renderMarkdown(runbook)),
  ]);

  return runbook;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const runbook = await runLiveDataHubRunbook();
  console.log(JSON.stringify({
    protocol: runbook.protocol,
    status: runbook.status,
    dry_run_payloads: runbook.dry_run_payloads.length,
    output: [
      "hackathon-assets/live-datahub-runbook.json",
      "hackathon-assets/live-datahub-runbook.md",
    ],
  }, null, 2));
  console.log(`Wrote ${runbookJsonPath}`);
  console.log(`Wrote ${runbookMarkdownPath}`);
}
