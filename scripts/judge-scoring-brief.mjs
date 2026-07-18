import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runEvidenceReproduction } from "./reproduce-evidence.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = resolve(root, "hackathon-assets");
const briefJsonPath = resolve(assetDir, "judge-scoring-brief.json");
const briefMarkdownPath = resolve(assetDir, "judge-scoring-brief.md");

function renderMarkdown(brief) {
  return `# CAT Context Agent — Judge Scoring Brief

Generated: \`${brief.generated_at}\`  
Evidence status: **${brief.evidence_status}**

Live demo / test URL: [${brief.live_demo_url}](${brief.live_demo_url})  
Repository: [${brief.repo_url}](${brief.repo_url})  
Demo video: [${brief.demo_video}](${brief.demo_video})

## Fast read

${brief.fast_read}

## Claim-to-evidence map

| Claim | Evidence | Files to inspect |
| --- | --- | --- |
${brief.claims.map((claim) => `| ${claim.claim} | ${claim.evidence} | ${claim.files.map((file) => `\`${file}\``).join("<br>")} |`).join("\n")}

## Why this is more than a toy demo

${brief.why_not_toy.map((item) => `- ${item}`).join("\n")}

## Judge command path

\`\`\`bash
npm install
npm run judge:brief
npm run ci:local
\`\`\`
`;
}

export async function runJudgeScoringBrief() {
  const reproduction = await runEvidenceReproduction();

  const brief = {
    project: "CAT Context Agent",
    challenge: "Build with DataHub: The Agent Hackathon",
    live_demo_url: "https://cat-context-agent.flyguy.chatgpt.site",
    repo_url: "https://github.com/mytodd1-dotcom/cat-context-agent",
    demo_video: "https://youtu.be/Gcbhl5_YlSM",
    generated_at: "demo-static-run",
    evidence_status: reproduction.status,
    fast_read:
      "CAT Context Agent demonstrates context before action: the agent reads DataHub-style schema, ownership, lineage, and policy context before deciding whether work is safe, approval-gated, or blocked.",
    claims: [
      {
        claim: "DataHub is the context layer, not a logo pasted onto the demo.",
        evidence:
          "The demo produces datasetProperties, schemaMetadata, ownership, and glossaryTerms aspects plus a dry-run DataHub bridge plan and an opt-in live DataHub runbook.",
        files: [
          "examples/cat-context-agent/generated-datahub-metadata.json",
          "examples/cat-context-agent/generated-datahub-bridge-plan.json",
          "hackathon-assets/datahub-payload-preview.md",
          "hackathon-assets/live-datahub-runbook.md",
        ],
      },
      {
        claim: "The agent reads context before it acts.",
        evidence:
          "The MCP-style read plan includes datahub.get_entity, datahub.get_lineage, and cat.get_agent_context_packet before decisions are surfaced.",
        files: [
          "examples/cat-context-agent/generated-mcp-context-read.json",
          "hackathon-assets/context-tool-contracts.md",
          "hackathon-assets/lineage-decision-map.md",
          "hackathon-assets/safety-policy-matrix.md",
        ],
      },
      {
        claim: "The demo shows real workflow behavior.",
        evidence:
          "Three messy business requests are separated into safe internal task, approval-required, and blocked external outreach outcomes.",
        files: [
          "examples/cat-context-agent/messy-business-requests.csv",
          "examples/cat-context-agent/generated-agent-output.json",
          "hackathon-assets/decision-trace.md",
          "hackathon-assets/lineage-decision-map.md",
          "hackathon-assets/judge-evidence-pack.md",
        ],
      },
      {
        claim: "The safety boundary is explicit and inspectable.",
        evidence:
          "The repo preserves blocked actions for unverified outreach and refuses to invent owners, scrape contacts, or act without verified context.",
        files: [
          "examples/cat-context-agent/generated-mcp-context-read.json",
          "hackathon-assets/artifact-validation-report.md",
          "hackathon-assets/safety-policy-matrix.md",
        ],
      },
      {
        claim: "The submission is reproducible.",
        evidence:
          "A one-command reproduction receipt reruns submission verification and artifact validation with all checks passing.",
        files: [
          "hackathon-assets/reproduction-receipt.md",
          "hackathon-assets/submission-readiness-report.md",
          "hackathon-assets/artifact-validation-report.md",
        ],
      },
    ],
    why_not_toy: [
      "It models the uncomfortable middle step most agent demos skip: deciding what the data means before taking action.",
      "It treats missing ownership and missing verified contact as workflow state, not as prompts to hallucinate.",
      "It emits receipts and regenerated reports, so the judge can audit both the recommendation and the context used to make it.",
      "It documents the local DataHub post command separately from the dry-run evidence, so mutation is explicit instead of hidden inside tests.",
      `The current evidence chain is ${reproduction.status} with ${reproduction.summary.total_requests} requests and ${reproduction.summary.artifact_validation_checks} artifact validation checks.`,
    ],
  };

  await mkdir(assetDir, { recursive: true });
  await Promise.all([
    writeFile(briefJsonPath, `${JSON.stringify(brief, null, 2)}\n`),
    writeFile(briefMarkdownPath, renderMarkdown(brief)),
  ]);

  return brief;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const brief = await runJudgeScoringBrief();
  console.log(JSON.stringify({
    project: brief.project,
    evidence_status: brief.evidence_status,
    claims: brief.claims.length,
    output: [
      "hackathon-assets/judge-scoring-brief.json",
      "hackathon-assets/judge-scoring-brief.md",
    ],
  }, null, 2));
  console.log(`Wrote ${briefJsonPath}`);
  console.log(`Wrote ${briefMarkdownPath}`);
}
