import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runDataHubReadinessDoctor } from "./datahub-readiness-doctor.mjs";
import { runDevpostSubmissionCopy } from "./devpost-submission-copy.mjs";
import { runJudgeWalkthrough } from "./judge-walkthrough.mjs";
import { runMcpAdapterSmoke } from "./mcp-adapter-smoke.mjs";
import { runSafetyPolicyMatrix } from "./safety-policy-matrix.mjs";
import { runSubmissionHonestyAudit } from "./submission-honesty-audit.mjs";
import { runSubmissionVerify } from "./verify-submission.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = resolve(root, "hackathon-assets");
const faqJsonPath = resolve(assetDir, "judge-faq.json");
const faqMarkdownPath = resolve(assetDir, "judge-faq.md");

function renderMarkdown(faq) {
  return `# CAT Context Agent — Judge FAQ

Generated: \`${faq.generated_at}\`  
Status: **${faq.status}**

This is a direct objection-handler for judges: what is real now, what is optional, what DataHub contributes, and how to verify the claims without guessing.

## Quick facts

- Submission readiness checks: ${faq.quick_facts.submission_readiness_checks}
- Honesty audit checks: ${faq.quick_facts.honesty_audits}
- DataHub doctor status: \`${faq.quick_facts.datahub_doctor_status}\`
- Local DataHub required for judging: \`${faq.quick_facts.local_datahub_required_for_judging}\`
- MCP smoke request flows: ${faq.quick_facts.mcp_smoke_request_flows}
- External side effects: \`${faq.quick_facts.external_side_effects}\`
- Blocked actions: ${faq.quick_facts.blocked_actions.map((action) => `\`${action}\``).join(", ")}

## Questions judges may ask

${faq.questions.map((item) => `### ${item.question}

${item.answer}

**Evidence:** ${item.evidence.map((file) => `\`${file}\``).join(", ")}

**Verification command:** \`${item.command}\``).join("\n\n")}
`;
}

export async function runJudgeFaq(inputs = {}) {
  await runDevpostSubmissionCopy();

  const readiness = inputs.readiness ?? (await runSubmissionVerify());
  const datahubDoctor = inputs.datahubDoctor ?? (await runDataHubReadinessDoctor());
  const mcpSmoke = inputs.mcpSmoke ?? (await runMcpAdapterSmoke());
  const honestyAudit = inputs.honestyAudit ?? (await runSubmissionHonestyAudit());
  const policyMatrix = inputs.policyMatrix ?? (await runSafetyPolicyMatrix());
  const walkthrough = inputs.walkthrough ?? (await runJudgeWalkthrough({ readiness, datahubDoctor, mcpSmoke }));

  const questions = [
    {
      question: "Is this connected to live DataHub right now?",
      answer:
        "The submitted artifact is intentionally judgeable without live DataHub, Docker, or credentials. It generates DataHub-ready metadata, exact Rest.li ingestProposal bodies, a readiness doctor, and an explicit local-only post runbook for judges who want the live GMS path.",
      evidence: [
        "hackathon-assets/datahub-readiness-doctor.md",
        "hackathon-assets/datahub-integration-checklist.md",
        "hackathon-assets/live-datahub-runbook.md",
      ],
      command: "npm run datahub:doctor",
    },
    {
      question: "What does DataHub actually contribute?",
      answer:
        "DataHub is modeled as the context layer: dataset identity, schema metadata, ownership, glossary/policy signals, and lineage become the evidence the agent reads before it chooses safe-to-queue, approval-required, or blocked outcomes.",
      evidence: [
        "examples/cat-context-agent/generated-datahub-metadata.json",
        "examples/cat-context-agent/generated-datahub-bridge-plan.json",
        "examples/cat-context-agent/generated-mcp-context-read.json",
      ],
      command: "npm run datahub:bridge",
    },
    {
      question: "Is this more than a chatbot wrapper?",
      answer:
        "Yes. The demo has a deterministic workflow boundary: three messy business requests produce one safe internal task, one approval-required action, and one blocked outreach action, with receipts tied back to source context.",
      evidence: [
        "examples/cat-context-agent/generated-agent-output.json",
        "hackathon-assets/decision-trace.md",
        "hackathon-assets/lineage-decision-map.md",
      ],
      command: "npm run evidence:reproduce",
    },
    {
      question: "What prevents unsafe automation?",
      answer:
        "The policy matrix and MCP smoke test preserve the refusal boundary. Missing verified contact or ownership blocks external outreach, and the local adapter records external_side_effects as none.",
      evidence: [
        "hackathon-assets/safety-policy-matrix.md",
        "hackathon-assets/mcp-adapter-smoke-report.md",
        "hackathon-assets/submission-honesty-audit.md",
      ],
      command: "npm run submission:honesty",
    },
    {
      question: "How can I verify the whole submission quickly?",
      answer:
        "Use the five-minute walkthrough for the shortest path, or run the full local CI command. The proof chain regenerates judge artifacts and checks the build/test suite together.",
      evidence: [
        "hackathon-assets/judge-walkthrough.md",
        "hackathon-assets/reproduction-receipt.md",
        "hackathon-assets/artifact-validation-report.md",
      ],
      command: "npm run judge:walkthrough",
    },
  ];

  const faq = {
    protocol: "cat-judge-faq-v0",
    project: "CAT Context Agent",
    generated_at: "demo-static-run",
    status:
      readiness.status === "ready" &&
      datahubDoctor.status.startsWith("ready_") &&
      mcpSmoke.status === "passed" &&
      honestyAudit.status === "passed" &&
      walkthrough.status === "ready"
        ? "ready"
        : "needs_attention",
    quick_facts: {
      submission_readiness_checks: readiness.checks.length,
      honesty_audits: honestyAudit.audits.length,
      datahub_doctor_status: datahubDoctor.status,
      local_datahub_required_for_judging: datahubDoctor.probe.required_for_judging,
      mcp_smoke_request_flows: mcpSmoke.request_flows.length,
      external_side_effects: mcpSmoke.external_side_effects,
      blocked_actions: policyMatrix.blocked_actions,
    },
    questions,
  };

  await mkdir(assetDir, { recursive: true });
  await Promise.all([
    writeFile(faqJsonPath, `${JSON.stringify(faq, null, 2)}\n`),
    writeFile(faqMarkdownPath, renderMarkdown(faq)),
  ]);

  if (faq.status !== "ready") {
    throw new Error("Judge FAQ is not ready.");
  }

  return faq;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const faq = await runJudgeFaq();
  console.log(JSON.stringify({
    protocol: faq.protocol,
    status: faq.status,
    questions: faq.questions.length,
    output: [
      "hackathon-assets/judge-faq.json",
      "hackathon-assets/judge-faq.md",
    ],
  }, null, 2));
  console.log(`Wrote ${faqJsonPath}`);
  console.log(`Wrote ${faqMarkdownPath}`);
}
