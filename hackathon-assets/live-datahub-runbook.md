# CAT Context Agent — Live DataHub Runbook

Generated: `demo-static-run`  
Status: **ready_for_local_datahub**

This runbook turns the dry-run CAT demo into a local DataHub verification path. The repository stays runnable without Docker or credentials, while the live post step remains explicit and opt-in.

## Goal

Post CAT's generated datasetProperties, schemaMetadata, ownership, and glossaryTerms aspects to a local DataHub GMS through the Rest.li ingestProposal action, then use the same context to justify safe, approval-gated, and blocked agent actions.

## Prerequisites

- Node 22+ dependencies installed with npm install or npm ci.
- A local DataHub GMS instance reachable at DATAHUB_GMS_URL, usually http://localhost:8080.
- No cloud credentials are required for the repo evidence path.
- Live posting is intentionally blocked unless the operator passes --post.

## Live ingest contract

- Method: `POST`
- Endpoint: `http://localhost:8080/aspects?action=ingestProposal`
- Action: `ingestProposal`
- Rest.li protocol: `2.0.0`
- Aspect encoding: Each aspect is serialized as aspect.value JSON with contentType application/json.

## Commands

### Regenerate the local CAT decision artifacts

```bash
npm run demo
```

Expected: generated-agent-output.json, generated-datahub-metadata.json, and generated-agent-context-packet.json are updated.

### Preview the DataHub metadata payloads

```bash
npm run datahub:payload
```

Expected: hackathon-assets/datahub-payload-preview.md lists four DataHub Rest.li ingestProposal bodies without contacting GMS.

### Post to local DataHub only after GMS is running

```bash
DATAHUB_GMS_URL=http://localhost:8080 npm run datahub:bridge -- --post
```

Expected: The bridge posts four UPSERT MetadataChangeProposal bodies to /aspects?action=ingestProposal and leaves generated-datahub-bridge-plan.json as a receipt.

### Read context before agent action

```bash
npm run context:read -- --request-id REQ-1042
```

Expected: generated-mcp-context-read.json shows datahub.get_entity, datahub.get_lineage, and cat.get_agent_context_packet before the approval decision.

### Reproduce the judge evidence chain

```bash
npm run evidence:reproduce
```

Expected: The reproduction receipt confirms payload preview, live runbook, decision trace, readiness, validation, and safety checks.

## Acceptance checks

- ✅ **aspect coverage** — 4 DataHub Rest.li ingestProposal payloads are prepared: datasetProperties, schemaMetadata, ownership, glossaryTerms.
- ✅ **local-first verification** — Judges can inspect every generated artifact without external credentials or a hosted service.
- ✅ **live mutation is explicit** — Only the documented DATAHUB_GMS_URL + --post command mutates a local DataHub instance.
- ✅ **agent safety remains preserved** — The blocked external outreach case remains blocked even after the DataHub post path is enabled.

## Explicit safety boundary

- Do not post to a remote or production DataHub instance from the demo unless the operator intentionally changes DATAHUB_GMS_URL.
- Do not add secrets, tokens, or customer data to the generated artifacts.
- Do not let the agent send external outreach when contact ownership or approval context is missing.
- Treat failed DataHub posting as a setup issue, not permission to bypass context reads.

## Fallback if DataHub is not running

If local DataHub is not available during judging, use npm run datahub:payload plus npm run decision:trace. Those commands prove the same aspect payloads and read-before-action decisions in dry-run mode.
