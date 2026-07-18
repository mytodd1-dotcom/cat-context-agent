# CAT Context Agent — Artifact Validation Report

Status: **valid**  
Generated: `demo-static-run`

## Validation checks

- ✅ **decision summary** — Agent output should include 3 requests: 1 safe, 1 approval-required, 1 blocked.
- ✅ **DataHub metadata shape** — Generated metadata should include the expected dataset URN and four DataHub aspects.
- ✅ **bridge plan mirrors DataHub aspects** — Bridge plan should remain dry-run and map all expected aspects.
- ✅ **context read tool path** — Context read should include DataHub/CAT read tools and preserve the blocked customer action.
- ✅ **tool contract coverage** — Tool contracts should cover DataHub reads, CAT context read, and guarded receipt write.
- ✅ **live DataHub runbook** — Live runbook should document the opt-in local DataHub post path and preserve the dry-run payload coverage.
- ✅ **DataHub readiness doctor** — Readiness doctor should prove dry-run DataHub artifacts are ready while live GMS remains optional.
- ✅ **DataHub integration checklist** — Integration checklist should separate no-credential judging from optional local DataHub posting.
- ✅ **DataHub claim audit** — DataHub claim audit should pass every DataHub-specific claim check.
- ✅ **DataHub MCP handoff** — DataHub MCP handoff should map read-before-action tools to bounded receipt writes.
- ✅ **MCP adapter smoke test** — MCP adapter smoke test should prove read-before-write ordering and bounded local receipt writes.
- ✅ **submission honesty audit** — Honesty audit should prove public copy separates runnable evidence from optional live DataHub work and avoids overclaims.
- ✅ **judge pack references generated evidence** — Judge pack should point to context contracts and include the blocked-action receipt.
- ✅ **lineage decision map** — Lineage map should show the DataHub asset, context reads, decision loop, and all three decision branches.
- ✅ **safety policy matrix** — Safety policy matrix should define allowed, approval-required, and blocked action boundaries for all three requests.
- ✅ **readiness report** — Readiness report should be ready, all checks passing, and include context tool contracts.
- ✅ **judge walkthrough** — Judge walkthrough should document the shortest proof path and preserve the no-external-side-effects boundary.
- ✅ **judge FAQ** — Judge FAQ should answer the hard reviewer questions with evidence files and verification commands.
- ✅ **judge quick card** — Judge quick card should give reviewers the fastest links, proof command, claim map, and safety boundary.

## Validated files

- `examples/cat-context-agent/generated-agent-output.json`
- `examples/cat-context-agent/generated-datahub-metadata.json`
- `examples/cat-context-agent/generated-datahub-bridge-plan.json`
- `examples/cat-context-agent/generated-mcp-context-read.json`
- `hackathon-assets/context-tool-contracts.json`
- `hackathon-assets/live-datahub-runbook.json`
- `hackathon-assets/datahub-readiness-doctor.json`
- `hackathon-assets/datahub-integration-checklist.json`
- `hackathon-assets/datahub-claim-audit.json`
- `hackathon-assets/datahub-mcp-handoff.json`
- `hackathon-assets/mcp-adapter-smoke-report.json`
- `hackathon-assets/submission-honesty-audit.json`
- `hackathon-assets/lineage-decision-map.json`
- `hackathon-assets/safety-policy-matrix.json`
- `hackathon-assets/judge-evidence-pack.json`
- `hackathon-assets/submission-readiness-report.json`
- `hackathon-assets/judge-walkthrough.json`
- `hackathon-assets/judge-faq.json`
- `hackathon-assets/judge-quick-card.json`
