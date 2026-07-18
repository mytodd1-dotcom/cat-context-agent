# CAT Context Agent — Devpost Judge Notes

[`hackathon-assets/github-actions-ci-template.yml`](./hackathon-assets/github-actions-ci-template.yml) contains a GitHub Actions recipe for verifying the submission evidence chain and test suite.

## 30-second version

CAT Context Agent helps small businesses turn messy operational files into safe, traceable next steps. The core idea is context before action: the agent reads DataHub-style metadata, schema confidence, ownership, lineage, and governance rules before deciding whether to queue work, ask for approval, or block an unsafe action.

## Why this fits DataHub

Agents fail when they act on data they do not understand. This project treats DataHub as the context layer that tells an agent:

- what dataset it is looking at;
- what each field means;
- which fields are low-confidence or missing;
- who owns the data or workflow;
- which actions are allowed, approval-gated, or blocked.

The current demo keeps the DataHub integration runnable locally without Docker or credentials, then makes the planned DataHub boundary explicit through generated metadata, a bridge plan, and an MCP-style read contract.

## What is working now

The repo currently ships a reproducible local demo:

```bash
npm install
npm run demo
npm run datahub:bridge
npm run datahub:payload
npm run context:read
npm run context:contracts
npm run judge:pack
npm run submission:verify
npm run artifacts:validate
npm run evidence:reproduce
npm run judge:brief
npm run ci:local
npm test
```

Those commands produce:

- agent decision receipts for three messy business requests;
- DataHub-ready dataset properties, schema metadata, ownership, and glossary terms;
- a dry-run DataHub bridge plan;
- a DataHub payload preview that shows the aspect bodies prepared for local GMS posting;
- an MCP-style context read showing the agent’s pre-action context checks;
- a machine-readable tool contract for DataHub reads, CAT context reads, and guarded receipt writes;
- a judge evidence pack with commands, claims, and outcomes.
- a submission readiness report that validates the demo totals, DataHub aspects, MCP-style reads, blocked-action policy, and judge evidence pack.
- an artifact validation report that checks generated decisions, DataHub aspects, context reads, tool contracts, judge pack, and readiness status.
- a reproduction receipt that reruns the evidence chain and gives judges one file to inspect first.
- a scoring brief that maps each major claim to concrete evidence files.
- a local CI-equivalent command that checks fresh-install readiness and the full build/test suite.

## Architecture

```text
messy-business-requests.csv
  → CAT context demo runner
  → generated-agent-output.json
  → generated-datahub-metadata.json
  → generated-datahub-bridge-plan.json
  → generated-mcp-context-read.json
  → judge-evidence-pack.md
```

The important behavior is not just the transformation. The agent separates action types:

- safe internal task: queue the work and write a receipt;
- missing owner/context: ask for approval before action;
- missing verified contact: block external outreach.

## DataHub artifacts to inspect

- [`examples/cat-context-agent/generated-datahub-metadata.json`](./examples/cat-context-agent/generated-datahub-metadata.json)
- [`examples/cat-context-agent/generated-datahub-bridge-plan.json`](./examples/cat-context-agent/generated-datahub-bridge-plan.json)
- [`hackathon-assets/datahub-payload-preview.md`](./hackathon-assets/datahub-payload-preview.md)
- [`examples/cat-context-agent/generated-mcp-context-read.json`](./examples/cat-context-agent/generated-mcp-context-read.json)
- [`hackathon-assets/context-tool-contracts.md`](./hackathon-assets/context-tool-contracts.md)
- [`hackathon-assets/judge-evidence-pack.md`](./hackathon-assets/judge-evidence-pack.md)
- [`hackathon-assets/submission-readiness-report.md`](./hackathon-assets/submission-readiness-report.md)
- [`hackathon-assets/artifact-validation-report.md`](./hackathon-assets/artifact-validation-report.md)
- [`hackathon-assets/reproduction-receipt.md`](./hackathon-assets/reproduction-receipt.md)
- [`hackathon-assets/judge-scoring-brief.md`](./hackathon-assets/judge-scoring-brief.md)

## Safety boundary

CAT Context Agent is intentionally conservative. It does not invent owners, scrape contact details, or send external outreach when verified contact context is missing. It turns unsafe actions into either approval questions or blocked receipts.

## What is simulated vs. live

Working and committed:

- local decision runner;
- generated DataHub-ready metadata;
- dry-run DataHub bridge plan;
- MCP-style read contract;
- landing page and evidence pack;
- test coverage.

Simulated by design for the current submission:

- live DataHub GMS posting;
- live DataHub MCP reads;
- production workflow writeback.

The next technical step is to run DataHub locally and call:

```bash
DATAHUB_GMS_URL=http://localhost:8080 npm run datahub:bridge -- --post
```

Then the static context packet can be replaced with live DataHub MCP / Agent Context Kit reads.
