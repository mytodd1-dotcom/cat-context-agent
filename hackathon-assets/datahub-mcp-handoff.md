# CAT Context Agent — DataHub MCP Handoff

Generated: `demo-static-run`  
Status: **ready_for_mcp_adapter**

This artifact shows the intended handoff between DataHub context, MCP-style reads, CAT's action policy, and bounded receipt writes.

## Handoff flow

1. **CSV becomes a cataloged asset** — The messy business request sample is anchored to a DataHub dataset URN.
1. **MetadataChangeProposal payloads are prepared** — datasetProperties, schemaMetadata, ownership, and glossaryTerms are generated in dry-run mode.
1. **Local DataHub posting is opt-in** — The same payloads can be posted only to a local GMS with the explicit --post command.
1. **MCP-style context reads happen before action** — The agent reads entity, lineage, and CAT context packet data before surfacing decisions.
1. **Policy gates decide what is safe** — Known owner/contact context permits internal queueing; missing contact context blocks external outreach.
1. **Receipt write is bounded** — CAT writes a receipt with no external side effects instead of performing outreach.

## Tool calls

| Tool | Purpose | Sample arguments | Safety boundary |
| --- | --- | --- | --- |
| `datahub.get_entity` | Fetch the DataHub dataset identity and metadata aspects before the agent reasons about work. | `{"urn":"urn:li:dataset:(cat,messy_business_requests,PROD)"}` | read-only; no external side effects |
| `datahub.get_lineage` | Confirm the source-to-agent path so receipts cite the right upstream asset. | `{"urn":"urn:li:dataset:(cat,messy_business_requests,PROD)","direction":"downstream"}` | read-only; no external side effects |
| `cat.get_agent_context_packet` | Transform DataHub-derived context into CAT's action-safety contract. | `{"asset":"urn:li:dataset:(cat,messy_business_requests,PROD)","request_id":"all"}` | read-only; no external side effects |
| `cat.write_receipt` | Persist the safe, approval-required, or blocked outcome after context has been read. | `{"source_asset":"urn:li:dataset:(cat,messy_business_requests,PROD)","receipt_ids":["cat-demo-REQ-1042","cat-demo-REQ-1043","cat-demo-REQ-1044"]}` | none |

## Request outcomes from context

| Request | Decision | Required context | Receipt side effect |
| --- | --- | --- | --- |
| REQ-1042 | `needs_approval` | `schema`, `owner`, `contact`, `lineage`, `policy` | local receipt only; no external outreach or payment action |
| REQ-1043 | `safe_to_queue_internal_task` | `schema`, `owner`, `contact`, `lineage`, `policy` | local receipt only; no external outreach or payment action |
| REQ-1044 | `blocked` | `schema`, `owner`, `contact`, `lineage`, `policy` | local receipt only; no external outreach or payment action |

## Local-to-live boundary

- Current mode: `local-dry-run`
- Local post command: `DATAHUB_GMS_URL=http://localhost:8080 npm run datahub:bridge -- --post`
- Remote/production posting: **blocked unless the operator intentionally changes DATAHUB_GMS_URL**
- Secrets required for judging: **no**
- External side effects in this handoff: **none in dry-run evidence; optional local DataHub metadata write only**
