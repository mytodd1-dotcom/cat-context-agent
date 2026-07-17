import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

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
  assert.match(html, /Apache 2\.0|public GitHub repo|under-3-minute video/);
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
  assert.match(css, /@media \(max-width: 980px\)/);
  assert.match(css, /@media \(max-width: 620px\)/);
  assert.match(layout, /CAT Context Agent \| DataHub Hackathon Draft/);
  assert.match(packageJson, /"name": "cat-context-agent"/);
  assert.match(readme, /Apache 2\.0/);
  assert.doesNotMatch(page + layout, /codex-preview|_sites-preview|SkeletonPreview/);
});
