# CAT Context Agent — DataHub Live Roundtrip Harness

Generated: `demo-static-run`  
Status: **ready_for_local_roundtrip**  
Mode: `dry-run`  
Local GMS URL: `http://localhost:8080`

This harness is the bridge between the dry-run submission and a real local DataHub verification loop. By default it does **not** post metadata. With a local DataHub GMS running, the operator can add `--post` to write the same Metadata Change Proposal bodies and verify readback from Rest.li.

## Safety boundary

- Mutations performed: `false`
- Local-only GMS required for mutation: `true`
- Remote/production DataHub posting allowed: `false`
- Secrets required for dry-run: `false`

No metadata was posted in this run.

## Write path

- Endpoint: `http://localhost:8080/aspects?action=ingestProposal`
- Action: `ingestProposal`
- Rest.li protocol: `2.0.0`
- Aspects: `datasetProperties`, `schemaMetadata`, `ownership`, `glossaryTerms`

## Readback path

- Entity readback: `http://localhost:8080/entitiesV2/urn%3Ali%3Adataset%3A(cat%2Cmessy_business_requests%2CPROD)?aspects=List(datasetProperties,schemaMetadata,ownership,glossaryTerms)`

- `datasetProperties`: `http://localhost:8080/aspects/urn%3Ali%3Adataset%3A(cat%2Cmessy_business_requests%2CPROD)?aspect=datasetProperties&version=0`
- `schemaMetadata`: `http://localhost:8080/aspects/urn%3Ali%3Adataset%3A(cat%2Cmessy_business_requests%2CPROD)?aspect=schemaMetadata&version=0`
- `ownership`: `http://localhost:8080/aspects/urn%3Ali%3Adataset%3A(cat%2Cmessy_business_requests%2CPROD)?aspect=ownership&version=0`
- `glossaryTerms`: `http://localhost:8080/aspects/urn%3Ali%3Adataset%3A(cat%2Cmessy_business_requests%2CPROD)?aspect=glossaryTerms&version=0`

## Checks

- ✅ **roundtrip payload coverage** — The same four DataHub aspects are available for dry-run, post, and readback verification.
- ✅ **write path is explicit** — The write path is DataHub Rest.li ingestProposal, not a hidden side effect.
- ✅ **readback path is explicit** — The readback path points to DataHub entitiesV2 plus per-aspect latest-version reads.
- ✅ **mutation guard is local-only** — Dry-run mode performs no mutation and still documents the local-only mutation gate.
- ✅ **agent decision boundary preserved** — The local DataHub path does not weaken CAT's safe, approval-required, and blocked decisions.
- ✅ **dry-run has no external side effects** — No metadata was posted and no local GMS readback was attempted without --post or --readback.

## Optional live command

```bash
DATAHUB_GMS_URL=http://localhost:8080 npm run datahub:roundtrip -- --post
```
