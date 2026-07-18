# CAT Context Agent

CAT Context Agent is a DataHub Agent Hackathon project for a context-aware workflow agent.

The goal is simple: messy business data should become safe, traceable next actions only after an agent understands the data context. DataHub is the planned context layer for schemas, ownership, lineage, and metadata receipts.

## Judge start here

For the fastest review path, open [`JUDGE_START_HERE.md`](./JUDGE_START_HERE.md).

Short version:

- Watch the demo video: [https://youtu.be/Gcbhl5_YlSM](https://youtu.be/Gcbhl5_YlSM)
- Open the live demo: [https://cat-context-agent.flyguy.chatgpt.site](https://cat-context-agent.flyguy.chatgpt.site)
- Read the scoring brief: [`hackathon-assets/judge-scoring-brief.md`](./hackathon-assets/judge-scoring-brief.md)
- Run the local proof: `npm run ci:local`

## Hackathon target

- Event: Build with DataHub: The Agent Hackathon
- Challenge category: Agents That Do Real Work
- Live demo / test URL: [https://cat-context-agent.flyguy.chatgpt.site](https://cat-context-agent.flyguy.chatgpt.site)
- Demo video: [https://youtu.be/Gcbhl5_YlSM](https://youtu.be/Gcbhl5_YlSM)
- Repository: [https://github.com/mytodd1-dotcom/cat-context-agent](https://github.com/mytodd1-dotcom/cat-context-agent)
- Submission concept: small-business messy data → DataHub context → agent reasoning → approval queue → receipt-backed action plan

## Demo flow

1. Ingest a messy sample business dataset.
2. Register/catalog the data context with DataHub.
3. Let an agent query DataHub before recommending actions.
4. Surface missing fields, confidence notes, and unsafe assumptions.
5. Generate an approval queue and a traceable receipt for each recommendation.

## Current demo slice

The repository now includes a first judge-readable demo slice in [`examples/cat-context-agent`](./examples/cat-context-agent):

- sample messy business request data;
- a DataHub-style context map;
- example agent receipts for approval-required, safe-to-queue, and blocked actions.
- generated output from the local decision runner.
- generated DataHub-ready metadata and agent context packets.

The landing page renders the same slice as a visual workflow: messy CSV → DataHub context read → approval queue → receipt JSON.

For the fastest judge-oriented overview, see [`DEVPOST_JUDGE_NOTES.md`](./DEVPOST_JUDGE_NOTES.md).

Run it locally:

```bash
npm run demo
```

The command reads the sample CSV and context map, applies the current safety rules, and writes:

- [`examples/cat-context-agent/generated-agent-output.json`](./examples/cat-context-agent/generated-agent-output.json)
- [`examples/cat-context-agent/generated-datahub-metadata.json`](./examples/cat-context-agent/generated-datahub-metadata.json)
- [`examples/cat-context-agent/generated-agent-context-packet.json`](./examples/cat-context-agent/generated-agent-context-packet.json)

To preview the DataHub handoff without a running DataHub instance:

```bash
npm run datahub:bridge
```

That command writes [`examples/cat-context-agent/generated-datahub-bridge-plan.json`](./examples/cat-context-agent/generated-datahub-bridge-plan.json), a dry-run list of DataHub Metadata Change Proposal bodies plus the agent context summary. The optional live path posts those bodies to a local GMS Rest.li `ingestProposal` endpoint only when `--post` is supplied.

To generate a judge-readable preview of the DataHub aspect payloads:

```bash
npm run datahub:payload
```

That command writes [`hackathon-assets/datahub-payload-preview.md`](./hackathon-assets/datahub-payload-preview.md) and [`hackathon-assets/datahub-payload-preview.json`](./hackathon-assets/datahub-payload-preview.json), showing the dry-run `datasetProperties`, `schemaMetadata`, `ownership`, and `glossaryTerms` Rest.li `ingestProposal` bodies that the bridge would post after local DataHub is running.

To generate the live DataHub verification runbook:

```bash
npm run datahub:runbook
```

That command writes [`hackathon-assets/live-datahub-runbook.md`](./hackathon-assets/live-datahub-runbook.md) and [`hackathon-assets/live-datahub-runbook.json`](./hackathon-assets/live-datahub-runbook.json), documenting the local DataHub prerequisites, opt-in `--post` command, expected outputs, acceptance checks, fallback path, and safety boundary.

To check optional local DataHub readiness without posting anything:

```bash
npm run datahub:doctor
```

That command writes [`hackathon-assets/datahub-readiness-doctor.md`](./hackathon-assets/datahub-readiness-doctor.md) and [`hackathon-assets/datahub-readiness-doctor.json`](./hackathon-assets/datahub-readiness-doctor.json), confirming the dry-run evidence is ready, probing the local GMS health endpoint when available, and keeping live DataHub optional for judging.

To generate the DataHub integration checklist:

```bash
npm run datahub:checklist
```

That command writes [`hackathon-assets/datahub-integration-checklist.md`](./hackathon-assets/datahub-integration-checklist.md) and [`hackathon-assets/datahub-integration-checklist.json`](./hackathon-assets/datahub-integration-checklist.json), separating what judges can verify without credentials from the optional local DataHub posting path.

To generate the DataHub claim audit:

```bash
npm run datahub:audit
```

That command writes [`hackathon-assets/datahub-claim-audit.md`](./hackathon-assets/datahub-claim-audit.md) and [`hackathon-assets/datahub-claim-audit.json`](./hackathon-assets/datahub-claim-audit.json), giving judges a compact pass/fail audit of aspect coverage, context reads, local-only posting, safety gates, and bounded receipt writes.

To generate the DataHub MCP handoff:

```bash
npm run datahub:mcp
```

That command writes [`hackathon-assets/datahub-mcp-handoff.md`](./hackathon-assets/datahub-mcp-handoff.md) and [`hackathon-assets/datahub-mcp-handoff.json`](./hackathon-assets/datahub-mcp-handoff.json), showing the exact DataHub/CAT tool calls, sample arguments, local-to-live boundary, policy decisions, and no-external-side-effect receipt write path.

To run the MCP adapter smoke test:

```bash
npm run mcp:smoke
```

That command writes [`hackathon-assets/mcp-adapter-smoke-report.md`](./hackathon-assets/mcp-adapter-smoke-report.md) and [`hackathon-assets/mcp-adapter-smoke-report.json`](./hackathon-assets/mcp-adapter-smoke-report.json), proving the local read-before-write sequence for DataHub entity reads, lineage reads, CAT policy context, and bounded receipt writes.

To generate the request-by-request decision trace:

```bash
npm run decision:trace
```

That command writes [`hackathon-assets/decision-trace.md`](./hackathon-assets/decision-trace.md) and [`hackathon-assets/decision-trace.json`](./hackathon-assets/decision-trace.json), connecting each messy source row to the context reads, decision, safe next step, blocked action, and receipt.

To generate the DataHub lineage-to-decision map:

```bash
npm run lineage:map
```

That command writes [`hackathon-assets/lineage-decision-map.md`](./hackathon-assets/lineage-decision-map.md) and [`hackathon-assets/lineage-decision-map.json`](./hackathon-assets/lineage-decision-map.json), showing the source → DataHub context → agent decision → approval queue → receipt chain as a Mermaid graph plus machine-readable nodes and edges.

To generate the safety policy matrix:

```bash
npm run policy:matrix
```

That command writes [`hackathon-assets/safety-policy-matrix.md`](./hackathon-assets/safety-policy-matrix.md) and [`hackathon-assets/safety-policy-matrix.json`](./hackathon-assets/safety-policy-matrix.json), showing which actions are allowed, approval-required, or blocked based on context quality.

To preview the agent-side context read contract:

```bash
npm run context:read
```

That command writes [`examples/cat-context-agent/generated-mcp-context-read.json`](./examples/cat-context-agent/generated-mcp-context-read.json), a local MCP/DataHub-style read plan showing which context the agent checks before queueing, approval-gating, or blocking work.

To generate the explicit MCP/DataHub tool contract:

```bash
npm run context:contracts
```

That command writes [`hackathon-assets/context-tool-contracts.md`](./hackathon-assets/context-tool-contracts.md) and [`hackathon-assets/context-tool-contracts.json`](./hackathon-assets/context-tool-contracts.json), describing the DataHub reads, CAT context packet read, and guarded receipt write.

To generate the judge evidence pack:

```bash
npm run judge:pack
```

That command writes [`hackathon-assets/judge-evidence-pack.md`](./hackathon-assets/judge-evidence-pack.md) and [`hackathon-assets/judge-evidence-pack.json`](./hackathon-assets/judge-evidence-pack.json), summarizing the reproducible commands, DataHub aspects, MCP-style context reads, safety claims, and decision receipts.

To generate the five-minute judge walkthrough:

```bash
npm run judge:walkthrough
```

That command writes [`hackathon-assets/judge-walkthrough.md`](./hackathon-assets/judge-walkthrough.md) and [`hackathon-assets/judge-walkthrough.json`](./hackathon-assets/judge-walkthrough.json), showing the shortest terminal path, what each command proves, expected outputs, and the safety boundary.

To generate the 2-minute judge card:

```bash
npm run judge:quick
```

That command writes [`hackathon-assets/judge-quick-card.md`](./hackathon-assets/judge-quick-card.md) and [`hackathon-assets/judge-quick-card.json`](./hackathon-assets/judge-quick-card.json), giving judges the fastest links, one proof command, claim snapshot, DataHub evidence, and safety boundary.

To generate the judge rubric matrix:

```bash
npm run judge:rubric
```

That command writes [`hackathon-assets/judge-rubric-matrix.md`](./hackathon-assets/judge-rubric-matrix.md) and [`hackathon-assets/judge-rubric-matrix.json`](./hackathon-assets/judge-rubric-matrix.json), mapping the public DataHub judging criteria to concrete CAT evidence, limitations, and next steps.

To generate the judge FAQ / objection handler:

```bash
npm run judge:faq
```

That command writes [`hackathon-assets/judge-faq.md`](./hackathon-assets/judge-faq.md) and [`hackathon-assets/judge-faq.json`](./hackathon-assets/judge-faq.json), answering the hard reviewer questions about live DataHub, simulation boundaries, workflow value, safety, and fast verification.

To generate the submission honesty audit:

```bash
npm run submission:honesty
```

That command writes [`hackathon-assets/submission-honesty-audit.md`](./hackathon-assets/submission-honesty-audit.md) and [`hackathon-assets/submission-honesty-audit.json`](./hackathon-assets/submission-honesty-audit.json), checking that public copy separates runnable evidence from optional live DataHub work, avoids overclaims, and preserves the safety boundary.

To regenerate and verify the full submission evidence chain:

```bash
npm run submission:verify
```

That command reruns the demo, DataHub bridge plan, MCP-style context read, and judge evidence pack, then writes [`hackathon-assets/submission-readiness-report.md`](./hackathon-assets/submission-readiness-report.md) and [`hackathon-assets/submission-readiness-report.json`](./hackathon-assets/submission-readiness-report.json).

To validate the generated evidence artifacts:

```bash
npm run artifacts:validate
```

That command checks the generated decisions, DataHub aspects, context-read tools, tool contracts, judge pack, and readiness report, then writes [`hackathon-assets/artifact-validation-report.md`](./hackathon-assets/artifact-validation-report.md) and [`hackathon-assets/artifact-validation-report.json`](./hackathon-assets/artifact-validation-report.json).

For the shortest judge verification path:

```bash
npm run evidence:reproduce
```

That command reruns submission verification and artifact validation, then writes a one-command proof receipt at [`hackathon-assets/reproduction-receipt.md`](./hackathon-assets/reproduction-receipt.md) and [`hackathon-assets/reproduction-receipt.json`](./hackathon-assets/reproduction-receipt.json).

To generate the compact judge scoring brief:

```bash
npm run judge:brief
```

That command reruns the one-command proof path and writes a claim-to-evidence map at [`hackathon-assets/judge-scoring-brief.md`](./hackathon-assets/judge-scoring-brief.md) and [`hackathon-assets/judge-scoring-brief.json`](./hackathon-assets/judge-scoring-brief.json).

To generate canonical Devpost submission copy:

```bash
npm run devpost:copy
```

That command writes [`hackathon-assets/devpost-submission-copy.md`](./hackathon-assets/devpost-submission-copy.md) and [`hackathon-assets/devpost-submission-copy.json`](./hackathon-assets/devpost-submission-copy.json), including the final links, project story, built-with list, next steps, and organizer feedback text.

To generate the judge-first submission index:

```bash
npm run submission:index
```

That command writes [`hackathon-assets/submission-index.md`](./hackathon-assets/submission-index.md) and [`hackathon-assets/submission-index.json`](./hackathon-assets/submission-index.json), with the recommended review order, proof commands, canonical links, and claim shortlist.

To generate the video accessibility guide:

```bash
npm run demo:guide
```

That command writes [`hackathon-assets/demo-video-guide.md`](./hackathon-assets/demo-video-guide.md) and [`hackathon-assets/demo-video-guide.json`](./hackathon-assets/demo-video-guide.json), with timestamped companion notes, a transcript summary, and judge takeaways.

A GitHub Actions template for the same checks is available at [`hackathon-assets/github-actions-ci-template.yml`](./hackathon-assets/github-actions-ci-template.yml). It is kept as a template because the current OAuth token cannot publish workflow files without GitHub's `workflow` scope.

To run the local equivalent of that CI recipe:

```bash
npm run ci:local
```

That command checks `npm ci --dry-run`, regenerates the context contracts, DataHub payload preview, live DataHub runbook, DataHub readiness doctor, DataHub integration checklist, DataHub claim audit, DataHub MCP handoff, MCP adapter smoke test, Devpost copy pack, submission honesty audit, decision trace, lineage decision map, safety policy matrix, verifies the submission chain, regenerates the judge walkthrough, judge FAQ, judge quick card, judge rubric matrix, validates artifacts, regenerates the judge scoring brief, regenerates the submission index, regenerates the video guide, and runs the full build/test suite.

## DataHub integration path

The current demo is intentionally runnable without Docker or credentials. It produces DataHub-ready metadata plus the exact local Rest.li `ingestProposal` request bodies, so judges can inspect the context layer before optionally starting DataHub.

Next live DataHub step:

1. Start a local DataHub quickstart.
2. Run `DATAHUB_GMS_URL=http://localhost:8080 npm run datahub:bridge -- --post` to post four Metadata Change Proposal bodies to `/aspects?action=ingestProposal`.
3. Let the agent read `generated-mcp-context-read.json` as the MCP/DataHub-style context contract.
4. Replace the static packet with DataHub MCP / Agent Context Kit reads.
5. Write approval/blocked receipt outcomes back as metadata or workflow artifacts.

The repo also includes a generated live-run checklist at [`hackathon-assets/live-datahub-runbook.md`](./hackathon-assets/live-datahub-runbook.md). It keeps the live mutation step separate from dry-run evidence so judges can verify the exact command before anything is posted.

## Planned stack

- DataHub OSS / Core Platform
- DataHub MCP Server
- DataHub Agent Context Kit
- DataHub Skills
- Python
- Next.js / TypeScript
- PostgreSQL or local sample datasets

## Current status

This repository contains the public submission foundation, Apache 2.0 license, landing page, local demo runner, DataHub-ready metadata artifacts, Rest.li ingestProposal bridge plan, MCP-style context read artifact, and demo-preview video asset. The next milestone is replacing the static context packet with live DataHub MCP / Agent Context Kit reads after the local ingest path is exercised.

## Local development

```bash
npm install
npm run demo
npm run datahub:bridge
npm run datahub:payload
npm run datahub:runbook
npm run datahub:checklist
npm run datahub:audit
npm run datahub:mcp
npm run submission:honesty
npm run decision:trace
npm run policy:matrix
npm run context:read
npm run context:contracts
npm run judge:pack
npm run judge:faq
npm run judge:quick
npm run judge:rubric
npm run submission:verify
npm run artifacts:validate
npm run evidence:reproduce
npm run judge:brief
npm run devpost:copy
npm run submission:index
npm run demo:guide
npm run ci:local
npm run dev
npm run build
```

## License

Apache 2.0. See [LICENSE](./LICENSE).
