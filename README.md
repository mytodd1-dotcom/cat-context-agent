# CAT Context Agent

CAT Context Agent is a DataHub Agent Hackathon project shell for a context-aware workflow agent.

The goal is simple: messy business data should become safe, traceable next actions only after an agent understands the data context. DataHub is the planned context layer for schemas, ownership, lineage, and metadata receipts.

## Hackathon target

- Event: Build with DataHub: The Agent Hackathon
- Challenge category: Agents That Do Real Work
- Submission concept: small-business messy data → DataHub context → agent reasoning → approval queue → receipt-backed action plan

## Planned demo flow

1. Ingest a messy sample business dataset.
2. Register/catalog the data context with DataHub.
3. Let an agent query DataHub before recommending actions.
4. Surface missing fields, confidence notes, and unsafe assumptions.
5. Generate an approval queue and a traceable receipt for each recommendation.

## Planned stack

- DataHub OSS / Core Platform
- DataHub MCP Server
- DataHub Agent Context Kit
- DataHub Skills
- Python
- Next.js / TypeScript
- PostgreSQL or local sample datasets

## Current status

This repository currently contains the first public project shell and landing-page draft. The runnable agent workflow, sample datasets, examples, deployment URL, and video demo will be added as the build progresses.

## Local development

```bash
npm install
npm run dev
npm run build
```

## License

Apache 2.0. See [LICENSE](./LICENSE).
