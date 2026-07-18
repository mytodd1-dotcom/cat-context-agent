import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = resolve(root, "hackathon-assets");
const guideJsonPath = resolve(assetDir, "demo-video-guide.json");
const guideMarkdownPath = resolve(assetDir, "demo-video-guide.md");

const videoGuide = {
  project: "CAT Context Agent",
  video_url: "https://youtu.be/_4qvnsGBbtA",
  purpose:
    "Accessibility and judge companion for the demo video, so the project can be reviewed quickly even without audio.",
  timestamps: [
    {
      time: "0:00",
      segment: "Problem",
      notes:
        "Small businesses have messy operational files, unclear owners, and missing contact context. The risk is an agent acting before it understands the data.",
    },
    {
      time: "0:25",
      segment: "DataHub context layer",
      notes:
        "CAT treats DataHub-style metadata as the context layer: schema, ownership, lineage, field confidence, glossary terms, and safety policy.",
    },
    {
      time: "0:50",
      segment: "Agent read-before-action loop",
      notes:
        "The agent reads entity context, lineage, and a CAT context packet before recommending any workflow action.",
    },
    {
      time: "1:15",
      segment: "Approval queue",
      notes:
        "The same messy input produces three different outcomes: safe internal task, approval-required work, and blocked outreach.",
    },
    {
      time: "1:40",
      segment: "Receipts and reproducibility",
      notes:
        "Every recommendation points back to source data, checked context, missing information, confidence, safe next step, and blocked action.",
    },
    {
      time: "2:00",
      segment: "Judge proof path",
      notes:
        "The repo includes a submission index, one-command reproduction receipt, scoring brief, Devpost copy pack, and local CI command.",
    },
  ],
  transcript_summary:
    "CAT Context Agent demonstrates context before action. It starts with messy business request data, maps it into DataHub-style metadata, reads the context needed to understand the work, and only then decides whether to queue a safe internal task, ask for approval, or block an unsafe action. The important behavior is not just automation; it is safer automation with receipts that explain what the agent knew, what was missing, and why an action was allowed or refused.",
  judge_takeaways: [
    "DataHub is used as the agent context boundary, not just a named dependency.",
    "The demo is intentionally reproducible without credentials or Docker.",
    "Safety behavior is visible in the output receipts and approval queue.",
    "The live page, video, repo, and Devpost copy all point to the same evidence chain.",
  ],
};

function renderMarkdown(guide) {
  return `# CAT Context Agent — Demo Video Guide

${guide.purpose}

Video: [${guide.video_url}](${guide.video_url})

## Timestamp guide

| Time | Segment | What to look for |
| --- | --- | --- |
${guide.timestamps.map((item) => `| ${item.time} | ${item.segment} | ${item.notes} |`).join("\n")}

## Transcript summary

${guide.transcript_summary}

## Judge takeaways

${guide.judge_takeaways.map((item) => `- ${item}`).join("\n")}
`;
}

export async function runDemoVideoGuide() {
  await mkdir(assetDir, { recursive: true });
  await Promise.all([
    writeFile(guideJsonPath, `${JSON.stringify(videoGuide, null, 2)}\n`),
    writeFile(guideMarkdownPath, renderMarkdown(videoGuide)),
  ]);
  return videoGuide;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const guide = await runDemoVideoGuide();
  console.log(JSON.stringify({
    project: guide.project,
    video_url: guide.video_url,
    timestamps: guide.timestamps.length,
    output: [
      "hackathon-assets/demo-video-guide.json",
      "hackathon-assets/demo-video-guide.md",
    ],
  }, null, 2));
  console.log(`Wrote ${guideJsonPath}`);
  console.log(`Wrote ${guideMarkdownPath}`);
}
