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

The landing page renders the same slice as a visual workflow: messy CSV → DataHub context read → approval queue → receipt JSON.

Run it locally:

```bash
npm run demo
```

The command reads the sample CSV and context map, applies the current safety rules, and writes [`examples/cat-context-agent/generated-agent-output.json`](./examples/cat-context-agent/generated-agent-output.json).

## Planned stack

- DataHub OSS / Core Platform
- DataHub MCP Server
- DataHub Agent Context Kit
- DataHub Skills
- Python
- Next.js / TypeScript
- PostgreSQL or local sample datasets

## Current status

This repository contains the public submission foundation, Apache 2.0 license, landing page, static demo artifacts, and demo-preview video asset. The next milestone is replacing the static context map with a local DataHub quickstart run and MCP/Agent Context Kit reads.

## Local development

```bash
npm install
npm run demo
npm run dev
npm run build
```

## License

Apache 2.0. See [LICENSE](./LICENSE).
