# CAT Context Agent — Judge Scoring Brief

Generated: `demo-static-run`  
Evidence status: **reproducible**

Live demo / test URL: [https://cat-context-agent.flyguy.chatgpt.site](https://cat-context-agent.flyguy.chatgpt.site)  
Repository: [https://github.com/mytodd1-dotcom/cat-context-agent](https://github.com/mytodd1-dotcom/cat-context-agent)  
Demo video: [https://youtu.be/Gcbhl5_YlSM](https://youtu.be/Gcbhl5_YlSM)

## Fast read

CAT Context Agent demonstrates context before action: the agent reads DataHub-style schema, ownership, lineage, and policy context before deciding whether work is safe, approval-gated, or blocked.

## Claim-to-evidence map

| Claim | Evidence | Files to inspect |
| --- | --- | --- |
| DataHub is the context layer, not a logo pasted onto the demo. | The demo produces datasetProperties, schemaMetadata, ownership, and glossaryTerms aspects plus a dry-run DataHub bridge plan and an opt-in live DataHub runbook. | `examples/cat-context-agent/generated-datahub-metadata.json`<br>`examples/cat-context-agent/generated-datahub-bridge-plan.json`<br>`hackathon-assets/datahub-payload-preview.md`<br>`hackathon-assets/live-datahub-runbook.md` |
| The agent reads context before it acts. | The MCP-style read plan includes datahub.get_entity, datahub.get_lineage, and cat.get_agent_context_packet before decisions are surfaced. | `examples/cat-context-agent/generated-mcp-context-read.json`<br>`hackathon-assets/context-tool-contracts.md`<br>`hackathon-assets/lineage-decision-map.md`<br>`hackathon-assets/safety-policy-matrix.md` |
| The demo shows real workflow behavior. | Three messy business requests are separated into safe internal task, approval-required, and blocked external outreach outcomes. | `examples/cat-context-agent/messy-business-requests.csv`<br>`examples/cat-context-agent/generated-agent-output.json`<br>`hackathon-assets/decision-trace.md`<br>`hackathon-assets/lineage-decision-map.md`<br>`hackathon-assets/judge-evidence-pack.md` |
| The safety boundary is explicit and inspectable. | The repo preserves blocked actions for unverified outreach and refuses to invent owners, scrape contacts, or act without verified context. | `examples/cat-context-agent/generated-mcp-context-read.json`<br>`hackathon-assets/artifact-validation-report.md`<br>`hackathon-assets/safety-policy-matrix.md` |
| The submission is reproducible. | A one-command reproduction receipt reruns submission verification and artifact validation with all checks passing. | `hackathon-assets/reproduction-receipt.md`<br>`hackathon-assets/submission-readiness-report.md`<br>`hackathon-assets/artifact-validation-report.md` |

## Why this is more than a toy demo

- It models the uncomfortable middle step most agent demos skip: deciding what the data means before taking action.
- It treats missing ownership and missing verified contact as workflow state, not as prompts to hallucinate.
- It emits receipts and regenerated reports, so the judge can audit both the recommendation and the context used to make it.
- It documents the local DataHub post command separately from the dry-run evidence, so mutation is explicit instead of hidden inside tests.
- The current evidence chain is reproducible with 3 requests and 10 artifact validation checks.

## Judge command path

```bash
npm install
npm run judge:brief
npm run ci:local
```
