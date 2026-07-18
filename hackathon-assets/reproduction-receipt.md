# CAT Context Agent — Reproduction Receipt

Status: **reproducible**  
Generated: `demo-static-run`

## One-command proof

```bash
npm run evidence:reproduce
```

## Checks reproduced

- ✅ **DataHub payload preview** — 4 dry-run aspect payloads prepared for local GMS posting.
- ✅ **DataHub readiness doctor** — 6 checks confirm dry-run DataHub readiness and keep local GMS optional.
- ✅ **DataHub live roundtrip harness** — 6 checks prepare a local ingestProposal write plus entitiesV2 readback loop without posting in dry-run mode.
- ✅ **DataHub integration checklist** — 5 verification phases separate runnable evidence from optional local DataHub posting.
- ✅ **DataHub claim audit** — 5 DataHub-specific claims passed aspect, context-read, local-posting, safety, and receipt checks.
- ✅ **DataHub MCP handoff** — 4 tool calls connect DataHub reads, CAT policy context, and bounded receipt writes.
- ✅ **MCP adapter smoke test** — 3 local adapter flows proved read-before-write ordering and bounded receipt writes.
- ✅ **submission honesty audit** — 5 honesty checks passed for public copy, optional DataHub posting, safety boundaries, and no-overclaim language.
- ✅ **decision trace** — 3 request-level traces connect source rows, context reads, decisions, and receipts.
- ✅ **lineage decision map** — 9 nodes and 11 edges show source → DataHub context → decisions → receipts.
- ✅ **safety policy matrix** — 6 rules and 3 request outcomes define allowed, approval-required, and blocked action boundaries.
- ✅ **live DataHub runbook** — 5 operator commands document the opt-in local DataHub post and verification path.
- ✅ **submission readiness** — 14 readiness checks passed.
- ✅ **judge walkthrough** — 5 judge walkthrough steps document the shortest terminal proof path.
- ✅ **judge FAQ** — 5 hard judge questions answered with evidence files and verification commands.
- ✅ **judge quick card** — 2-minute scoring card links the live demo, video, one-command proof, DataHub evidence, and safety boundary.
- ✅ **judge rubric matrix** — 6 official judging criteria are mapped to CAT evidence, limitations, and next steps.
- ✅ **artifact validation** — 21 generated-artifact checks passed.
- ✅ **safety boundary** — Blocked action remains preserved for unverified external outreach.
- ✅ **judge evidence** — Judge notes, evidence pack, context contracts, readiness report, and validation report are regenerated.

## Summary

- Requests evaluated: 3
- Safe internal tasks: 1
- Approval-required tasks: 1
- Blocked tasks: 1
- DataHub aspects: `datasetProperties`, `schemaMetadata`, `ownership`, `glossaryTerms`
- Live DataHub runbook commands: 5
- MCP-style reads: `datahub.get_entity`, `datahub.get_lineage`, `cat.get_agent_context_packet`
- Artifact validation checks: 21

## Reports regenerated

- `hackathon-assets/judge-evidence-pack.md`
- `hackathon-assets/datahub-readiness-doctor.md`
- `hackathon-assets/datahub-live-roundtrip.md`
- `hackathon-assets/datahub-integration-checklist.md`
- `hackathon-assets/datahub-claim-audit.md`
- `hackathon-assets/datahub-mcp-handoff.md`
- `hackathon-assets/mcp-adapter-smoke-report.md`
- `hackathon-assets/submission-honesty-audit.md`
- `hackathon-assets/datahub-payload-preview.md`
- `hackathon-assets/live-datahub-runbook.md`
- `hackathon-assets/decision-trace.md`
- `hackathon-assets/lineage-decision-map.md`
- `hackathon-assets/safety-policy-matrix.md`
- `hackathon-assets/submission-readiness-report.md`
- `hackathon-assets/judge-walkthrough.md`
- `hackathon-assets/judge-faq.md`
- `hackathon-assets/judge-quick-card.md`
- `hackathon-assets/judge-rubric-matrix.md`
- `hackathon-assets/artifact-validation-report.md`
- `hackathon-assets/reproduction-receipt.md`
