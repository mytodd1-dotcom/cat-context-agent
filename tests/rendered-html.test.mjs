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
  assert.match(html, /<title>CAT Context Agent \| DataHub Hackathon Draft<\/title>/i);
  assert.match(html, /Context before action/);
  assert.match(html, /DataHub-backed workflow agent/);
  assert.match(html, /Agents That Do Real Work/);
  assert.match(html, /Messy business requests/);
  assert.match(html, /APPROVAL QUEUE|approval queue/i);
  assert.match(html, /cat-demo-REQ-1042/);
  assert.match(html, /messy CSV, context map, approval queue, receipt JSON/);
  assert.doesNotMatch(html, /Revenue Leak Audit|Get a 3-leak preview|Revenue Leak Scan/i);
});

test("keeps the project shell responsive and repo-ready", async () => {
  const [page, css, layout, packageJson, readme] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
  ]);

  assert.match(page, /MCP Server/);
  assert.match(page, /Agent Context Kit/);
  assert.match(page, /receipt-backed action plan/);
  assert.match(page, /messyRows/);
  assert.match(page, /approvalQueue/);
  assert.match(css, /@media \(max-width: 980px\)/);
  assert.match(css, /@media \(max-width: 620px\)/);
  assert.match(layout, /CAT Context Agent \| DataHub Hackathon Draft/);
  assert.match(packageJson, /"name": "cat-context-agent"/);
  assert.match(readme, /Apache 2\.0/);
  assert.match(readme, /examples\/cat-context-agent/);
  assert.match(readme, /DataHub-style context map/);
  assert.match(readme, /generated-datahub-metadata\.json/);
  assert.match(readme, /DataHub MCP \/ Agent Context Kit reads/);
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
