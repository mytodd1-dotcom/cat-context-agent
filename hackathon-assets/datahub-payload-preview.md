# CAT Context Agent — DataHub Payload Preview

Mode: **dry-run**  
Endpoint: `http://localhost:8080/aspects?action=ingestProposal`  
Generated: `demo-static-run`

This is a dry-run preview of the metadata change proposal-style payloads CAT prepares for a local DataHub GMS run.

The live command sends DataHub Rest.li `ingestProposal` action bodies. Dry-run mode writes the exact request shape without contacting GMS.

## Live ingest contract

- Method: `POST`
- Endpoint: `http://localhost:8080/aspects?action=ingestProposal`
- Rest.li protocol: `2.0.0`
- Body shape: `{ proposal: MetadataChangeProposal }`
- Aspect encoding: Each aspect is serialized as aspect.value JSON with contentType application/json.

## Aspect upserts

| Request | Aspect | Purpose |
| --- | --- | --- |
| `cat-datahub-upsert-datasetProperties` | `datasetProperties` | Identify the messy business request dataset and expose CAT decision totals as metadata. |
| `cat-datahub-upsert-schemaMetadata` | `schemaMetadata` | Describe the CSV schema and field confidence before the agent acts. |
| `cat-datahub-upsert-ownership` | `ownership` | Attach a known CAT demo data owner so missing ownership can be detected instead of invented. |
| `cat-datahub-upsert-glossaryTerms` | `glossaryTerms` | Mark policy terms such as context-before-action and no unverified outreach. |

## Local post command

```bash
DATAHUB_GMS_URL=http://localhost:8080 npm run datahub:bridge -- --post
```

## Safety note

The preview does not contact DataHub, use credentials, or mutate external state. Posting is opt-in via the explicit --post bridge command after starting local DataHub.
