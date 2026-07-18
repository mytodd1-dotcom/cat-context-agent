# CAT Context Agent — DataHub Payload Preview

Mode: **dry-run**  
Endpoint: `http://localhost:8080/openapi/entities/v1/`  
Generated: `demo-static-run`

This is a dry-run preview of the metadata change proposal-style payloads CAT prepares for a local DataHub GMS run.

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
