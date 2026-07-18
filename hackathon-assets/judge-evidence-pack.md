# CAT Context Agent — Judge Evidence Pack

Repo: [https://github.com/mytodd1-dotcom/cat-context-agent](https://github.com/mytodd1-dotcom/cat-context-agent)  
Live demo / test URL: [https://cat-context-agent.flyguy.chatgpt.site](https://cat-context-agent.flyguy.chatgpt.site)  
Demo video: [https://youtu.be/Gcbhl5_YlSM](https://youtu.be/Gcbhl5_YlSM)  
Challenge: Build with DataHub: The Agent Hackathon / Agents That Do Real Work

## What this proves

CAT Context Agent turns messy business requests into safe, traceable workflow decisions by reading DataHub-style context before action.

- Source asset: `urn:li:dataset:(cat,messy_business_requests,PROD)`
- DataHub entity: `urn:li:dataset:(cat,messy_business_requests,PROD)`
- Requests evaluated: 3
- Decisions: `{"needs_approval":1,"safe_to_queue_internal_task":1,"blocked":1}`
- DataHub aspects prepared: `datasetProperties`, `schemaMetadata`, `ownership`, `glossaryTerms`
- MCP-style reads simulated: `datahub.get_entity`, `datahub.get_lineage`, `cat.get_agent_context_packet`
- Low-confidence fields surfaced: `contact_email`, `owner`

## Safety claims

- The agent reads schema, ownership, lineage, and policy context before recommending action.
- Internal tasks can be queued when owner/contact context is sufficient.
- External outreach is approval-gated or blocked when owner/contact context is missing.
- Every recommendation emits a receipt with source asset, checked context, confidence, and blocked action.

## Decision receipts

| Request | Decision | Safe next step | Blocked action |
| --- | --- | --- | --- |
| REQ-1042 | needs_approval | Ask for missing customer contact owner before follow-up | Do not send external follow-up |
| REQ-1043 | safe_to_queue_internal_task | Create finance review task for invoice mismatch | — |
| REQ-1044 | blocked | Request a verified contact before customer action | Do not guess, scrape, or invent contact details |

## Reproduce locally

```bash
npm install
npm run demo
npm run datahub:bridge
npm run datahub:payload
npm run datahub:runbook
npm run datahub:doctor
npm run datahub:checklist
npm run datahub:audit
npm run datahub:mcp
npm run mcp:smoke
npm run context:read
npm run lineage:map
npm run policy:matrix
npm run judge:pack
npm test
```

## Files worth inspecting

- `examples/cat-context-agent/messy-business-requests.csv`
- `examples/cat-context-agent/generated-agent-output.json`
- `examples/cat-context-agent/generated-datahub-metadata.json`
- `examples/cat-context-agent/generated-datahub-bridge-plan.json`
- `hackathon-assets/datahub-payload-preview.md`
- `hackathon-assets/live-datahub-runbook.md`
- `hackathon-assets/datahub-readiness-doctor.md`
- `hackathon-assets/datahub-integration-checklist.md`
- `hackathon-assets/datahub-claim-audit.md`
- `hackathon-assets/datahub-mcp-handoff.md`
- `hackathon-assets/mcp-adapter-smoke-report.md`
- `examples/cat-context-agent/generated-mcp-context-read.json`
- `hackathon-assets/decision-trace.md`
- `hackathon-assets/lineage-decision-map.md`
- `hackathon-assets/safety-policy-matrix.md`
- `hackathon-assets/context-tool-contracts.md`
- `hackathon-assets/artifact-validation-report.md`
- `hackathon-assets/reproduction-receipt.md`
- `hackathon-assets/judge-scoring-brief.md`
- `hackathon-assets/cat-context-agent-demo-preview.mp4`
