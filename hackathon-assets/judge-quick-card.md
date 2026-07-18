# CAT Context Agent — 2-Minute Judge Card

Generated: `demo-static-run`  
Status: **ready**  
Suggested review time: **2 minutes**

This is the shortest possible scoring card for judges who want the live links, one proof command, claim map, and safety boundary without reading every artifact first.

## Open first

### 1. Live demo

[https://cat-context-agent.flyguy.chatgpt.site](https://cat-context-agent.flyguy.chatgpt.site)

Why: Fastest visual scan of the messy data, context read, approval queue, and receipt-backed action plan.

### 2. Demo video

[https://youtu.be/Gcbhl5_YlSM](https://youtu.be/Gcbhl5_YlSM)

Why: Two-minute narrated walkthrough of the context-before-action loop.

### 3. Scoring brief

`hackathon-assets/judge-scoring-brief.md`

Why: Maps each major judging claim to concrete files.

### 4. One-command reproduction receipt

`hackathon-assets/reproduction-receipt.md`

Why: Shows the generated proof chain and the command that regenerates it.

## Fastest proof

```bash
npm run evidence:reproduce
```

Full validation:

```bash
npm run ci:local
```

## Claim snapshot

| Claim | What proves it | Files |
| --- | --- | --- |
| DataHub is the context layer. | The demo prepares dataset identity, schema, ownership, glossary, and lineage context before agent decisions. | `examples/cat-context-agent/generated-datahub-metadata.json`<br>`hackathon-assets/datahub-payload-preview.md`<br>`hackathon-assets/datahub-mcp-handoff.md` |
| The agent does real workflow work. | Three messy requests become one safe internal task, one approval-required task, and one blocked external outreach attempt. | `examples/cat-context-agent/generated-agent-output.json`<br>`hackathon-assets/decision-trace.md`<br>`hackathon-assets/lineage-decision-map.md` |
| Unsafe automation is constrained. | Missing owners, unclear contacts, and external outreach are approval-gated or blocked before action. | `hackathon-assets/safety-policy-matrix.md`<br>`hackathon-assets/submission-honesty-audit.md`<br>`hackathon-assets/judge-faq.md` |
| The submission is reproducible. | The local proof chain regenerates artifacts, validates them, and builds/tests the page. | `hackathon-assets/reproduction-receipt.md`<br>`hackathon-assets/artifact-validation-report.md`<br>`hackathon-assets/judge-walkthrough.md` |

## DataHub evidence

- Aspects prepared: `datasetProperties`, `schemaMetadata`, `ownership`, `glossaryTerms`
- MCP-style reads: `datahub.get_entity`, `datahub.get_lineage`, `cat.get_agent_context_packet`
- Local DataHub required for judging: `false`
- DataHub doctor status: `ready_without_live_datahub`

## Safety boundary

- External side effects: `none`
- Blocked actions: `send_external_outreach_without_verified_contact`, `invent_missing_owner`, `scrape_contact_details`
- No secrets required: `false`
- Public copy honesty status: `passed`

## What is real now

- Public live demo and public GitHub repository are available.
- Local scripts generate DataHub-ready dry-run metadata, Rest.li ingestProposal bodies, and MCP-style context reads.
- The agent decision output, approval queue, safety policy matrix, and receipts are inspectable files.
- The evidence chain is runnable without DataHub credentials, Docker, customer data, or off-platform actions.

## What remains optional / next

- Run the optional local DataHub GMS Rest.li ingestProposal path from the runbook when judges want live local metadata mutation.
- Replace the static context packet with live DataHub MCP / Agent Context Kit reads.
- Write approved workflow receipt outcomes back as DataHub-linked auditable metadata.
