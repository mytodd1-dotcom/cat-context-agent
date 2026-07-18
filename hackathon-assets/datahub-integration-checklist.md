# CAT Context Agent — DataHub Integration Checklist

Generated: `demo-static-run`  
Protocol: `cat-datahub-integration-checklist-v0`  
Live DataHub required to judge current submission: **no**

This checklist separates the runnable submission from the optional local DataHub verification path. It is meant to prevent judges from guessing which parts are already proven, which parts require a local GMS, and which parts are intentionally blocked until the context boundary is stronger.

## Decision gates

| Gate | Value |
| --- | --- |
| Can submit now | `true` |
| Requires secrets | `false` |
| Use remote/production GMS | `false` |
| Live DataHub required for judging | `false` |

## Verification phases

| Phase | Mode | Command | Acceptance |
| --- | --- | --- | --- |
| Reproduce the no-credential proof | `runnable_now` | `npm run evidence:reproduce` | Reproduction receipt is marked reproducible and includes generated DataHub, policy, and validation artifacts. |
| Inspect the DataHub aspect payloads | `runnable_now` | `npm run datahub:payload` | 4 dry-run aspect payloads are produced without contacting GMS. |
| Confirm context tool boundaries | `runnable_now` | `npm run context:contracts` | 4 read/write contracts document the DataHub reads and guarded CAT receipt write. |
| Confirm safe action policy | `runnable_now` | `npm run policy:matrix` | 6 policy rules preserve allowed, approval-required, and blocked action classes. |
| Post to local DataHub GMS | `optional_local_datahub` | `DATAHUB_GMS_URL=http://localhost:8080 npm run datahub:bridge -- --post` | Only a local GMS receives the four UPSERT proposals; dry-run evidence remains the fallback if GMS is unavailable. |

## Integration boundaries

- Do not require judges to run Docker or provide credentials to validate the core submission.
- When judges do run local DataHub, use the Rest.li ingestProposal endpoint: http://localhost:8080/aspects?action=ingestProposal.
- Do not post to a remote or production DataHub instance from the demo.
- Do not include customer secrets, access tokens, or real contact data in generated artifacts.
- Do not replace approval gates with external outreach automation when owner or contact context is missing.
- Treat DataHub posting as verification of context artifacts, not as permission for unsafe workflow writes.

## Evidence files

- `hackathon-assets/reproduction-receipt.md`
- `hackathon-assets/datahub-payload-preview.md`
- `hackathon-assets/live-datahub-runbook.md`
- `hackathon-assets/datahub-payload-preview.json`
- `hackathon-assets/context-tool-contracts.md`
- `hackathon-assets/safety-policy-matrix.md`
- `examples/cat-context-agent/generated-datahub-bridge-plan.json`
- `examples/cat-context-agent/generated-mcp-context-read.json`
