import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders the real DataHub MCP remediation proof", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /CAT Schema Remediation Agent/);
  assert.match(html, /official MCP server/i);
  assert.match(html, /analytics\.daily_revenue/);
  assert.match(html, /net_revenue[\s\S]{0,100}has no description/);
  assert.match(html, /commerce\.raw_orders/);
  assert.match(html, /Human approval required/);
  assert.match(html, /npm run datahub:remediation:live/);
  assert.match(html, /No simulated MCP adapter is used in this proof/);
  assert.doesNotMatch(html, /messy business requests|Interactive Judge Simulator|DataHub-style/i);
});

test("keeps the live evidence reproducible and approval-gated", async () => {
  const [page, packet, packageJson, client, seed] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../evidence/live-datahub-remediation.json", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../scripts/datahub-mcp-live-client.mjs", import.meta.url), "utf8"),
    readFile(new URL("../scripts/seed-datahub-remediation-demo.py", import.meta.url), "utf8"),
  ]);
  assert.match(page, /live-datahub-remediation\.json/);
  assert.match(packet, /official-datahub-mcp-snapshot/);
  assert.match(packet, /human approval/i);
  assert.match(packageJson, /"datahub:remediation:live"/);
  assert.match(client, /live-official-datahub-mcp/);
  assert.match(client, /TOOLS_IS_MUTATION_ENABLED/);
  assert.match(seed, /analytics\.daily_revenue/);
  assert.match(seed, /UpstreamLineageClass/);
});
