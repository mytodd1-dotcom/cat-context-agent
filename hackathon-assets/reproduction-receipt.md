# CAT Context Agent — Reproduction Receipt

Status: **reproducible**  
Generated: `demo-static-run`

## One-command proof

```bash
npm run evidence:reproduce
```

## Checks reproduced

- ✅ **DataHub payload preview** — 4 dry-run aspect payloads prepared for local GMS posting.
- ✅ **decision trace** — 3 request-level traces connect source rows, context reads, decisions, and receipts.
- ✅ **submission readiness** — 6 readiness checks passed.
- ✅ **artifact validation** — 7 generated-artifact checks passed.
- ✅ **safety boundary** — Blocked action remains preserved for unverified external outreach.
- ✅ **judge evidence** — Judge notes, evidence pack, context contracts, readiness report, and validation report are regenerated.

## Summary

- Requests evaluated: 3
- Safe internal tasks: 1
- Approval-required tasks: 1
- Blocked tasks: 1
- DataHub aspects: `datasetProperties`, `schemaMetadata`, `ownership`, `glossaryTerms`
- MCP-style reads: `datahub.get_entity`, `datahub.get_lineage`, `cat.get_agent_context_packet`
- Artifact validation checks: 7

## Reports regenerated

- `hackathon-assets/judge-evidence-pack.md`
- `hackathon-assets/datahub-payload-preview.md`
- `hackathon-assets/decision-trace.md`
- `hackathon-assets/submission-readiness-report.md`
- `hackathon-assets/artifact-validation-report.md`
- `hackathon-assets/reproduction-receipt.md`
