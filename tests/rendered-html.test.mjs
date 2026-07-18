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
  assert.match(html, /<meta name="description" content="CAT Context Agent turns messy business data into trusted, traceable workflows by reading DataHub-style context before taking action\."/i);
  assert.match(html, /<meta property="og:title" content="CAT Context Agent \| DataHub Hackathon Submission"\/?>/i);
  assert.match(html, /<meta property="og:image" content="https:\/\/cat-context-agent\.flyguy\.chatgpt\.site\/og\.png"\/?>/i);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image"\/?>/i);
  assert.match(html, /Context before action/);
  assert.match(html, /cat-context-agent\.flyguy\.chatgpt\.site/);
  assert.match(html, /Watch demo/);
  assert.match(html, /Open repo/);
  assert.match(html, /Try live slice/);
  assert.match(html, /Demo outcome snapshot/);
  assert.match(html, /messy requests/);
  assert.match(html, /fields mapped/);
  assert.match(html, /safe internal task/);
  assert.match(html, /approval \+ 1 block/);
  assert.match(html, /Judge start here/);
  assert.match(html, /JUDGE_START_HERE\.md/);
  assert.match(html, /open JUDGE_START_HERE\.md/);
  assert.match(html, /FAST JUDGE PATH/);
  assert.match(html, /If you only have ten minutes, start here/);
  assert.match(html, /Watch the two-minute video/);
  assert.match(html, /Run one proof command/);
  assert.match(html, /SUBMISSION READINESS/);
  assert.match(html, /Clear enough to judge without guessing/);
  assert.match(html, /Live \+ local/);
  assert.match(html, /Context contract/);
  assert.match(html, /Guarded actions/);
  assert.match(html, /Documented next/);
  assert.match(html, /DATAHUB → AGENT MAP/);
  assert.match(html, /DataHub is the context layer, not a logo on the slide/);
  assert.match(html, /Dataset identity/);
  assert.match(html, /Schema metadata/);
  assert.match(html, /Glossary \+ policy/);
  assert.match(html, /JUDGE SCORECARD/);
  assert.match(html, /The scoring case, compressed/);
  assert.match(html, /Meaningful DataHub use/);
  assert.match(html, /Safety and governance/);
  assert.match(html, /generated-datahub-bridge-plan\.json/);
  assert.match(html, /COPY\/PASTE VERIFICATION/);
  assert.match(html, /Three commands prove the submission path/);
  assert.match(html, /npm run ci:local/);
  assert.match(html, /npm run context:read/);
  assert.match(html, /26 render\/evidence tests/);
  assert.match(html, /youtu\.be\/Gcbhl5_YlSM/);
  assert.match(html, /watch the 2-minute walkthrough/);
  assert.match(html, /npm run demo:guide/);
  assert.match(html, /demo-video-guide\.md/);
  assert.match(html, /DataHub-backed workflow agent/);
  assert.match(html, /Agents That Do Real Work/);
  assert.match(html, /Messy business requests/);
  assert.match(html, /CONTEXT CHANGES THE DECISION/);
  assert.match(html, /Same messy row, safer outcome/);
  assert.match(html, /Without trusted context/);
  assert.match(html, /With DataHub context/);
  assert.match(html, /owner metadata \+ outreach policy/);
  assert.match(html, /APPROVAL QUEUE|approval queue/i);
  assert.match(html, /cat-demo-REQ-1042/);
  assert.match(html, /messy CSV, context map, approval queue, receipt JSON/);
  assert.match(html, /RUNNABLE EVIDENCE/);
  assert.match(html, /npm run evidence:reproduce/);
  assert.match(html, /npm run submission:index/);
  assert.match(html, /submission-index\.md/);
  assert.match(html, /npm run judge:brief/);
  assert.match(html, /judge-scoring-brief\.md/);
  assert.match(html, /Judge walkthrough/);
  assert.match(html, /npm run judge:walkthrough/);
  assert.match(html, /judge-walkthrough\.md/);
  assert.match(html, /npm run devpost:copy/);
  assert.match(html, /devpost-submission-copy\.md/);
  assert.match(html, /npm run datahub:bridge/);
  assert.match(html, /npm run datahub:runbook/);
  assert.match(html, /live-datahub-runbook\.md/);
  assert.match(html, /DataHub readiness doctor/);
  assert.match(html, /npm run datahub:doctor/);
  assert.match(html, /datahub-readiness-doctor\.md/);
  assert.match(html, /DataHub integration checklist/);
  assert.match(html, /npm run datahub:checklist/);
  assert.match(html, /datahub-integration-checklist\.md/);
  assert.match(html, /DataHub claim audit/);
  assert.match(html, /npm run datahub:audit/);
  assert.match(html, /datahub-claim-audit\.md/);
  assert.match(html, /DataHub MCP handoff/);
  assert.match(html, /npm run datahub:mcp/);
  assert.match(html, /datahub-mcp-handoff\.md/);
  assert.match(html, /MCP adapter smoke test/);
  assert.match(html, /npm run mcp:smoke/);
  assert.match(html, /mcp-adapter-smoke-report\.md/);
  assert.match(html, /Lineage decision map/);
  assert.match(html, /npm run lineage:map/);
  assert.match(html, /lineage-decision-map\.md/);
  assert.match(html, /Safety policy matrix/);
  assert.match(html, /npm run policy:matrix/);
  assert.match(html, /safety-policy-matrix\.md/);
  assert.match(html, /npm run judge:pack/);
  assert.match(html, /judge-evidence-pack\.md/);
  assert.match(html, /SCOPE TRANSPARENCY/);
  assert.match(html, /Working in this submission/);
  assert.match(html, /Planned live integration/);
  assert.match(html, /local decision runner/);
  assert.match(html, /DataHub MCP \/ Agent Context Kit reads/);
  assert.match(html, /JUDGE FAQ/);
  assert.match(html, /Is this connected to a live DataHub instance/);
  assert.match(html, /What does the agent actually decide/);
  assert.match(html, /How can judges reproduce the claim/);
  assert.match(html, /CLAIM TO EVIDENCE/);
  assert.match(html, /Every major claim has a thing judges can open/);
  assert.match(html, /The agent reads context before action/);
  assert.match(html, /DataHub metadata shapes the decision boundary/);
  assert.match(html, /Open proof/);
  assert.doesNotMatch(html, /Revenue Leak Audit|Get a 3-leak preview|Revenue Leak Scan/i);
});

test("keeps the project shell responsive and repo-ready", async () => {
  const [page, css, layout, packageJson, readme, judgeStart, judgeNotes, ciWorkflow, toolContracts] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
    readFile(new URL("../JUDGE_START_HERE.md", import.meta.url), "utf8"),
    readFile(new URL("../DEVPOST_JUDGE_NOTES.md", import.meta.url), "utf8"),
    readFile(new URL("../hackathon-assets/github-actions-ci-template.yml", import.meta.url), "utf8"),
    readFile(new URL("../hackathon-assets/context-tool-contracts.md", import.meta.url), "utf8"),
  ]);

  assert.match(page, /MCP Server/);
  assert.match(page, /Agent Context Kit/);
  assert.match(page, /JUDGE_START_HERE\.md/);
  assert.match(page, /cat-context-agent\.flyguy\.chatgpt\.site/);
  assert.match(page, /Watch demo/);
  assert.match(page, /Open repo/);
  assert.match(page, /Try live slice/);
  assert.match(page, /outcomeStats/);
  assert.match(page, /outcomeStrip/);
  assert.match(page, /youtu\.be\/Gcbhl5_YlSM/);
  assert.match(page, /receipt-backed action plan/);
  assert.match(page, /judgePath/);
  assert.match(page, /FAST JUDGE PATH/);
  assert.match(page, /If you only have ten minutes, start here/);
  assert.match(page, /readinessChecks/);
  assert.match(page, /readinessSection/);
  assert.match(page, /datahubUsage/);
  assert.match(page, /datahubMap/);
  assert.match(page, /judgeScorecard/);
  assert.match(page, /scorecardSection/);
  assert.match(page, /verificationCommands/);
  assert.match(page, /verifySection/);
  assert.match(page, /messyRows/);
  assert.match(page, /approvalQueue/);
  assert.match(page, /decisionComparison/);
  assert.match(page, /contextDelta/);
  assert.match(page, /scopeCards/);
  assert.match(page, /judgeFaq/);
  assert.match(page, /evidenceMatrix/);
  assert.match(page, /runnableArtifacts/);
  assert.match(page, /generated-mcp-context-read\.json/);
  assert.match(page, /datahub\.get_entity/);
  assert.match(page, /reproduction-receipt\.md/);
  assert.match(page, /judge-scoring-brief\.md/);
  assert.match(page, /judge-walkthrough\.md/);
  assert.match(page, /devpost-submission-copy\.md/);
  assert.match(page, /live-datahub-runbook\.md/);
  assert.match(page, /datahub-readiness-doctor\.md/);
  assert.match(page, /datahub-integration-checklist\.md/);
  assert.match(page, /datahub-claim-audit\.md/);
  assert.match(page, /datahub-mcp-handoff\.md/);
  assert.match(page, /mcp-adapter-smoke-report\.md/);
  assert.match(page, /lineage-decision-map\.md/);
  assert.match(page, /safety-policy-matrix\.md/);
  assert.match(packageJson, /"datahub:payload": "node scripts\/datahub-payload-preview\.mjs"/);
  assert.match(packageJson, /"datahub:runbook": "node scripts\/live-datahub-runbook\.mjs"/);
  assert.match(packageJson, /"datahub:doctor": "node scripts\/datahub-readiness-doctor\.mjs"/);
  assert.match(packageJson, /"datahub:checklist": "node scripts\/datahub-integration-checklist\.mjs"/);
  assert.match(packageJson, /"datahub:audit": "node scripts\/datahub-claim-audit\.mjs"/);
  assert.match(packageJson, /"datahub:mcp": "node scripts\/datahub-mcp-handoff\.mjs"/);
  assert.match(packageJson, /"mcp:smoke": "node scripts\/mcp-adapter-smoke\.mjs"/);
  assert.match(packageJson, /"decision:trace": "node scripts\/decision-trace\.mjs"/);
  assert.match(packageJson, /"lineage:map": "node scripts\/lineage-decision-map\.mjs"/);
  assert.match(packageJson, /"policy:matrix": "node scripts\/safety-policy-matrix\.mjs"/);
  assert.match(css, /@media \(max-width: 980px\)/);
  assert.match(css, /@media \(max-width: 620px\)/);
  assert.match(css, /button\.dark/);
  assert.match(css, /outcomeStat/);
  assert.match(css, /artifactGrid/);
  assert.match(css, /scopeGrid/);
  assert.match(css, /judgePathGrid/);
  assert.match(css, /readinessGrid/);
  assert.match(css, /datahubMapGrid/);
  assert.match(css, /scorecardList/);
  assert.match(css, /verifyGrid/);
  assert.match(css, /faqGrid/);
  assert.match(css, /evidenceMatrix/);
  assert.match(css, /deltaMatrix/);
  assert.match(layout, /CAT Context Agent \| DataHub Hackathon Submission/);
  assert.match(layout, /metadataBase: siteUrl/);
  assert.match(layout, /openGraph/);
  assert.match(layout, /twitter/);
  assert.match(layout, /\/og\.png/);
  assert.match(packageJson, /"name": "cat-context-agent"/);
  assert.match(packageJson, /"context:contracts": "node scripts\/context-tool-contracts\.mjs"/);
  assert.match(packageJson, /"judge:walkthrough": "node scripts\/judge-walkthrough\.mjs"/);
  assert.match(packageJson, /"artifacts:validate": "node scripts\/validate-artifacts\.mjs"/);
  assert.match(packageJson, /"evidence:reproduce": "node scripts\/reproduce-evidence\.mjs"/);
  assert.match(packageJson, /"judge:brief": "node scripts\/judge-scoring-brief\.mjs"/);
  assert.match(packageJson, /"devpost:copy": "node scripts\/devpost-submission-copy\.mjs"/);
  assert.match(packageJson, /"submission:index": "node scripts\/submission-index\.mjs"/);
  assert.match(packageJson, /"demo:guide": "node scripts\/demo-video-guide\.mjs"/);
  assert.match(packageJson, /"ci:local": "npm ci --dry-run && npm run context:contracts && npm run datahub:payload && npm run datahub:runbook && npm run datahub:doctor && npm run datahub:checklist && npm run datahub:audit && npm run datahub:mcp && npm run mcp:smoke && npm run decision:trace && npm run lineage:map && npm run policy:matrix && npm run submission:verify && npm run judge:walkthrough && npm run artifacts:validate && npm run judge:brief && npm run devpost:copy && npm run submission:index && npm run demo:guide && npm test"/);
  assert.match(readme, /Apache 2\.0/);
  assert.match(readme, /JUDGE_START_HERE\.md/);
  assert.match(readme, /cat-context-agent\.flyguy\.chatgpt\.site/);
  assert.match(readme, /youtu\.be\/Gcbhl5_YlSM/);
  assert.match(readme, /examples\/cat-context-agent/);
  assert.match(readme, /DataHub-style context map/);
  assert.match(readme, /generated-datahub-metadata\.json/);
  assert.match(readme, /datahub-payload-preview\.md/);
  assert.match(readme, /live-datahub-runbook\.md/);
  assert.match(readme, /datahub-readiness-doctor\.md/);
  assert.match(readme, /npm run datahub:doctor/);
  assert.match(readme, /datahub-integration-checklist\.md/);
  assert.match(readme, /datahub-claim-audit\.md/);
  assert.match(readme, /datahub-mcp-handoff\.md/);
  assert.match(readme, /mcp-adapter-smoke-report\.md/);
  assert.match(readme, /npm run mcp:smoke/);
  assert.match(readme, /decision-trace\.md/);
  assert.match(readme, /lineage-decision-map\.md/);
  assert.match(readme, /safety-policy-matrix\.md/);
  assert.match(readme, /generated-mcp-context-read\.json/);
  assert.match(readme, /context-tool-contracts\.md/);
  assert.match(readme, /judge-evidence-pack\.md/);
  assert.match(readme, /judge-walkthrough\.md/);
  assert.match(readme, /npm run judge:walkthrough/);
  assert.match(readme, /submission-readiness-report\.md/);
  assert.match(readme, /artifact-validation-report\.md/);
  assert.match(readme, /reproduction-receipt\.md/);
  assert.match(readme, /judge-scoring-brief\.md/);
  assert.match(readme, /devpost-submission-copy\.md/);
  assert.match(readme, /submission-index\.md/);
  assert.match(readme, /demo-video-guide\.md/);
  assert.match(readme, /github-actions-ci-template\.yml/);
  assert.match(readme, /DEVPOST_JUDGE_NOTES\.md/);
  assert.match(readme, /DataHub MCP \/ Agent Context Kit reads/);
  assert.match(judgeStart, /Judge Start Here/);
  assert.match(judgeStart, /https:\/\/youtu\.be\/Gcbhl5_YlSM/);
  assert.match(judgeStart, /cat-context-agent\.flyguy\.chatgpt\.site/);
  assert.match(judgeStart, /judge-walkthrough\.md/);
  assert.match(judgeStart, /npm run ci:local/);
  assert.match(judgeStart, /DataHub metadata preview/);
  assert.match(judgeStart, /generated-mcp-context-read\.json/);
  assert.match(judgeStart, /datahub-readiness-doctor\.md/);
  assert.match(judgeStart, /datahub-integration-checklist\.md/);
  assert.match(judgeStart, /datahub-claim-audit\.md/);
  assert.match(judgeStart, /datahub-mcp-handoff\.md/);
  assert.match(judgeStart, /mcp-adapter-smoke-report\.md/);
  assert.match(judgeStart, /lineage-decision-map\.md/);
  assert.match(judgeStart, /safety-policy-matrix\.md/);
  assert.match(judgeStart, /refuses to invent owners/);
  assert.match(judgeNotes, /JUDGE_START_HERE\.md/);
  assert.match(judgeNotes, /github-actions-ci-template\.yml/);
  assert.match(judgeNotes, /cat-context-agent\.flyguy\.chatgpt\.site/);
  assert.match(judgeNotes, /github\.com\/mytodd1-dotcom\/cat-context-agent/);
  assert.match(judgeNotes, /30-second version/);
  assert.match(judgeNotes, /context before action/);
  assert.match(judgeNotes, /machine-readable tool contract/);
  assert.match(judgeNotes, /five-minute judge walkthrough/);
  assert.match(judgeNotes, /npm run judge:walkthrough/);
  assert.match(judgeNotes, /generated-datahub-bridge-plan\.json/);
  assert.match(judgeNotes, /DataHub payload preview/);
  assert.match(judgeNotes, /live DataHub runbook/);
  assert.match(judgeNotes, /DataHub readiness doctor/);
  assert.match(judgeNotes, /npm run datahub:doctor/);
  assert.match(judgeNotes, /DataHub claim audit/);
  assert.match(judgeNotes, /DataHub MCP handoff/);
  assert.match(judgeNotes, /MCP adapter smoke report/);
  assert.match(judgeNotes, /npm run mcp:smoke/);
  assert.match(judgeNotes, /decision trace/);
  assert.match(judgeNotes, /submission readiness report/);
  assert.match(judgeNotes, /artifact validation report/);
  assert.match(judgeNotes, /reproduction receipt/);
  assert.match(judgeNotes, /scoring brief/);
  assert.match(judgeNotes, /local CI-equivalent command/);
  assert.match(judgeNotes, /What is simulated vs\. live/);
  assert.match(judgeNotes, /DATAHUB_GMS_URL=http:\/\/localhost:8080 npm run datahub:bridge -- --post/);
  assert.match(ciWorkflow, /npm ci/);
  assert.match(ciWorkflow, /npm run submission:verify/);
  assert.match(ciWorkflow, /npm run datahub:runbook/);
  assert.match(ciWorkflow, /npm run datahub:doctor/);
  assert.match(ciWorkflow, /npm run datahub:checklist/);
  assert.match(ciWorkflow, /npm run datahub:audit/);
  assert.match(ciWorkflow, /npm run datahub:mcp/);
  assert.match(ciWorkflow, /npm run mcp:smoke/);
  assert.match(ciWorkflow, /npm run judge:walkthrough/);
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
  assert.equal(pack.live_demo_url, "https://cat-context-agent.flyguy.chatgpt.site");
  assert.equal(pack.repo_url, "https://github.com/mytodd1-dotcom/cat-context-agent");
  assert.equal(pack.summary.decisions.needs_approval, 1);
  assert.equal(pack.summary.decisions.blocked, 1);
  assert.ok(pack.summary.datahub_aspects.includes("ownership"));
  assert.ok(pack.summary.mcp_style_tool_reads.includes("cat.get_agent_context_packet"));
  assert.ok(pack.safety_claims.some((claim) => /External outreach/.test(claim)));
  assert.ok(pack.judge_commands.includes("npm run datahub:runbook"));
  assert.ok(pack.judge_commands.includes("npm run datahub:doctor"));
  assert.ok(pack.judge_commands.includes("npm run datahub:checklist"));
  assert.ok(pack.judge_commands.includes("npm run datahub:audit"));
  assert.ok(pack.judge_commands.includes("npm run datahub:mcp"));
  assert.ok(pack.judge_commands.includes("npm run mcp:smoke"));
  assert.ok(pack.judge_commands.includes("npm run judge:walkthrough"));
  assert.ok(pack.judge_commands.includes("npm run lineage:map"));
  assert.ok(pack.judge_commands.includes("npm run policy:matrix"));
  assert.ok(pack.artifacts_to_inspect.includes("hackathon-assets/live-datahub-runbook.md"));
  assert.ok(pack.artifacts_to_inspect.includes("hackathon-assets/datahub-readiness-doctor.md"));
  assert.ok(pack.artifacts_to_inspect.includes("hackathon-assets/datahub-integration-checklist.md"));
  assert.ok(pack.artifacts_to_inspect.includes("hackathon-assets/datahub-claim-audit.md"));
  assert.ok(pack.artifacts_to_inspect.includes("hackathon-assets/datahub-mcp-handoff.md"));
  assert.ok(pack.artifacts_to_inspect.includes("hackathon-assets/mcp-adapter-smoke-report.md"));
  assert.ok(pack.artifacts_to_inspect.includes("hackathon-assets/judge-walkthrough.md"));
  assert.ok(pack.artifacts_to_inspect.includes("hackathon-assets/lineage-decision-map.md"));
  assert.ok(pack.artifacts_to_inspect.includes("hackathon-assets/safety-policy-matrix.md"));
  assert.match(packMarkdown, /REQ-1042/);
  assert.match(packMarkdown, /cat-context-agent\.flyguy\.chatgpt\.site/);
  assert.match(packMarkdown, /live-datahub-runbook\.md/);
  assert.match(packMarkdown, /datahub-readiness-doctor\.md/);
  assert.match(packMarkdown, /datahub-integration-checklist\.md/);
  assert.match(packMarkdown, /datahub-claim-audit\.md/);
  assert.match(packMarkdown, /datahub-mcp-handoff\.md/);
  assert.match(packMarkdown, /mcp-adapter-smoke-report\.md/);
  assert.match(packMarkdown, /judge-walkthrough\.md/);
  assert.match(packMarkdown, /lineage-decision-map\.md/);
  assert.match(packMarkdown, /safety-policy-matrix\.md/);
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
  assert.equal(report.checks.length, 13);
  assert.ok(report.checks.every((item) => item.ok));
  assert.equal(report.summary.total_requests, 3);
  assert.ok(report.summary.datahub_aspects.includes("glossaryTerms"));
  assert.ok(report.summary.mcp_style_tool_reads.includes("cat.get_agent_context_packet"));
  assert.match(reportMarkdown, /Submission Readiness Report/);
  assert.match(reportMarkdown, /✅ \*\*context tool contracts\*\*/);
  assert.match(reportMarkdown, /✅ \*\*DataHub integration checklist\*\*/);
  assert.match(reportMarkdown, /✅ \*\*DataHub readiness doctor\*\*/);
  assert.match(reportMarkdown, /✅ \*\*DataHub claim audit\*\*/);
  assert.match(reportMarkdown, /✅ \*\*DataHub MCP handoff\*\*/);
  assert.match(reportMarkdown, /✅ \*\*MCP adapter smoke test\*\*/);
  assert.match(reportMarkdown, /✅ \*\*lineage decision map\*\*/);
  assert.match(reportMarkdown, /✅ \*\*safety policy matrix\*\*/);
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
  await execFileAsync("node", ["scripts/live-datahub-runbook.mjs"], {
    cwd: new URL("..", import.meta.url),
  });
  await execFileAsync("node", ["scripts/verify-submission.mjs"], {
    cwd: new URL("..", import.meta.url),
  });
  await execFileAsync("node", ["scripts/judge-walkthrough.mjs"], {
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
  assert.equal(report.checks.length, 16);
  assert.ok(report.checks.every((check) => check.ok));
  assert.ok(report.validated_files.includes("hackathon-assets/context-tool-contracts.json"));
  assert.ok(report.validated_files.includes("hackathon-assets/live-datahub-runbook.json"));
  assert.ok(report.validated_files.includes("hackathon-assets/datahub-readiness-doctor.json"));
  assert.ok(report.validated_files.includes("hackathon-assets/datahub-integration-checklist.json"));
  assert.ok(report.validated_files.includes("hackathon-assets/datahub-claim-audit.json"));
  assert.ok(report.validated_files.includes("hackathon-assets/datahub-mcp-handoff.json"));
  assert.ok(report.validated_files.includes("hackathon-assets/mcp-adapter-smoke-report.json"));
  assert.ok(report.validated_files.includes("hackathon-assets/lineage-decision-map.json"));
  assert.ok(report.validated_files.includes("hackathon-assets/safety-policy-matrix.json"));
  assert.ok(report.validated_files.includes("hackathon-assets/judge-walkthrough.json"));
  assert.match(markdown, /Artifact Validation Report/);
  assert.match(markdown, /✅ \*\*tool contract coverage\*\*/);
  assert.match(markdown, /✅ \*\*DataHub readiness doctor\*\*/);
  assert.match(markdown, /✅ \*\*DataHub integration checklist\*\*/);
  assert.match(markdown, /✅ \*\*DataHub claim audit\*\*/);
  assert.match(markdown, /✅ \*\*DataHub MCP handoff\*\*/);
  assert.match(markdown, /✅ \*\*MCP adapter smoke test\*\*/);
  assert.match(markdown, /✅ \*\*lineage decision map\*\*/);
  assert.match(markdown, /✅ \*\*safety policy matrix\*\*/);
  assert.match(markdown, /✅ \*\*live DataHub runbook\*\*/);
  assert.match(markdown, /✅ \*\*judge walkthrough\*\*/);
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
  assert.equal(receipt.checks.length, 15);
  assert.equal(receipt.summary.total_requests, 3);
  assert.equal(receipt.summary.artifact_validation_checks, 16);
  assert.equal(receipt.summary.live_datahub_commands, 5);
  assert.ok(receipt.reports.includes("hackathon-assets/datahub-payload-preview.md"));
  assert.ok(receipt.reports.includes("hackathon-assets/datahub-readiness-doctor.md"));
  assert.ok(receipt.reports.includes("hackathon-assets/datahub-integration-checklist.md"));
  assert.ok(receipt.reports.includes("hackathon-assets/datahub-claim-audit.md"));
  assert.ok(receipt.reports.includes("hackathon-assets/datahub-mcp-handoff.md"));
  assert.ok(receipt.reports.includes("hackathon-assets/mcp-adapter-smoke-report.md"));
  assert.ok(receipt.reports.includes("hackathon-assets/live-datahub-runbook.md"));
  assert.ok(receipt.reports.includes("hackathon-assets/decision-trace.md"));
  assert.ok(receipt.reports.includes("hackathon-assets/lineage-decision-map.md"));
  assert.ok(receipt.reports.includes("hackathon-assets/safety-policy-matrix.md"));
  assert.ok(receipt.reports.includes("hackathon-assets/judge-walkthrough.md"));
  assert.ok(receipt.reports.includes("hackathon-assets/artifact-validation-report.md"));
  assert.match(markdown, /One-command proof/);
  assert.match(markdown, /npm run evidence:reproduce/);
});

test("generates a five-minute judge walkthrough", async () => {
  const { stdout } = await execFileAsync("node", ["scripts/judge-walkthrough.mjs"], {
    cwd: new URL("..", import.meta.url),
  });

  assert.match(stdout, /cat-judge-walkthrough-v0/);
  assert.match(stdout, /"status": "ready"/);
  assert.match(stdout, /judge-walkthrough\.md/);

  const [walkthrough, markdown] = await Promise.all([
    readFile(new URL("../hackathon-assets/judge-walkthrough.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../hackathon-assets/judge-walkthrough.md", import.meta.url), "utf8"),
  ]);

  assert.equal(walkthrough.protocol, "cat-judge-walkthrough-v0");
  assert.equal(walkthrough.status, "ready");
  assert.equal(walkthrough.steps.length, 5);
  assert.equal(walkthrough.evidence_snapshot.external_side_effects, "none");
  assert.equal(walkthrough.evidence_snapshot.mcp_adapter_request_flows, 3);
  assert.ok(walkthrough.steps.some((step) => step.command === "npm run datahub:doctor"));
  assert.ok(walkthrough.steps.some((step) => step.command === "npm run mcp:smoke"));
  assert.match(markdown, /Five-minute path/);
  assert.match(markdown, /No command in the five-minute path posts to DataHub/);
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
  assert.equal(brief.live_demo_url, "https://cat-context-agent.flyguy.chatgpt.site");
  assert.equal(brief.repo_url, "https://github.com/mytodd1-dotcom/cat-context-agent");
  assert.equal(brief.claims.length, 5);
  assert.ok(brief.claims.some((claim) => claim.claim.includes("DataHub is the context layer")));
  assert.ok(brief.claims.some((claim) => claim.files.includes("hackathon-assets/live-datahub-runbook.md")));
  assert.ok(brief.claims.some((claim) => claim.files.includes("hackathon-assets/datahub-readiness-doctor.md")));
  assert.ok(brief.claims.some((claim) => claim.files.includes("hackathon-assets/datahub-integration-checklist.md")));
  assert.ok(brief.claims.some((claim) => claim.files.includes("hackathon-assets/datahub-claim-audit.md")));
  assert.ok(brief.claims.some((claim) => claim.files.includes("hackathon-assets/datahub-mcp-handoff.md")));
  assert.ok(brief.claims.some((claim) => claim.files.includes("hackathon-assets/mcp-adapter-smoke-report.md")));
  assert.ok(brief.claims.some((claim) => claim.files.includes("hackathon-assets/decision-trace.md")));
  assert.ok(brief.claims.some((claim) => claim.files.includes("hackathon-assets/safety-policy-matrix.md")));
  assert.ok(brief.claims.some((claim) => claim.files.includes("hackathon-assets/judge-walkthrough.md")));
  assert.ok(brief.claims.some((claim) => claim.files.includes("hackathon-assets/reproduction-receipt.md")));
  assert.match(markdown, /Claim-to-evidence map/);
  assert.match(markdown, /cat-context-agent\.flyguy\.chatgpt\.site/);
  assert.match(markdown, /DataHub is the context layer/);
  assert.match(markdown, /npm run judge:brief/);
});

test("generates canonical Devpost submission copy", async () => {
  const { stdout } = await execFileAsync("node", ["scripts/devpost-submission-copy.mjs"], {
    cwd: new URL("..", import.meta.url),
  });

  assert.match(stdout, /CAT Context Agent/);
  assert.match(stdout, /cat-context-agent\.flyguy\.chatgpt\.site/);
  assert.match(stdout, /devpost-submission-copy\.md/);

  const [copy, markdown] = await Promise.all([
    readFile(new URL("../hackathon-assets/devpost-submission-copy.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../hackathon-assets/devpost-submission-copy.md", import.meta.url), "utf8"),
  ]);

  assert.equal(copy.project_name, "CAT Context Agent");
  assert.equal(copy.category, "Agents That Do Real Work");
  assert.equal(copy.live_demo_url, "https://cat-context-agent.flyguy.chatgpt.site");
  assert.equal(copy.repository_url, "https://github.com/mytodd1-dotcom/cat-context-agent");
  assert.equal(copy.demo_video_url, "https://youtu.be/Gcbhl5_YlSM");
  assert.ok(copy.built_with.includes("DataHub MCP-style read plan"));
  assert.match(copy.feedback_for_datahub, /context-aware agents/);
  assert.match(markdown, /Feedback for DataHub \/ organizers/);
  assert.match(markdown, /DataHub MCP \/ Agent Context Kit/);
  assert.match(markdown, /https:\/\/youtu\.be\/Gcbhl5_YlSM/);
});

test("generates a judge-first submission index", async () => {
  const { stdout } = await execFileAsync("node", ["scripts/submission-index.mjs"], {
    cwd: new URL("..", import.meta.url),
  });

  assert.match(stdout, /CAT Context Agent/);
  assert.match(stdout, /submission-index\.md/);

  const [index, markdown] = await Promise.all([
    readFile(new URL("../hackathon-assets/submission-index.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../hackathon-assets/submission-index.md", import.meta.url), "utf8"),
  ]);

  assert.equal(index.project, "CAT Context Agent");
  assert.equal(index.suggested_review_order.length, 14);
  assert.equal(index.canonical_links.live_demo, "https://cat-context-agent.flyguy.chatgpt.site");
  assert.ok(index.proof_commands.includes("npm run ci:local"));
  assert.ok(index.proof_commands.includes("npm run judge:walkthrough"));
  assert.ok(index.proof_commands.includes("npm run datahub:doctor"));
  assert.ok(index.proof_commands.includes("npm run datahub:checklist"));
  assert.ok(index.proof_commands.includes("npm run datahub:audit"));
  assert.ok(index.proof_commands.includes("npm run datahub:mcp"));
  assert.ok(index.proof_commands.includes("npm run mcp:smoke"));
  assert.ok(index.proof_commands.includes("npm run lineage:map"));
  assert.ok(index.proof_commands.includes("npm run policy:matrix"));
  assert.ok(index.claim_shortlist.some((item) => item.claim === "DataHub is the context layer."));
  assert.match(markdown, /Suggested judge review order/);
  assert.match(markdown, /judge-walkthrough\.md/);
  assert.match(markdown, /datahub-readiness-doctor\.md/);
  assert.match(markdown, /datahub-integration-checklist\.md/);
  assert.match(markdown, /datahub-claim-audit\.md/);
  assert.match(markdown, /datahub-mcp-handoff\.md/);
  assert.match(markdown, /mcp-adapter-smoke-report\.md/);
  assert.match(markdown, /lineage-decision-map\.md/);
  assert.match(markdown, /safety-policy-matrix\.md/);
  assert.match(markdown, /npm run evidence:reproduce/);
  assert.match(markdown, /hackathon-assets\/judge-scoring-brief\.md/);
});

test("generates a demo video accessibility guide", async () => {
  const { stdout } = await execFileAsync("node", ["scripts/demo-video-guide.mjs"], {
    cwd: new URL("..", import.meta.url),
  });

  assert.match(stdout, /CAT Context Agent/);
  assert.match(stdout, /demo-video-guide\.md/);

  const [guide, markdown] = await Promise.all([
    readFile(new URL("../hackathon-assets/demo-video-guide.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../hackathon-assets/demo-video-guide.md", import.meta.url), "utf8"),
  ]);

  assert.equal(guide.project, "CAT Context Agent");
  assert.equal(guide.video_url, "https://youtu.be/Gcbhl5_YlSM");
  assert.equal(guide.timestamps.length, 6);
  assert.ok(guide.judge_takeaways.some((item) => item.includes("DataHub")));
  assert.match(markdown, /Timestamp guide/);
  assert.match(markdown, /Transcript summary/);
  assert.match(markdown, /context before action/i);
});

test("generates a live DataHub runbook for opt-in local posting", async () => {
  const { stdout } = await execFileAsync("node", ["scripts/live-datahub-runbook.mjs"], {
    cwd: new URL("..", import.meta.url),
  });

  assert.match(stdout, /cat-live-datahub-runbook-v0/);
  assert.match(stdout, /ready_for_local_datahub/);
  assert.match(stdout, /live-datahub-runbook\.md/);

  const [runbook, markdown] = await Promise.all([
    readFile(new URL("../hackathon-assets/live-datahub-runbook.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../hackathon-assets/live-datahub-runbook.md", import.meta.url), "utf8"),
  ]);

  assert.equal(runbook.protocol, "cat-live-datahub-runbook-v0");
  assert.equal(runbook.status, "ready_for_local_datahub");
  assert.equal(runbook.dry_run_payloads.length, 4);
  assert.ok(runbook.commands.some((command) => command.command.includes("--post")));
  assert.ok(runbook.safety_boundary.some((item) => item.includes("Do not post to a remote or production DataHub")));
  assert.match(markdown, /Live DataHub Runbook/);
  assert.match(markdown, /DATAHUB_GMS_URL=http:\/\/localhost:8080 npm run datahub:bridge -- --post/);
  assert.match(markdown, /Fallback if DataHub is not running/);
});

test("runs a DataHub readiness doctor without posting metadata", async () => {
  const { stdout } = await execFileAsync("node", ["scripts/datahub-readiness-doctor.mjs"], {
    cwd: new URL("..", import.meta.url),
  });

  assert.match(stdout, /cat-datahub-readiness-doctor-v0/);
  assert.match(stdout, /ready_/);
  assert.match(stdout, /datahub-readiness-doctor\.md/);

  const [doctor, markdown] = await Promise.all([
    readFile(new URL("../hackathon-assets/datahub-readiness-doctor.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../hackathon-assets/datahub-readiness-doctor.md", import.meta.url), "utf8"),
  ]);

  assert.equal(doctor.protocol, "cat-datahub-readiness-doctor-v0");
  assert.ok(doctor.status.startsWith("ready_"));
  assert.equal(doctor.checks.length, 6);
  assert.ok(doctor.checks.every((check) => check.ok));
  assert.equal(doctor.probe.required_for_judging, false);
  assert.equal(doctor.optional_live_command, "DATAHUB_GMS_URL=http://localhost:8080 npm run datahub:bridge -- --post");
  assert.ok(doctor.evidence_files.includes("hackathon-assets/datahub-readiness-doctor.md"));
  assert.match(markdown, /DataHub Readiness Doctor/);
  assert.match(markdown, /without posting any metadata/);
  assert.match(markdown, /Required for judging: `false`/);
});

test("generates a DataHub integration checklist", async () => {
  const { stdout } = await execFileAsync("node", ["scripts/datahub-integration-checklist.mjs"], {
    cwd: new URL("..", import.meta.url),
  });

  assert.match(stdout, /cat-datahub-integration-checklist-v0/);
  assert.match(stdout, /datahub-integration-checklist\.md/);

  const [checklist, markdown] = await Promise.all([
    readFile(new URL("../hackathon-assets/datahub-integration-checklist.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../hackathon-assets/datahub-integration-checklist.md", import.meta.url), "utf8"),
  ]);

  assert.equal(checklist.protocol, "cat-datahub-integration-checklist-v0");
  assert.equal(checklist.phases.length, 5);
  assert.equal(checklist.decision_gates.can_submit_now, true);
  assert.equal(checklist.decision_gates.live_datahub_required_for_submission, false);
  assert.equal(checklist.decision_gates.secrets_required, false);
  assert.ok(checklist.phases.some((phase) => phase.command.includes("DATAHUB_GMS_URL=http://localhost:8080")));
  assert.ok(checklist.evidence_files.includes("hackathon-assets/safety-policy-matrix.md"));
  assert.match(markdown, /DataHub Integration Checklist/);
  assert.match(markdown, /Live DataHub required to judge current submission: \*\*no\*\*/);
});

test("generates a DataHub claim audit", async () => {
  const { stdout } = await execFileAsync("node", ["scripts/datahub-claim-audit.mjs"], {
    cwd: new URL("..", import.meta.url),
  });

  assert.match(stdout, /cat-datahub-claim-audit-v0/);
  assert.match(stdout, /"status": "passed"/);
  assert.match(stdout, /datahub-claim-audit\.md/);

  const [audit, markdown] = await Promise.all([
    readFile(new URL("../hackathon-assets/datahub-claim-audit.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../hackathon-assets/datahub-claim-audit.md", import.meta.url), "utf8"),
  ]);

  assert.equal(audit.protocol, "cat-datahub-claim-audit-v0");
  assert.equal(audit.status, "passed");
  assert.equal(audit.claims.length, 5);
  assert.ok(audit.claims.every((claim) => claim.ok));
  assert.ok(audit.claims.some((claim) => claim.name === "DataHub aspect coverage"));
  assert.ok(audit.claims.some((claim) => claim.name === "Local-only live posting boundary"));
  assert.ok(audit.summary.datahub_aspects.includes("ownership"));
  assert.match(markdown, /DataHub Claim Audit/);
  assert.match(markdown, /Receipt write is bounded/);
});

test("generates a DataHub MCP handoff", async () => {
  const { stdout } = await execFileAsync("node", ["scripts/datahub-mcp-handoff.mjs"], {
    cwd: new URL("..", import.meta.url),
  });

  assert.match(stdout, /cat-datahub-mcp-handoff-v0/);
  assert.match(stdout, /ready_for_mcp_adapter/);
  assert.match(stdout, /datahub-mcp-handoff\.md/);

  const [handoff, markdown] = await Promise.all([
    readFile(new URL("../hackathon-assets/datahub-mcp-handoff.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../hackathon-assets/datahub-mcp-handoff.md", import.meta.url), "utf8"),
  ]);

  assert.equal(handoff.protocol, "cat-datahub-mcp-handoff-v0");
  assert.equal(handoff.status, "ready_for_mcp_adapter");
  assert.equal(handoff.tool_calls.length, 4);
  assert.ok(handoff.tool_calls.some((tool) => tool.name === "datahub.get_entity"));
  assert.ok(handoff.tool_calls.some((tool) => tool.name === "cat.write_receipt"));
  assert.equal(handoff.request_outcomes.length, 3);
  assert.equal(handoff.local_to_live_boundary.secrets_required_for_judging, false);
  assert.match(handoff.local_to_live_boundary.local_post_command, /DATAHUB_GMS_URL=http:\/\/localhost:8080/);
  assert.match(markdown, /DataHub MCP Handoff/);
  assert.match(markdown, /Receipt side effect/);
});

test("runs a local MCP adapter smoke test", async () => {
  const { stdout } = await execFileAsync("node", ["scripts/mcp-adapter-smoke.mjs"], {
    cwd: new URL("..", import.meta.url),
  });

  assert.match(stdout, /cat-mcp-adapter-smoke-v0/);
  assert.match(stdout, /"status": "passed"/);
  assert.match(stdout, /mcp-adapter-smoke-report\.md/);

  const [report, markdown] = await Promise.all([
    readFile(new URL("../hackathon-assets/mcp-adapter-smoke-report.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../hackathon-assets/mcp-adapter-smoke-report.md", import.meta.url), "utf8"),
  ]);

  assert.equal(report.protocol, "cat-mcp-adapter-smoke-v0");
  assert.equal(report.status, "passed");
  assert.equal(report.request_flows.length, 3);
  assert.equal(report.tool_sequence.length, 12);
  assert.equal(report.external_side_effects, "none");
  assert.ok(report.contract_checks.every((check) => check.ok));
  assert.ok(report.request_flows.every((flow) => flow.read_tools_before_write.includes("datahub.get_entity")));
  assert.ok(report.request_flows.every((flow) => flow.receipt_write.external_side_effects === "none"));
  assert.match(markdown, /MCP Adapter Smoke Report/);
  assert.match(markdown, /read-before-write/i);
});

test("generates a dry-run DataHub payload preview", async () => {
  await execFileAsync("node", ["scripts/cat-context-demo.mjs"], {
    cwd: new URL("..", import.meta.url),
  });
  await execFileAsync("node", ["scripts/datahub-local-bridge.mjs"], {
    cwd: new URL("..", import.meta.url),
  });

  const { stdout } = await execFileAsync("node", ["scripts/datahub-payload-preview.mjs"], {
    cwd: new URL("..", import.meta.url),
  });

  assert.match(stdout, /cat-datahub-payload-preview-v0/);
  assert.match(stdout, /datasetProperties/);
  assert.match(stdout, /datahub-payload-preview\.md/);

  const [preview, markdown] = await Promise.all([
    readFile(new URL("../hackathon-assets/datahub-payload-preview.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../hackathon-assets/datahub-payload-preview.md", import.meta.url), "utf8"),
  ]);

  assert.equal(preview.protocol, "cat-datahub-payload-preview-v0");
  assert.equal(preview.mode, "dry-run");
  assert.equal(preview.requests.length, 4);
  assert.deepEqual(preview.aspect_names, ["datasetProperties", "schemaMetadata", "ownership", "glossaryTerms"]);
  assert.ok(preview.requests.every((request) => request.method === "POST"));
  assert.match(markdown, /DataHub Payload Preview/);
  assert.match(markdown, /DATAHUB_GMS_URL=http:\/\/localhost:8080 npm run datahub:bridge -- --post/);
});

test("generates an end-to-end request decision trace", async () => {
  const { stdout } = await execFileAsync("node", ["scripts/decision-trace.mjs"], {
    cwd: new URL("..", import.meta.url),
  });

  assert.match(stdout, /cat-decision-trace-v0/);
  assert.match(stdout, /decision-trace\.md/);

  const [trace, markdown] = await Promise.all([
    readFile(new URL("../hackathon-assets/decision-trace.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../hackathon-assets/decision-trace.md", import.meta.url), "utf8"),
  ]);

  assert.equal(trace.protocol, "cat-decision-trace-v0");
  assert.equal(trace.traces.length, 3);
  assert.deepEqual(trace.tool_read_plan, ["datahub.get_entity", "datahub.get_lineage", "cat.get_agent_context_packet"]);
  assert.ok(trace.traces.some((item) => item.request_id === "REQ-1042" && item.decision === "needs_approval"));
  assert.ok(trace.traces.some((item) => item.request_id === "REQ-1043" && item.decision === "safe_to_queue_internal_task"));
  assert.ok(trace.traces.some((item) => item.request_id === "REQ-1044" && item.blocked_action));
  assert.match(markdown, /Decision Trace/);
  assert.match(markdown, /messy row → DataHub\/MCP context read → agent decision → receipt/);
});

test("generates a lineage-to-decision map", async () => {
  const { stdout } = await execFileAsync("node", ["scripts/lineage-decision-map.mjs"], {
    cwd: new URL("..", import.meta.url),
  });

  assert.match(stdout, /cat-lineage-decision-map-v0/);
  assert.match(stdout, /lineage-decision-map\.md/);

  const [map, markdown] = await Promise.all([
    readFile(new URL("../hackathon-assets/lineage-decision-map.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../hackathon-assets/lineage-decision-map.md", import.meta.url), "utf8"),
  ]);

  assert.equal(map.protocol, "cat-lineage-decision-map-v0");
  assert.equal(map.decisions.length, 3);
  assert.ok(map.context_tools.includes("datahub.get_entity"));
  assert.ok(map.context_tools.includes("datahub.get_lineage"));
  assert.ok(map.nodes.some((node) => node.id === "datahub_asset"));
  assert.ok(map.edges.some((edge) => edge.from === "uploaded_csv" && edge.to === "datahub_asset"));
  assert.ok(map.edges.some((edge) => edge.from === "context_reads" && edge.to === "cat_decision_loop"));
  assert.ok(map.decisions.some((decision) => decision.request_id === "REQ-1044" && decision.blocked_action));
  assert.match(markdown, /Lineage Decision Map/);
  assert.match(markdown, /flowchart LR/);
  assert.match(markdown, /source → DataHub context → agent decision → approval queue → receipt/);
});

test("generates a safety policy matrix", async () => {
  const { stdout } = await execFileAsync("node", ["scripts/safety-policy-matrix.mjs"], {
    cwd: new URL("..", import.meta.url),
  });

  assert.match(stdout, /cat-safety-policy-matrix-v0/);
  assert.match(stdout, /safety-policy-matrix\.md/);

  const [matrix, markdown] = await Promise.all([
    readFile(new URL("../hackathon-assets/safety-policy-matrix.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../hackathon-assets/safety-policy-matrix.md", import.meta.url), "utf8"),
  ]);

  assert.equal(matrix.protocol, "cat-safety-policy-matrix-v0");
  assert.equal(matrix.rules.length, 6);
  assert.equal(matrix.request_outcomes.length, 3);
  assert.ok(matrix.rules.some((rule) => rule.action === "send_external_outreach" && rule.class === "approval_required"));
  assert.ok(matrix.blocked_actions.includes("scrape_contact_details"));
  assert.ok(matrix.request_outcomes.some((item) => item.request_id === "REQ-1044" && item.policy_outcome === "blocked"));
  assert.match(markdown, /Safety Policy Matrix/);
  assert.match(markdown, /send_external_outreach/);
  assert.match(markdown, /approval_required/);
});
