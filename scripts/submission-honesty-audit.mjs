import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = resolve(root, "hackathon-assets");

const paths = {
  auditJson: resolve(assetDir, "submission-honesty-audit.json"),
  auditMarkdown: resolve(assetDir, "submission-honesty-audit.md"),
  appPage: resolve(root, "app/page.tsx"),
  readme: resolve(root, "README.md"),
  judgeNotes: resolve(root, "DEVPOST_JUDGE_NOTES.md"),
  judgeStart: resolve(root, "JUDGE_START_HERE.md"),
  devpostCopy: resolve(assetDir, "devpost-submission-copy.md"),
  datahubChecklist: resolve(assetDir, "datahub-integration-checklist.json"),
  datahubChecklistMarkdown: resolve(assetDir, "datahub-integration-checklist.md"),
  datahubReadinessDoctor: resolve(assetDir, "datahub-readiness-doctor.json"),
  liveRunbook: resolve(assetDir, "live-datahub-runbook.json"),
  mcpAdapterSmoke: resolve(assetDir, "mcp-adapter-smoke-report.json"),
  safetyPolicyMatrix: resolve(assetDir, "safety-policy-matrix.json"),
};

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

function audit(name, ok, evidence, files) {
  return { name, ok: Boolean(ok), evidence, files };
}

function hasAll(text, phrases) {
  return phrases.every((phrase) => text.includes(phrase));
}

function renderMarkdown(report) {
  return `# CAT Context Agent — Submission Honesty Audit

Generated: \`${report.generated_at}\`  
Status: **${report.status}**

This audit checks that the public submission surfaces stay honest about what is runnable now, what is optional live DataHub work, what the agent is not allowed to do, and whether the no-overclaim language is preserved.

## Audit checks

${report.audits.map((item) => `- ${item.ok ? "✅" : "❌"} **${item.name}** — ${item.evidence}
  - Files: ${item.files.map((file) => `\`${file}\``).join(", ")}`).join("\n")}

## Explicit boundaries

${report.explicit_boundaries.map((boundary) => `- ${boundary}`).join("\n")}

## Disallowed overclaims checked

${report.disallowed_overclaims.map((claim) => `- \`${claim}\``).join("\n")}
`;
}

export async function runSubmissionHonestyAudit() {
  const [
    appPage,
    readme,
    judgeNotes,
    judgeStart,
    devpostCopy,
    datahubChecklist,
    datahubChecklistMarkdown,
    datahubReadinessDoctor,
    liveRunbook,
    mcpAdapterSmoke,
    safetyPolicyMatrix,
  ] = await Promise.all([
    readFile(paths.appPage, "utf8"),
    readFile(paths.readme, "utf8"),
    readFile(paths.judgeNotes, "utf8"),
    readFile(paths.judgeStart, "utf8"),
    readFile(paths.devpostCopy, "utf8"),
    readJson(paths.datahubChecklist),
    readFile(paths.datahubChecklistMarkdown, "utf8"),
    readJson(paths.datahubReadinessDoctor),
    readJson(paths.liveRunbook),
    readJson(paths.mcpAdapterSmoke),
    readJson(paths.safetyPolicyMatrix),
  ]);

  const publicSurfaces = [appPage, readme, judgeNotes, judgeStart, devpostCopy].join("\n\n");
  const submissionPack = [publicSurfaces, datahubChecklistMarkdown].join("\n\n");
  const lowerPublicSurfaces = publicSurfaces.toLowerCase();
  const disallowedOverclaims = [
    "already connected to live datahub",
    "posts to datahub by default",
    "requires datahub credentials to judge",
    "sends customer outreach automatically",
    "scrapes contact details",
    "fully autonomous customer outreach",
    "production datahub mutation by default",
  ];
  const matchedOverclaims = disallowedOverclaims.filter((claim) => lowerPublicSurfaces.includes(claim));

  const audits = [
    audit(
      "public copy separates runnable demo from optional live DataHub",
      hasAll(submissionPack, [
        "What is simulated vs. live",
        "The submitted demo is intentionally runnable without credentials or Docker",
        "Live DataHub required to judge current submission: **no**",
      ]),
      "The repo, judge notes, and live page disclose that the submitted artifact is runnable locally while the live GMS path is optional.",
      [
        "DEVPOST_JUDGE_NOTES.md",
        "app/page.tsx",
        "hackathon-assets/datahub-integration-checklist.md",
      ],
    ),
    audit(
      "no forbidden overclaims on public surfaces",
      matchedOverclaims.length === 0,
      matchedOverclaims.length === 0
        ? "No public surface uses the checked phrases for live posting, credential requirements, or automatic customer outreach."
        : `Matched overclaims: ${matchedOverclaims.join(", ")}`,
      [
        "README.md",
        "DEVPOST_JUDGE_NOTES.md",
        "JUDGE_START_HERE.md",
        "app/page.tsx",
        "hackathon-assets/devpost-submission-copy.md",
      ],
    ),
    audit(
      "live DataHub remains an explicit opt-in local action",
      datahubChecklist.decision_gates.live_datahub_required_for_submission === false &&
        datahubChecklist.decision_gates.secrets_required === false &&
        datahubReadinessDoctor.probe.required_for_judging === false &&
        liveRunbook.commands.some((command) => command.command.includes("DATAHUB_GMS_URL=http://localhost:8080") && command.command.includes("--post")),
      "Generated artifacts say judging does not require live DataHub, and the only live post command targets a local GMS with an explicit flag.",
      [
        "hackathon-assets/datahub-integration-checklist.json",
        "hackathon-assets/datahub-readiness-doctor.json",
        "hackathon-assets/live-datahub-runbook.json",
      ],
    ),
    audit(
      "external side effects stay bounded",
      mcpAdapterSmoke.external_side_effects === "none" &&
        safetyPolicyMatrix.blocked_actions.includes("send_external_outreach_without_verified_contact") &&
        safetyPolicyMatrix.blocked_actions.includes("scrape_contact_details"),
      "The local adapter smoke test records no external side effects, and the policy matrix preserves blocked outreach and scraping actions.",
      [
        "hackathon-assets/mcp-adapter-smoke-report.json",
        "hackathon-assets/safety-policy-matrix.json",
      ],
    ),
    audit(
      "feedback and limitations are documented",
      devpostCopy.includes("Feedback for DataHub / organizers") &&
        judgeNotes.includes("What is simulated vs. live") &&
        appPage.includes("not hidden inside the demo"),
      "Organizer feedback, simulated-vs-live scope, and implementation limits are visible before judging.",
      [
        "hackathon-assets/devpost-submission-copy.md",
        "DEVPOST_JUDGE_NOTES.md",
        "app/page.tsx",
      ],
    ),
  ];

  const report = {
    protocol: "cat-submission-honesty-audit-v0",
    project: "CAT Context Agent",
    generated_at: "demo-static-run",
    status: audits.every((item) => item.ok) ? "passed" : "failed",
    audits,
    explicit_boundaries: [
      "The demo is runnable without DataHub credentials or Docker.",
      "The live DataHub post path is local-only and requires DATAHUB_GMS_URL plus --post.",
      "The agent blocks or approval-gates external outreach when contact or owner context is missing.",
      "Local smoke tests write receipts only and report external_side_effects as none.",
    ],
    disallowed_overclaims: disallowedOverclaims,
  };

  await mkdir(assetDir, { recursive: true });
  await Promise.all([
    writeFile(paths.auditJson, `${JSON.stringify(report, null, 2)}\n`),
    writeFile(paths.auditMarkdown, renderMarkdown(report)),
  ]);

  if (report.status !== "passed") {
    throw new Error(`Submission honesty audit failed: ${audits.filter((item) => !item.ok).map((item) => item.name).join(", ")}`);
  }

  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const report = await runSubmissionHonestyAudit();
  console.log(JSON.stringify({
    protocol: report.protocol,
    status: report.status,
    audits: report.audits.length,
    output: [
      "hackathon-assets/submission-honesty-audit.json",
      "hackathon-assets/submission-honesty-audit.md",
    ],
  }, null, 2));
  console.log(`Wrote ${paths.auditJson}`);
  console.log(`Wrote ${paths.auditMarkdown}`);
}
