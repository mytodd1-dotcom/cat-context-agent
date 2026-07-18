import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the CAT Context Agent hackathon shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>CAT Context Agent \| DataHub Hackathon Submission<\/title>/i);
  assert.match(html, /Context before action/);
  assert.match(html, /DataHub-backed workflow agent/);
  assert.match(html, /Agents That Do Real Work/);
  assert.match(html, /Messy business requests/);
  assert.match(html, /APPROVAL QUEUE|approval queue/i);
  assert.match(html, /cat-demo-REQ-1042/);
  assert.match(html, /messy CSV, context map, approval queue, receipt JSON/);
  assert.match(html, /RUNNABLE EVIDENCE/);
  assert.match(html, /npm run evidence:reproduce/);
  assert.match(html, /npm run judge:brief/);
  assert.match(html, /judge-scoring-brief\.md/);
  assert.match(html, /npm run datahub:bridge/);
  assert.match(html, /npm run judge:pack/);
  assert.match(html, /judge-evidence-pack\.md/);
  assert.doesNotMatch(html, /Revenue Leak Audit|Get a 3-leak preview|Revenue Leak Scan/i);
});

test("keeps the project shell responsive and repo-ready", async () => {
  const [page, css, layout, packageJson, readme, judgeNotes, ciWorkflow, toolContracts] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
    readFile(new URL("../DEVPOST_JUDGE_NOTES.md", import.meta.url), "utf8"),
    readFile(new URL("../hackathon-assets/github-actions-ci-template.yml", import.meta.url), "utf8"),
    readFile(new URL("../hackathon-assets/context-tool-contracts.md", import.meta.url), "utf8"),
  ]);

  assert.match(page, /MCP Server/);
  assert.match(page, /Agent Context Kit/);
  assert.match(page, /receipt-backed action plan/);
  assert.match(page, /messyRows/);
  assert.match(page, /approvalQueue/);
  assert.match(page, /runnableArtifacts/);
  assert.match(page, /generated-mcp-context-read\.json/);
  assert.match(page, /datahub\.get_entity/);
  assert.match(page, /reproduction-receipt\.md/);
  assert.match(page, /judge-scoring-brief\.md/);
  assert.match(css, /@media \(max-width: 980px\)/);
  assert.match(css, /@media \(max-width: 620px\)/);
  assert.match(css, /artifactGrid/);
  assert.match(layout, /CAT Context Agent \| DataHub Hackathon Submission/);
  assert.match(packageJson, /"name": "cat-context-agent"/);
  assert.match(packageJson, /"context:contracts": "node scripts\/context-tool-contracts\.mjs"/);
  assert.match(packageJson, /"artifacts:validate": "node scripts\/validate-artifacts\.mjs"/);
  assert.match(packageJson, /"evidence:reproduce": "node scripts\/reproduce-evidence\.mjs"/);
  assert.match(packageJson, /"judge:brief": "node scripts\/judge-scoring-brief\.mjs"/);
  assert.match(packageJson, /"ci:local": "npm ci --dry-run && npm run context:contracts && npm run submission:verify && npm run artifacts:validate && npm run judge:brief && npm test"/);
  assert.match(readme, /Apache 2\.0/);
  assert.match(readme, /examples\/cat-context-agent/);
  assert.match(readme, /DataHub-style context map/);
  assert.match(readme, /generated-datahub-metadata\.json/);
  assert.match(readme, /generated-mcp-context-read\.json/);
  assert.match(readme, /context-tool-contracts\.md/);
  assert.match(readme, /judge-evidence-pack\.md/);
  assert.match(readme, /submission-readiness-report\.md/);
  assert.match(readme, /artifact-validation-report\.md/);
  assert.match(readme, /reproduction-receipt\.md/);
  assert.match(readme, /judge-scoring-brief\.md/);
  assert.match(readme, /github-actions-ci-template\.yml/);
  assert.match(readme, /DEVPOST_JUDGE_NOTES\.md/);
  assert.match(readme, /DataHub MCP \/ Agent Context Kit reads/);
  assert.match(judgeNotes, /github-actions-ci-template\.yml/);
  assert.match(judgeNotes, /30-second version/);
  assert.match(judgeNotes, /context before action/);
  assert.match(judgeNotes, /machine-readable tool contract/);
  assert.match(judgeNotes, /generated-datahub-bridge-plan\.json/);
  assert.match(judgeNotes, /submission readiness report/);
  assert.match(judgeNotes, /artifact validation report/);
  assert.match(judgeNotes, /reproduction receipt/);
  assert.match(judgeNotes, /scoring brief/);
  assert.match(judgeNotes, /local CI-equivalent command/);
  assert.match(judgeNotes, /What is simulated vs\. live/);
  assert.match(judgeNotes, /DATAHUB_GMS_URL=http:\/\/localhost:8080 npm run datahub:bridge -- --post/);
  assert.match(ciWorkflow, /npm ci/);
  assert.match(ciWorkflow, /npm run submission:verify/);
  assert.match(ciWorkflow, /npm run artifacts:validate/);
  assert.match(ciWorkflow, /npm test/);
  assert.match(ciWorkflow, /npm run ci:local/);
  assert.match(ciWorkflow, /node-version: 22/);
  assert.match(toolContracts, /datahub\.get_entity/);
  assert.match(toolContracts, /cat\.write_receipt/);
  assert.match(toolContracts, /send_external_outreach_without_verified_contact/);
  assert.doesNotMatch(page + layout, /codex-preview|_sites-preview|SkeletonPreview/);
});

test("ships judge-readable context and receipt example artifacts", async () => {
  const [contextMap, receipts, sampleCsv] = await Promise.all([
    readFile(new URL("../examples/cat-context-agent/datahub-context-map.json", import.meta.url), "utf8"),
    readFile(new URL("../examples/cat-context-agent/agent-receipts.json", import.meta.url), "utf8"),
    readFile(new URL("../examples/cat-context-agent/messy-business-requests.csv", import.meta.url), "utf8"),
  ]);

  const context = JSON.parse(contextMap);
  const parsedReceipts = JSON.parse(receipts);

  assert.equal(context.asset.urn, "urn:li:dataset:(cat,messy_business_requests,PROD)");
  assert.equal(context.governance.owner_required_for_external_outreach, true);
  assert.match(sampleCsv, /REQ-1042,Acme HVAC/);
  assert.equal(parsedReceipts.length, 3);
  assert.ok(parsedReceipts.some((receipt) => receipt.decision === "blocked"));
  assert.ok(parsedReceipts.some((receipt) => receipt.decision === "safe_to_queue_internal_task"));
});

test("runs the local CAT context demo and writes deterministic output", async () => {
  const { stdout } = await execFileAsync("node", ["scripts/cat-context-demo.mjs"], {
    cwd: new URL("..", import.meta.url),
  });
  assert.match(stdout, /"safe_to_queue": 1/);
  assert.match(stdout, /"needs_approval": 1/);
  assert.match(stdout, /"blocked": 1/);
  assert.match(stdout, /generated-datahub-metadata\.json/);
  assert.match(stdout, /generated-agent-context-packet\.json/);

  const [generated, datahubMetadata, agentContext] = await Promise.all([
    readFile(new URL("../examples/cat-context-agent/generated-agent-output.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../examples/cat-context-agent/generated-datahub-metadata.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../examples/cat-context-agent/generated-agent-context-packet.json", import.meta.url), "utf8").then(JSON.parse),
  ]);

  assert.equal(generated.summary.total_requests, 3);
  assert.equal(generated.summary.safe_to_queue, 1);
  assert.equal(generated.summary.needs_approval, 1);
  assert.equal(generated.summary.blocked, 1);
  assert.ok(generated.receipts.some((receipt) => receipt.receipt_id === "cat-demo-REQ-1042" && receipt.decision === "needs_approval"));
  assert.equal(datahubMetadata.entityUrn, "urn:li:dataset:(cat,messy_business_requests,PROD)");
  assert.equal(datahubMetadata.aspects.datasetProperties.customProperties.cat_decisions_blocked, "1");
  assert.equal(agentContext.protocol, "cat-agent-context-v0");
  assert.ok(agentContext.blocked_actions.includes("send_external_outreach_without_verified_contact"));
});

test("builds a dry-run DataHub bridge plan from generated context", async () => {
  await execFileAsync("node", ["scripts/cat-context-demo.mjs"], {
    cwd: new URL("..", import.meta.url),
  });

  const { stdout } = await execFileAsync("node", ["scripts/datahub-local-bridge.mjs"], {
    cwd: new URL("..", import.meta.url),
  });

  assert.match(stdout, /"mode": "dry-run"/);
  assert.match(stdout, /datasetProperties/);
  assert.match(stdout, /schemaMetadata/);
  assert.match(stdout, /ownership/);
  assert.match(stdout, /glossaryTerms/);
  assert.match(stdout, /generated-datahub-bridge-plan\.json/);

  const bridgePlan = await readFile(
    new URL("../examples/cat-context-agent/generated-datahub-bridge-plan.json", import.meta.url),
    "utf8",
  ).then(JSON.parse);

  assert.equal(bridgePlan.mode, "dry-run");
  assert.equal(bridgePlan.entityUrn, "urn:li:dataset:(cat,messy_business_requests,PROD)");
  assert.deepEqual(
    bridgePlan.proposals.map((proposal) => proposal.aspectName),
    ["datasetProperties", "schemaMetadata", "ownership", "glossaryTerms"],
  );
  assert.match(bridgePlan.next_endpoint, /\/openapi\/entities\/v1\/$/);
  assert.ok(bridgePlan.agent_context_summary.allowed_actions.includes("create_internal_review_task"));
  assert.ok(
    bridgePlan.agent_context_summary.blocked_actions.includes(
      "send_external_outreach_without_verified_contact",
    ),
  );
});

test("builds an MCP-style context read plan before agent action", async () => {
  await execFileAsync("node", ["scripts/cat-context-demo.mjs"], {
    cwd: new URL("..", import.meta.url),
  });
  await execFileAsync("node", ["scripts/datahub-local-bridge.mjs"], {
    cwd: new URL("..", import.meta.url),
  });

  const { stdout } = await execFileAsync("node", ["scripts/cat-context-provider.mjs", "--request-id", "REQ-1042"], {
    cwd: new URL("..", import.meta.url),
  });

  assert.match(stdout, /local-datahub-mcp-adapter/);
  assert.match(stdout, /datahub\.get_entity/);
  assert.match(stdout, /datahub\.get_lineage/);
  assert.match(stdout, /cat\.get_agent_context_packet/);
  assert.match(stdout, /generated-mcp-context-read\.json/);

  const contextRead = await readFile(
    new URL("../examples/cat-context-agent/generated-mcp-context-read.json", import.meta.url),
    "utf8",
  ).then(JSON.parse);

  assert.equal(contextRead.protocol, "cat-mcp-context-read-v0");
  assert.equal(contextRead.request_filter, "REQ-1042");
  assert.equal(contextRead.decisions.length, 1);
  assert.equal(contextRead.decisions[0].decision, "needs_approval");
  assert.equal(contextRead.approval_queue.length, 1);
  assert.deepEqual(
    contextRead.tool_read_plan.map((tool) => tool.name),
    ["datahub.get_entity", "datahub.get_lineage", "cat.get_agent_context_packet"],
  );
  assert.ok(contextRead.context.low_confidence_fields.some((field) => field.field === "owner"));
  assert.ok(contextRead.context.blocked_actions.includes("send_external_outreach_without_verified_contact"));
});

test("builds a judge evidence pack from generated artifacts", async () => {
  await execFileAsync("node", ["scripts/cat-context-demo.mjs"], {
    cwd: new URL("..", import.meta.url),
  });
  await execFileAsync("node", ["scripts/datahub-local-bridge.mjs"], {
    cwd: new URL("..", import.meta.url),
  });
  await execFileAsync("node", ["scripts/cat-context-provider.mjs"], {
    cwd: new URL("..", import.meta.url),
  });

  const { stdout } = await execFileAsync("node", ["scripts/judge-evidence-pack.mjs"], {
    cwd: new URL("..", import.meta.url),
  });

  assert.match(stdout, /CAT Context Agent/);
  assert.match(stdout, /datasetProperties/);
  assert.match(stdout, /datahub\.get_entity/);
  assert.match(stdout, /judge-evidence-pack\.md/);

  const [pack, packMarkdown] = await Promise.all([
    readFile(new URL("../hackathon-assets/judge-evidence-pack.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../hackathon-assets/judge-evidence-pack.md", import.meta.url), "utf8"),
  ]);

  assert.equal(pack.summary.total_requests, 3);
  assert.equal(pack.summary.decisions.needs_approval, 1);
  assert.equal(pack.summary.decisions.blocked, 1);
  assert.ok(pack.summary.datahub_aspects.includes("ownership"));
  assert.ok(pack.summary.mcp_style_tool_reads.includes("cat.get_agent_context_packet"));
  assert.ok(pack.safety_claims.some((claim) => /External outreach/.test(claim)));
  assert.match(packMarkdown, /REQ-1042/);
  assert.match(packMarkdown, /Do not guess, scrape, or invent contact details/);
});

test("verifies the complete submission evidence chain", async () => {
  const { stdout } = await execFileAsync("node", ["scripts/verify-submission.mjs"], {
    cwd: new URL("..", import.meta.url),
  });

  assert.match(stdout, /"status": "ready"/);
  assert.match(stdout, /datasetProperties/);
  assert.match(stdout, /datahub\.get_entity/);
  assert.match(stdout, /submission-readiness-report\.md/);

  const [report, reportMarkdown] = await Promise.all([
    readFile(new URL("../hackathon-assets/submission-readiness-report.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../hackathon-assets/submission-readiness-report.md", import.meta.url), "utf8"),
  ]);

  assert.equal(report.status, "ready");
  assert.equal(report.checks.length, 6);
  assert.ok(report.checks.every((item) => item.ok));
  assert.equal(report.summary.total_requests, 3);
  assert.ok(report.summary.datahub_aspects.includes("glossaryTerms"));
  assert.ok(report.summary.mcp_style_tool_reads.includes("cat.get_agent_context_packet"));
  assert.match(reportMarkdown, /Submission Readiness Report/);
  assert.match(reportMarkdown, /✅ \*\*context tool contracts\*\*/);
  assert.match(reportMarkdown, /✅ \*\*safety boundary\*\*/);
});

test("generates machine-readable context tool contracts", async () => {
  const { stdout } = await execFileAsync("node", ["scripts/context-tool-contracts.mjs"], {
    cwd: new URL("..", import.meta.url),
  });

  assert.match(stdout, /cat-context-tool-contracts-v0/);
  assert.match(stdout, /datahub\.get_entity/);
  assert.match(stdout, /cat\.write_receipt/);
  assert.match(stdout, /context-tool-contracts\.md/);

  const contracts = await readFile(
    new URL("../hackathon-assets/context-tool-contracts.json", import.meta.url),
    "utf8",
  ).then(JSON.parse);

  assert.equal(contracts.protocol, "cat-context-tool-contracts-v0");
  assert.ok(contracts.tools.some((tool) => tool.name === "datahub.get_lineage"));
  assert.ok(contracts.tools.some((tool) => tool.name === "cat.get_agent_context_packet"));
  assert.ok(contracts.safety_boundary.blocked_without_verified_context.includes("invent_missing_owner"));
});

test("validates generated evidence artifacts", async () => {
  await execFileAsync("node", ["scripts/context-tool-contracts.mjs"], {
    cwd: new URL("..", import.meta.url),
  });
  await execFileAsync("node", ["scripts/verify-submission.mjs"], {
    cwd: new URL("..", import.meta.url),
  });

  const { stdout } = await execFileAsync("node", ["scripts/validate-artifacts.mjs"], {
    cwd: new URL("..", import.meta.url),
  });

  assert.match(stdout, /"status": "valid"/);
  assert.match(stdout, /artifact-validation-report\.md/);

  const [report, markdown] = await Promise.all([
    readFile(new URL("../hackathon-assets/artifact-validation-report.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../hackathon-assets/artifact-validation-report.md", import.meta.url), "utf8"),
  ]);

  assert.equal(report.status, "valid");
  assert.equal(report.checks.length, 7);
  assert.ok(report.checks.every((check) => check.ok));
  assert.ok(report.validated_files.includes("hackathon-assets/context-tool-contracts.json"));
  assert.match(markdown, /Artifact Validation Report/);
  assert.match(markdown, /✅ \*\*tool contract coverage\*\*/);
});

test("reproduces the judge evidence chain with one command", async () => {
  const { stdout } = await execFileAsync("node", ["scripts/reproduce-evidence.mjs"], {
    cwd: new URL("..", import.meta.url),
  });

  assert.match(stdout, /"status": "reproducible"/);
  assert.match(stdout, /reproduction-receipt\.md/);

  const [receipt, markdown] = await Promise.all([
    readFile(new URL("../hackathon-assets/reproduction-receipt.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../hackathon-assets/reproduction-receipt.md", import.meta.url), "utf8"),
  ]);

  assert.equal(receipt.status, "reproducible");
  assert.equal(receipt.checks.length, 4);
  assert.equal(receipt.summary.total_requests, 3);
  assert.equal(receipt.summary.artifact_validation_checks, 7);
  assert.ok(receipt.reports.includes("hackathon-assets/artifact-validation-report.md"));
  assert.match(markdown, /One-command proof/);
  assert.match(markdown, /npm run evidence:reproduce/);
});

test("generates a judge scoring brief from reproduced evidence", async () => {
  const { stdout } = await execFileAsync("node", ["scripts/judge-scoring-brief.mjs"], {
    cwd: new URL("..", import.meta.url),
  });

  assert.match(stdout, /"evidence_status": "reproducible"/);
  assert.match(stdout, /judge-scoring-brief\.md/);

  const [brief, markdown] = await Promise.all([
    readFile(new URL("../hackathon-assets/judge-scoring-brief.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../hackathon-assets/judge-scoring-brief.md", import.meta.url), "utf8"),
  ]);

  assert.equal(brief.evidence_status, "reproducible");
  assert.equal(brief.claims.length, 5);
  assert.ok(brief.claims.some((claim) => claim.claim.includes("DataHub is the context layer")));
  assert.ok(brief.claims.some((claim) => claim.files.includes("hackathon-assets/reproduction-receipt.md")));
  assert.match(markdown, /Claim-to-evidence map/);
  assert.match(markdown, /DataHub is the context layer/);
  assert.match(markdown, /npm run judge:brief/);
});
