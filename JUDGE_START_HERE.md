# CAT Context Agent — Judge Start Here

This is the fastest path through the DataHub Agent Hackathon submission.

## Open first

1. Watch the demo video: [https://youtu.be/Gcbhl5_YlSM](https://youtu.be/Gcbhl5_YlSM)
2. Try the live demo: [https://cat-context-agent.flyguy.chatgpt.site](https://cat-context-agent.flyguy.chatgpt.site)
3. Read the 2-minute judge card: [`hackathon-assets/judge-quick-card.md`](./hackathon-assets/judge-quick-card.md)
4. Read the rubric matrix: [`hackathon-assets/judge-rubric-matrix.md`](./hackathon-assets/judge-rubric-matrix.md)
5. Read the claim-to-evidence map: [`hackathon-assets/judge-scoring-brief.md`](./hackathon-assets/judge-scoring-brief.md)
6. Follow the five-minute terminal walkthrough: [`hackathon-assets/judge-walkthrough.md`](./hackathon-assets/judge-walkthrough.md)
7. Read the hard-question FAQ: [`hackathon-assets/judge-faq.md`](./hackathon-assets/judge-faq.md)
8. Inspect the full submission index: [`hackathon-assets/submission-index.md`](./hackathon-assets/submission-index.md)

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
- DataHub readiness doctor: [`hackathon-assets/datahub-readiness-doctor.md`](./hackathon-assets/datahub-readiness-doctor.md)
- DataHub integration checklist: [`hackathon-assets/datahub-integration-checklist.md`](./hackathon-assets/datahub-integration-checklist.md)
- DataHub claim audit: [`hackathon-assets/datahub-claim-audit.md`](./hackathon-assets/datahub-claim-audit.md)
- DataHub MCP handoff: [`hackathon-assets/datahub-mcp-handoff.md`](./hackathon-assets/datahub-mcp-handoff.md)
- MCP adapter smoke report: [`hackathon-assets/mcp-adapter-smoke-report.md`](./hackathon-assets/mcp-adapter-smoke-report.md)
- submission honesty audit: [`hackathon-assets/submission-honesty-audit.md`](./hackathon-assets/submission-honesty-audit.md)
- MCP-style context read: [`examples/cat-context-agent/generated-mcp-context-read.json`](./examples/cat-context-agent/generated-mcp-context-read.json)
- lineage decision map: [`hackathon-assets/lineage-decision-map.md`](./hackathon-assets/lineage-decision-map.md)
- safety policy matrix: [`hackathon-assets/safety-policy-matrix.md`](./hackathon-assets/safety-policy-matrix.md)
- judge quick card: [`hackathon-assets/judge-quick-card.md`](./hackathon-assets/judge-quick-card.md)
- judge rubric matrix: [`hackathon-assets/judge-rubric-matrix.md`](./hackathon-assets/judge-rubric-matrix.md)
- judge FAQ: [`hackathon-assets/judge-faq.md`](./hackathon-assets/judge-faq.md)

## Safety claim

The prototype intentionally refuses to invent owners, scrape missing contact details, or send external outreach when verified context is missing. It converts uncertainty into approval-gated work or blocked receipts.

The generated [`hackathon-assets/submission-honesty-audit.md`](./hackathon-assets/submission-honesty-audit.md) also checks that the public copy does not overclaim live DataHub posting, credential requirements, or automatic customer outreach.

## Scope note

Working now: local decision runner, DataHub-ready metadata, dry-run bridge plan, MCP-style read contract, approval queue, receipt artifacts, public demo, demo video, and reproducible tests.

Planned next: replace the static context packet with live DataHub MCP / Agent Context Kit reads and write workflow receipts back as metadata or auditable artifacts.
