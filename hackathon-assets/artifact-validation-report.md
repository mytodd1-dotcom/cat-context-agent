# CAT Context Agent — Artifact Validation Report

Status: **valid**  
Generated: `demo-static-run`

## Validation checks

- ✅ **decision summary** — Agent output should include 3 requests: 1 safe, 1 approval-required, 1 blocked.
- ✅ **DataHub metadata shape** — Generated metadata should include the expected dataset URN and four DataHub aspects.
- ✅ **bridge plan mirrors DataHub aspects** — Bridge plan should remain dry-run and map all expected aspects.
- ✅ **context read tool path** — Context read should include DataHub/CAT read tools and preserve the blocked customer action.
- ✅ **tool contract coverage** — Tool contracts should cover DataHub reads, CAT context read, and guarded receipt write.
- ✅ **judge pack references generated evidence** — Judge pack should point to context contracts and include the blocked-action receipt.
- ✅ **readiness report** — Readiness report should be ready, all checks passing, and include context tool contracts.

## Validated files

- `examples/cat-context-agent/generated-agent-output.json`
- `examples/cat-context-agent/generated-datahub-metadata.json`
- `examples/cat-context-agent/generated-datahub-bridge-plan.json`
- `examples/cat-context-agent/generated-mcp-context-read.json`
- `hackathon-assets/context-tool-contracts.json`
- `hackathon-assets/judge-evidence-pack.json`
- `hackathon-assets/submission-readiness-report.json`
