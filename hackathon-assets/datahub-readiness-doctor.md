# CAT Context Agent — DataHub Readiness Doctor

Generated: `demo-static-run`  
Status: **ready_without_live_datahub**  
Local GMS URL: `http://localhost:8080`

This doctor checks whether the optional local DataHub path is ready without posting any metadata. A failed or unavailable local GMS is not a submission failure; live DataHub remains an opt-in verification step.

## Probe result

- Endpoint: `http://localhost:8080/health`
- Reachable: `false`
- Required for judging: `false`
- Note: Local DataHub is not reachable from this environment; this is acceptable because the submission is judgeable from dry-run artifacts.

## Checks

- ✅ **demo artifacts regenerated** — The local CAT decision runner still produces one safe, one approval-required, and one blocked outcome.
- ✅ **dry-run DataHub proposals ready** — The bridge has four DataHub metadata proposals and did not post because --post was not supplied.
- ✅ **payload preview matches bridge** — The judge-readable payload preview matches the bridge proposal set.
- ✅ **local DataHub remains optional** — No local GMS is reachable here, and the checklist correctly keeps live DataHub optional.
- ✅ **live mutation is guarded** — The only metadata mutation path is the explicit DATAHUB_GMS_URL + --post command.
- ✅ **no secrets or remote GMS required** — The runnable judging path requires no secrets and keeps remote/production DataHub posting out of scope.

## Safe next command

```bash
npm run evidence:reproduce
```

## Optional live command

```bash
DATAHUB_GMS_URL=http://localhost:8080 npm run datahub:bridge -- --post
```

## Evidence files

- `hackathon-assets/datahub-readiness-doctor.md`
- `hackathon-assets/datahub-payload-preview.md`
- `hackathon-assets/live-datahub-runbook.md`
- `hackathon-assets/datahub-integration-checklist.md`
- `examples/cat-context-agent/generated-datahub-bridge-plan.json`
- `examples/cat-context-agent/generated-mcp-context-read.json`
