import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runDataHubReadinessDoctor } from "./datahub-readiness-doctor.mjs";
import { runMcpAdapterSmoke } from "./mcp-adapter-smoke.mjs";
import { runSubmissionVerify } from "./verify-submission.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = resolve(root, "hackathon-assets");
const walkthroughJsonPath = resolve(assetDir, "judge-walkthrough.json");
const walkthroughMarkdownPath = resolve(assetDir, "judge-walkthrough.md");

function renderMarkdown(walkthrough) {
  return `# CAT Context Agent — Judge Walkthrough

Generated: \`${walkthrough.generated_at}\`  
Status: **${walkthrough.status}**

This is the shortest terminal walkthrough for judges who want to verify the submission without guessing which files matter.

## Five-minute path

${walkthrough.steps.map((step) => `### ${step.step}. ${step.title}

\`\`\`bash
${step.command}
\`\`\`

Proves: ${step.proves}

Expected: ${step.expected}

Inspect:
${step.inspect.map((file) => `- \`${file}\``).join("\n")}`).join("\n\n")}

## Safety summary

${walkthrough.safety_summary.map((item) => `- ${item}`).join("\n")}

## Current evidence snapshot

- Submission readiness checks: ${walkthrough.evidence_snapshot.submission_readiness_checks}
- DataHub doctor status: \`${walkthrough.evidence_snapshot.datahub_doctor_status}\`
- Local DataHub required for judging: \`${walkthrough.evidence_snapshot.local_datahub_required_for_judging}\`
- MCP adapter request flows: ${walkthrough.evidence_snapshot.mcp_adapter_request_flows}
- MCP adapter tool calls: ${walkthrough.evidence_snapshot.mcp_adapter_tool_calls}
- External side effects: \`${walkthrough.evidence_snapshot.external_side_effects}\`
`;
}

export async function runJudgeWalkthrough(inputs = {}) {
  const readiness = inputs.readiness ?? (await runSubmissionVerify());
  const datahubDoctor = inputs.datahubDoctor ?? (await runDataHubReadinessDoctor());
  const mcpSmoke = inputs.mcpSmoke ?? (await runMcpAdapterSmoke());

  const steps = [
    {
      step: 1,
      title: "Open the judge start guide",
      command: "open JUDGE_START_HERE.md",
      proves: "The submission has a judge-first entry point with live demo, video, scoring brief, and local proof commands.",
      expected: "A compact start-here file that points to the live demo, GitHub repo, evidence pack, and DataHub artifacts.",
      inspect: ["JUDGE_START_HERE.md", "DEVPOST_JUDGE_NOTES.md"],
    },
    {
      step: 2,
      title: "Run the one-command proof",
      command: "npm run evidence:reproduce",
      proves: "The core evidence chain can be regenerated locally from source.",
      expected: "A reproducible receipt with generated DataHub, policy, validation, and safety reports.",
      inspect: ["hackathon-assets/reproduction-receipt.md", "hackathon-assets/artifact-validation-report.md"],
    },
    {
      step: 3,
      title: "Check DataHub readiness without posting",
      command: "npm run datahub:doctor",
      proves: "The optional local DataHub path is explicit, guarded, and not required for judging.",
      expected: "A readiness report that confirms dry-run artifacts are ready and no metadata is posted.",
      inspect: ["hackathon-assets/datahub-readiness-doctor.md", "hackathon-assets/live-datahub-runbook.md"],
    },
    {
      step: 4,
      title: "Smoke-test the MCP adapter boundary",
      command: "npm run mcp:smoke",
      proves: "The local adapter reads DataHub/CAT context before writing bounded receipts.",
      expected: "Three request flows, twelve tool calls, and no external side effects.",
      inspect: ["hackathon-assets/mcp-adapter-smoke-report.md", "hackathon-assets/datahub-mcp-handoff.md"],
    },
    {
      step: 5,
      title: "Run the full local CI equivalent",
      command: "npm run ci:local",
      proves: "A fresh-install check, all generators, build, and render/evidence tests pass together.",
      expected: "The build succeeds and the Node test suite reports all tests passing.",
      inspect: ["package.json", "hackathon-assets/github-actions-ci-template.yml"],
    },
  ];

  const walkthrough = {
    protocol: "cat-judge-walkthrough-v0",
    project: "CAT Context Agent",
    generated_at: "demo-static-run",
    status: readiness.status === "ready" && datahubDoctor.status.startsWith("ready_") && mcpSmoke.status === "passed"
      ? "ready"
      : "needs_attention",
    steps,
    safety_summary: [
      "No command in the five-minute path posts to DataHub, contacts customers, sends outreach, or requires secrets.",
      "The optional live DataHub mutation remains isolated behind DATAHUB_GMS_URL plus --post.",
      "The MCP smoke test writes only local receipts and records external_side_effects as none.",
      "Missing owner/contact context still produces approval-required or blocked outcomes.",
    ],
    evidence_snapshot: {
      submission_readiness_checks: readiness.checks.length,
      datahub_doctor_status: datahubDoctor.status,
      local_datahub_required_for_judging: datahubDoctor.probe.required_for_judging,
      mcp_adapter_request_flows: mcpSmoke.request_flows.length,
      mcp_adapter_tool_calls: mcpSmoke.tool_sequence.length,
      external_side_effects: mcpSmoke.external_side_effects,
    },
  };

  await mkdir(assetDir, { recursive: true });
  await Promise.all([
    writeFile(walkthroughJsonPath, `${JSON.stringify(walkthrough, null, 2)}\n`),
    writeFile(walkthroughMarkdownPath, renderMarkdown(walkthrough)),
  ]);

  if (walkthrough.status !== "ready") {
    throw new Error("Judge walkthrough is not ready.");
  }

  return walkthrough;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const walkthrough = await runJudgeWalkthrough();
  console.log(JSON.stringify({
    protocol: walkthrough.protocol,
    status: walkthrough.status,
    steps: walkthrough.steps.length,
    submission_readiness_checks: walkthrough.evidence_snapshot.submission_readiness_checks,
    output: [
      "hackathon-assets/judge-walkthrough.json",
      "hackathon-assets/judge-walkthrough.md",
    ],
  }, null, 2));
  console.log(`Wrote ${walkthroughJsonPath}`);
  console.log(`Wrote ${walkthroughMarkdownPath}`);
}
