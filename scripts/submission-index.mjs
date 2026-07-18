import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = resolve(root, "hackathon-assets");
const indexJsonPath = resolve(assetDir, "submission-index.json");
const indexMarkdownPath = resolve(assetDir, "submission-index.md");

const submissionIndex = {
  project: "CAT Context Agent",
  purpose:
    "A judge-first index for verifying the DataHub Agent Hackathon submission without guessing where to start.",
  canonical_links: {
    live_demo: "https://cat-context-agent.flyguy.chatgpt.site",
    repository: "https://github.com/mytodd1-dotcom/cat-context-agent",
    demo_video: "https://youtu.be/Gcbhl5_YlSM",
    devpost_copy: "hackathon-assets/devpost-submission-copy.md",
  },
  suggested_review_order: [
    {
      step: 1,
      title: "Watch the demo video",
      artifact: "https://youtu.be/Gcbhl5_YlSM",
      why: "Fastest visual pass through the CAT Context Agent story.",
    },
    {
      step: 2,
      title: "Open the live demo",
      artifact: "https://cat-context-agent.flyguy.chatgpt.site",
      why: "Shows the workflow, evidence cards, approval queue, and receipt pattern.",
    },
    {
      step: 3,
      title: "Read the judge scoring brief",
      artifact: "hackathon-assets/judge-scoring-brief.md",
      why: "Maps the main claims to concrete repo evidence.",
    },
    {
      step: 4,
      title: "Follow the terminal walkthrough",
      artifact: "hackathon-assets/judge-walkthrough.md",
      command: "npm run judge:walkthrough",
      why: "Shows the shortest command path, expected outputs, inspectable files, and safety boundary.",
    },
    {
      step: 5,
      title: "Run the one-command proof",
      artifact: "hackathon-assets/reproduction-receipt.md",
      command: "npm run evidence:reproduce",
      why: "Regenerates the evidence chain and receipt from local source.",
    },
    {
      step: 6,
      title: "Inspect DataHub context artifacts",
      artifact: "examples/cat-context-agent/generated-datahub-bridge-plan.json",
      why: "Shows the datasetProperties, schemaMetadata, ownership, and glossaryTerms handoff.",
    },
    {
      step: 7,
      title: "Inspect the MCP-style read contract",
      artifact: "examples/cat-context-agent/generated-mcp-context-read.json",
      why: "Shows the agent reading entity, lineage, and CAT context before action.",
    },
    {
      step: 8,
      title: "Run the DataHub readiness doctor",
      artifact: "hackathon-assets/datahub-readiness-doctor.md",
      command: "npm run datahub:doctor",
      why: "Checks generated DataHub artifacts and optional local GMS reachability without posting metadata.",
    },
    {
      step: 9,
      title: "Inspect the DataHub integration checklist",
      artifact: "hackathon-assets/datahub-integration-checklist.md",
      command: "npm run datahub:checklist",
      why: "Shows what is judgeable now, what requires local DataHub, and what is intentionally out of scope.",
    },
    {
      step: 10,
      title: "Inspect the DataHub claim audit",
      artifact: "hackathon-assets/datahub-claim-audit.md",
      command: "npm run datahub:audit",
      why: "Gives a compact pass/fail audit of the submission's DataHub-specific claims.",
    },
    {
      step: 11,
      title: "Inspect the DataHub MCP handoff",
      artifact: "hackathon-assets/datahub-mcp-handoff.md",
      command: "npm run datahub:mcp",
      why: "Shows how DataHub reads, CAT policy context, and bounded receipt writes connect in the live path.",
    },
    {
      step: 12,
      title: "Run the MCP adapter smoke test",
      artifact: "hackathon-assets/mcp-adapter-smoke-report.md",
      command: "npm run mcp:smoke",
      why: "Proves the local adapter reads DataHub/CAT context before writing bounded receipts.",
    },
    {
      step: 13,
      title: "Inspect the lineage decision map",
      artifact: "hackathon-assets/lineage-decision-map.md",
      command: "npm run lineage:map",
      why: "Shows the source, DataHub context reads, decision branches, approval queue, and receipt path in one graph.",
    },
    {
      step: 14,
      title: "Inspect the safety policy matrix",
      artifact: "hackathon-assets/safety-policy-matrix.md",
      command: "npm run policy:matrix",
      why: "Shows which agent actions are allowed, approval-required, or blocked based on context quality.",
    },
  ],
  proof_commands: [
    "npm install",
    "npm run demo",
    "npm run submission:verify",
    "npm run judge:walkthrough",
    "npm run datahub:doctor",
    "npm run datahub:checklist",
    "npm run datahub:audit",
    "npm run datahub:mcp",
    "npm run mcp:smoke",
    "npm run lineage:map",
    "npm run policy:matrix",
    "npm run evidence:reproduce",
    "npm run judge:brief",
    "npm run devpost:copy",
    "npm run ci:local",
  ],
  claim_shortlist: [
    {
      claim: "DataHub is the context layer.",
      evidence: [
        "examples/cat-context-agent/generated-datahub-metadata.json",
        "examples/cat-context-agent/generated-datahub-bridge-plan.json",
        "hackathon-assets/datahub-payload-preview.md",
        "hackathon-assets/datahub-readiness-doctor.md",
        "hackathon-assets/datahub-integration-checklist.md",
        "hackathon-assets/datahub-claim-audit.md",
        "hackathon-assets/datahub-mcp-handoff.md",
        "hackathon-assets/mcp-adapter-smoke-report.md",
      ],
    },
    {
      claim: "The agent reads context before action.",
      evidence: [
        "examples/cat-context-agent/generated-mcp-context-read.json",
        "hackathon-assets/datahub-mcp-handoff.md",
        "hackathon-assets/mcp-adapter-smoke-report.md",
        "hackathon-assets/context-tool-contracts.md",
        "hackathon-assets/lineage-decision-map.md",
        "hackathon-assets/safety-policy-matrix.md",
      ],
    },
    {
      claim: "Unsafe work is approval-gated or blocked.",
      evidence: [
        "examples/cat-context-agent/generated-agent-output.json",
        "hackathon-assets/decision-trace.md",
        "hackathon-assets/lineage-decision-map.md",
        "hackathon-assets/safety-policy-matrix.md",
        "hackathon-assets/judge-evidence-pack.md",
      ],
    },
    {
      claim: "The submission is reproducible.",
      evidence: [
        "hackathon-assets/judge-walkthrough.md",
        "hackathon-assets/reproduction-receipt.md",
        "hackathon-assets/submission-readiness-report.md",
        "hackathon-assets/artifact-validation-report.md",
      ],
    },
  ],
};

function renderMarkdown(index) {
  return `# CAT Context Agent — Submission Index

${index.purpose}

## Canonical links

- Live demo: [${index.canonical_links.live_demo}](${index.canonical_links.live_demo})
- Repository: [${index.canonical_links.repository}](${index.canonical_links.repository})
- Demo video: [${index.canonical_links.demo_video}](${index.canonical_links.demo_video})
- Devpost copy pack: \`${index.canonical_links.devpost_copy}\`

## Suggested judge review order

| Step | Open this | Why it matters |
| --- | --- | --- |
${index.suggested_review_order.map((item) => `| ${item.step}. ${item.title} | ${item.artifact.startsWith("http") ? `[${item.artifact}](${item.artifact})` : `\`${item.artifact}\``}${item.command ? `<br><code>${item.command}</code>` : ""} | ${item.why} |`).join("\n")}

## Proof commands

\`\`\`bash
${index.proof_commands.join("\n")}
\`\`\`

## Claim shortlist

${index.claim_shortlist.map((item) => `### ${item.claim}\n\n${item.evidence.map((artifact) => `- \`${artifact}\``).join("\n")}`).join("\n\n")}
`;
}

export async function runSubmissionIndex() {
  await mkdir(assetDir, { recursive: true });
  await Promise.all([
    writeFile(indexJsonPath, `${JSON.stringify(submissionIndex, null, 2)}\n`),
    writeFile(indexMarkdownPath, renderMarkdown(submissionIndex)),
  ]);
  return submissionIndex;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const index = await runSubmissionIndex();
  console.log(JSON.stringify({
    project: index.project,
    review_steps: index.suggested_review_order.length,
    proof_commands: index.proof_commands.length,
    output: [
      "hackathon-assets/submission-index.json",
      "hackathon-assets/submission-index.md",
    ],
  }, null, 2));
  console.log(`Wrote ${indexJsonPath}`);
  console.log(`Wrote ${indexMarkdownPath}`);
}
