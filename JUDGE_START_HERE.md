# CAT Context Agent — Judge Start Here

This is the fastest path through the DataHub Agent Hackathon submission.

## Open first

1. Watch the demo video: [https://youtu.be/Gcbhl5_YlSM](https://youtu.be/Gcbhl5_YlSM)
2. Try the live demo: [https://cat-context-agent.flyguy.chatgpt.site](https://cat-context-agent.flyguy.chatgpt.site)
3. Read the claim-to-evidence map: [`hackathon-assets/judge-scoring-brief.md`](./hackathon-assets/judge-scoring-brief.md)
4. Inspect the full submission index: [`hackathon-assets/submission-index.md`](./hackathon-assets/submission-index.md)

## What to look for

CAT Context Agent shows an agentic workflow pattern built around **context before action**:

- messy operational rows are treated as catalogable data assets;
- DataHub-style context describes fields, ownership, lineage, quality, and policy;
- the agent reads context before recommending work;
- safe internal work is queued;
- risky or underspecified work becomes an approval question;
- unsafe outreach is blocked and written as a receipt.

## One-command proof

Run this to regenerate the evidence chain, validate artifacts, build the public page, and run the tests:

```bash
npm install
npm run ci:local
```

For a shorter receipt-focused proof:

```bash
npm run evidence:reproduce
```

That writes:

- [`hackathon-assets/reproduction-receipt.md`](./hackathon-assets/reproduction-receipt.md)
- [`hackathon-assets/reproduction-receipt.json`](./hackathon-assets/reproduction-receipt.json)

## DataHub evidence

The current submission is runnable without Docker or credentials, but it makes the DataHub boundary explicit:

- DataHub metadata preview: [`examples/cat-context-agent/generated-datahub-metadata.json`](./examples/cat-context-agent/generated-datahub-metadata.json)
- dry-run DataHub bridge plan: [`examples/cat-context-agent/generated-datahub-bridge-plan.json`](./examples/cat-context-agent/generated-datahub-bridge-plan.json)
- payload preview: [`hackathon-assets/datahub-payload-preview.md`](./hackathon-assets/datahub-payload-preview.md)
- live local DataHub runbook: [`hackathon-assets/live-datahub-runbook.md`](./hackathon-assets/live-datahub-runbook.md)
- DataHub integration checklist: [`hackathon-assets/datahub-integration-checklist.md`](./hackathon-assets/datahub-integration-checklist.md)
- DataHub claim audit: [`hackathon-assets/datahub-claim-audit.md`](./hackathon-assets/datahub-claim-audit.md)
- MCP-style context read: [`examples/cat-context-agent/generated-mcp-context-read.json`](./examples/cat-context-agent/generated-mcp-context-read.json)
- lineage decision map: [`hackathon-assets/lineage-decision-map.md`](./hackathon-assets/lineage-decision-map.md)
- safety policy matrix: [`hackathon-assets/safety-policy-matrix.md`](./hackathon-assets/safety-policy-matrix.md)

## Safety claim

The prototype intentionally refuses to invent owners, scrape missing contact details, or send external outreach when verified context is missing. It converts uncertainty into approval-gated work or blocked receipts.

## Scope note

Working now: local decision runner, DataHub-ready metadata, dry-run bridge plan, MCP-style read contract, approval queue, receipt artifacts, public demo, demo video, and reproducible tests.

Planned next: replace the static context packet with live DataHub MCP / Agent Context Kit reads and write workflow receipts back as metadata or auditable artifacts.
