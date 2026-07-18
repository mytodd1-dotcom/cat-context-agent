# CAT Context Agent

CAT Context Agent is a DataHub Agent Hackathon project for a context-aware workflow agent.

The goal is simple: messy business data should become safe, traceable next actions only after an agent understands the data context. DataHub is the planned context layer for schemas, ownership, lineage, and metadata receipts.

## Hackathon target

- Event: Build with DataHub: The Agent Hackathon
- Challenge category: Agents That Do Real Work
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

That command writes [`examples/cat-context-agent/generated-datahub-bridge-plan.json`](./examples/cat-context-agent/generated-datahub-bridge-plan.json), a dry-run list of DataHub metadata change proposals plus the agent context summary.

To preview the agent-side context read contract:

```bash
npm run context:read
```

That command writes [`examples/cat-context-agent/generated-mcp-context-read.json`](./examples/cat-context-agent/generated-mcp-context-read.json), a local MCP/DataHub-style read plan showing which context the agent checks before queueing, approval-gating, or blocking work.

To generate the judge evidence pack:

```bash
npm run judge:pack
```

That command writes [`hackathon-assets/judge-evidence-pack.md`](./hackathon-assets/judge-evidence-pack.md) and [`hackathon-assets/judge-evidence-pack.json`](./hackathon-assets/judge-evidence-pack.json), summarizing the reproducible commands, DataHub aspects, MCP-style context reads, safety claims, and decision receipts.

## DataHub integration path

The current demo is intentionally runnable without Docker or credentials. It produces DataHub-ready metadata so judges can inspect the context layer before the full live integration is wired.

Next live DataHub step:

1. Start a local DataHub quickstart.
2. Run `DATAHUB_GMS_URL=http://localhost:8080 npm run datahub:bridge -- --post`.
3. Let the agent read `generated-mcp-context-read.json` as the MCP/DataHub-style context contract.
4. Replace the static packet with DataHub MCP / Agent Context Kit reads.
5. Write approval/blocked receipt outcomes back as metadata or workflow artifacts.

## Planned stack

- DataHub OSS / Core Platform
- DataHub MCP Server
- DataHub Agent Context Kit
- DataHub Skills
- Python
- Next.js / TypeScript
- PostgreSQL or local sample datasets

## Current status

This repository contains the public submission foundation, Apache 2.0 license, landing page, local demo runner, DataHub-ready metadata artifacts, dry-run DataHub bridge plan, MCP-style context read artifact, and demo-preview video asset. The next milestone is replacing the static context packet with a local DataHub quickstart run and MCP/Agent Context Kit reads.

## Local development

```bash
npm install
npm run demo
npm run datahub:bridge
npm run context:read
npm run judge:pack
npm run dev
npm run build
```

## License

Apache 2.0. See [LICENSE](./LICENSE).
