import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runDataHubClaimAudit } from "./datahub-claim-audit.mjs";
import { runJudgeQuickCard } from "./judge-quick-card.mjs";
import { runMcpAdapterSmoke } from "./mcp-adapter-smoke.mjs";
import { runSubmissionHonestyAudit } from "./submission-honesty-audit.mjs";
import { runSubmissionVerify } from "./verify-submission.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = resolve(root, "hackathon-assets");
const rubricJsonPath = resolve(assetDir, "judge-rubric-matrix.json");
const rubricMarkdownPath = resolve(assetDir, "judge-rubric-matrix.md");

function renderMarkdown(matrix) {
  return `# CAT Context Agent — Judge Rubric Matrix

Generated: \`${matrix.generated_at}\`  
Status: **${matrix.status}**  
Source checked: [${matrix.source.url}](${matrix.source.url})

This artifact maps the submission to the public DataHub Agent Hackathon judging criteria, so judges can score the project without reverse-engineering the evidence stack.

## Rubric alignment

| Criterion | CAT alignment | Evidence | Current limitation / next step |
| --- | --- | --- | --- |
${matrix.criteria.map((item) => `| ${item.criterion} | ${item.alignment} | ${item.evidence.map((file) => `\`${file}\``).join("<br>")} | ${item.limitation_or_next_step} |`).join("\n")}

## Fastest scoring path

\`\`\`bash
${matrix.fastest_scoring_command}
\`\`\`

Full validation:

\`\`\`bash
${matrix.full_validation_command}
\`\`\`

## Signals judges can verify

- DataHub aspects prepared: ${matrix.signals.datahub_aspects.map((aspect) => `\`${aspect}\``).join(", ")}
- MCP-style context reads: ${matrix.signals.mcp_style_reads.map((tool) => `\`${tool}\``).join(", ")}
- MCP smoke flows: ${matrix.signals.mcp_smoke_flows}
- External side effects: \`${matrix.signals.external_side_effects}\`
- Honesty audit status: \`${matrix.signals.honesty_status}\`
- DataHub claim audit status: \`${matrix.signals.datahub_claim_audit_status}\`

## Bottom line

${matrix.bottom_line}
`;
}

export async function runJudgeRubricMatrix(inputs = {}) {
  const readiness = inputs.readiness ?? (await runSubmissionVerify());
  const datahubClaimAudit = inputs.datahubClaimAudit ?? (await runDataHubClaimAudit());
  const mcpSmoke = inputs.mcpSmoke ?? (await runMcpAdapterSmoke());
  const honestyAudit = inputs.honestyAudit ?? (await runSubmissionHonestyAudit());
  const quickCard = inputs.quickCard ?? (await runJudgeQuickCard({ readiness, mcpSmoke, honestyAudit }));

  const matrix = {
    protocol: "cat-judge-rubric-matrix-v0",
    project: "CAT Context Agent",
    challenge: "Build with DataHub: The Agent Hackathon",
    generated_at: "demo-static-run",
    source: {
      url: "https://datahub.devpost.com/",
      checked_at: "2026-07-18",
      criteria: [
        "Use of DataHub",
        "Technical Execution",
        "Originality",
        "Real-World Usefulness",
        "Submission Quality",
        "Bonus: Meaningful Open-Source Contribution",
      ],
    },
    status:
      readiness.status === "ready" &&
      datahubClaimAudit.status === "passed" &&
      mcpSmoke.status === "passed" &&
      honestyAudit.status === "passed" &&
      quickCard.status === "ready"
        ? "ready"
        : "needs_attention",
    criteria: [
      {
        criterion: "Use of DataHub",
        alignment:
          "Strong for a reproducible prototype: DataHub-style dataset identity, schema metadata, ownership, glossary/policy context, lineage reads, MCP handoff, and optional local Rest.li ingestProposal write path are explicit.",
        evidence: [
          "examples/cat-context-agent/generated-datahub-metadata.json",
          "examples/cat-context-agent/generated-datahub-bridge-plan.json",
          "hackathon-assets/datahub-claim-audit.md",
          "hackathon-assets/datahub-mcp-handoff.md",
          "hackathon-assets/live-datahub-runbook.md",
        ],
        limitation_or_next_step:
          "The submitted path is intentionally dry-run judgeable; the next step is posting the same aspects to a local DataHub GMS and reading through live MCP / Agent Context Kit.",
      },
      {
        criterion: "Technical Execution",
        alignment:
          "Strong for submitted scope: deterministic scripts regenerate the demo outputs, validate artifacts, build the page, and test the evidence chain end-to-end.",
        evidence: [
          "package.json",
          "hackathon-assets/reproduction-receipt.md",
          "hackathon-assets/artifact-validation-report.md",
          "hackathon-assets/github-actions-ci-template.yml",
        ],
        limitation_or_next_step:
          "The next engineering step is turning the artifact pipeline into a live service endpoint with persisted request history.",
      },
      {
        criterion: "Originality",
        alignment:
          "Strong conceptually: CAT focuses on the overlooked agent step between messy business data and action — deciding what context is trusted enough to act on.",
        evidence: [
          "hackathon-assets/lineage-decision-map.md",
          "hackathon-assets/safety-policy-matrix.md",
          "hackathon-assets/judge-faq.md",
          "hackathon-assets/judge-quick-card.md",
        ],
        limitation_or_next_step:
          "A deeper submission could add more industries and compare multiple context policies side by side.",
      },
      {
        criterion: "Real-World Usefulness",
        alignment:
          "Strong for small-business operations: the demo turns revenue-risk, onboarding, and renewal requests into safe internal work, approval questions, or blocked outreach.",
        evidence: [
          "examples/cat-context-agent/messy-business-requests.csv",
          "examples/cat-context-agent/generated-agent-output.json",
          "hackathon-assets/decision-trace.md",
          "hackathon-assets/judge-evidence-pack.md",
        ],
        limitation_or_next_step:
          "The next product step is connecting a real inbox/CRM export and adding human approval handoff.",
      },
      {
        criterion: "Submission Quality",
        alignment:
          "Strong: the project has a public demo, public repo, demo video, Apache 2.0 license, quick card, scoring brief, FAQ, start guide, and reproducible setup commands.",
        evidence: [
          "JUDGE_START_HERE.md",
          "hackathon-assets/judge-quick-card.md",
          "hackathon-assets/judge-scoring-brief.md",
          "hackathon-assets/demo-video-guide.md",
          "LICENSE",
        ],
        limitation_or_next_step:
          "Keep the Devpost description synchronized with generated copy if any late demo/video fields change.",
      },
      {
        criterion: "Bonus: Meaningful Open-Source Contribution",
        alignment:
          "Emerging: the repo is Apache 2.0 and packages reusable DataHub/MCP-style context artifacts, but it does not yet contribute upstream code to DataHub.",
        evidence: [
          "LICENSE",
          "hackathon-assets/context-tool-contracts.md",
          "hackathon-assets/datahub-integration-checklist.md",
          "hackathon-assets/datahub-mcp-handoff.md",
        ],
        limitation_or_next_step:
          "Potential bonus path: submit a small DataHub documentation PR or starter-kit note derived from the MCP handoff and local runbook.",
      },
    ],
    fastest_scoring_command: "npm run judge:quick",
    full_validation_command: "npm run ci:local",
    signals: {
      datahub_aspects: readiness.summary.datahub_aspects,
      mcp_style_reads: readiness.summary.mcp_style_tool_reads,
      mcp_smoke_flows: mcpSmoke.request_flows.length,
      external_side_effects: mcpSmoke.external_side_effects,
      honesty_status: honestyAudit.status,
      datahub_claim_audit_status: datahubClaimAudit.status,
    },
    bottom_line:
      "CAT is strongest on context-before-action, safety, reproducibility, and submission clarity. The only intentional limitation is that live DataHub posting remains opt-in/local instead of required for judging, but the repo now exposes the exact Rest.li ingestProposal bodies for that local verification path.",
    outputs: [
      "hackathon-assets/judge-rubric-matrix.json",
      "hackathon-assets/judge-rubric-matrix.md",
    ],
  };

  await mkdir(assetDir, { recursive: true });
  await Promise.all([
    writeFile(rubricJsonPath, `${JSON.stringify(matrix, null, 2)}\n`),
    writeFile(rubricMarkdownPath, renderMarkdown(matrix)),
  ]);

  if (matrix.status !== "ready") {
    throw new Error("Judge rubric matrix is not ready.");
  }

  return matrix;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const matrix = await runJudgeRubricMatrix();
  console.log(JSON.stringify({
    protocol: matrix.protocol,
    status: matrix.status,
    criteria: matrix.criteria.length,
    fastest_scoring_command: matrix.fastest_scoring_command,
    output: matrix.outputs,
  }, null, 2));
  console.log(`Wrote ${rubricJsonPath}`);
  console.log(`Wrote ${rubricMarkdownPath}`);
}
