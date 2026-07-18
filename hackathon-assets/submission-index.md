# CAT Context Agent — Submission Index

A judge-first index for verifying the DataHub Agent Hackathon submission without guessing where to start.

## Canonical links

- Live demo: [https://cat-context-agent.flyguy.chatgpt.site](https://cat-context-agent.flyguy.chatgpt.site)
- Repository: [https://github.com/mytodd1-dotcom/cat-context-agent](https://github.com/mytodd1-dotcom/cat-context-agent)
- Demo video: [https://youtu.be/Gcbhl5_YlSM](https://youtu.be/Gcbhl5_YlSM)
- Devpost copy pack: `hackathon-assets/devpost-submission-copy.md`

## Suggested judge review order

| Step | Open this | Why it matters |
| --- | --- | --- |
| 1. Watch the demo video | [https://youtu.be/Gcbhl5_YlSM](https://youtu.be/Gcbhl5_YlSM) | Fastest visual pass through the CAT Context Agent story. |
| 2. Open the live demo | [https://cat-context-agent.flyguy.chatgpt.site](https://cat-context-agent.flyguy.chatgpt.site) | Shows the workflow, evidence cards, approval queue, and receipt pattern. |
| 3. Read the 2-minute judge card | `hackathon-assets/judge-quick-card.md`<br><code>npm run judge:quick</code> | Gives the fastest links, one proof command, claim map, DataHub evidence, and safety boundary. |
| 4. Read the judge scoring brief | `hackathon-assets/judge-scoring-brief.md` | Maps the main claims to concrete repo evidence. |
| 5. Follow the terminal walkthrough | `hackathon-assets/judge-walkthrough.md`<br><code>npm run judge:walkthrough</code> | Shows the shortest command path, expected outputs, inspectable files, and safety boundary. |
| 6. Read the judge FAQ | `hackathon-assets/judge-faq.md`<br><code>npm run judge:faq</code> | Answers the hard reviewer questions about DataHub use, simulation boundaries, safety, and verification. |
| 7. Run the one-command proof | `hackathon-assets/reproduction-receipt.md`<br><code>npm run evidence:reproduce</code> | Regenerates the evidence chain and receipt from local source. |
| 8. Inspect DataHub context artifacts | `examples/cat-context-agent/generated-datahub-bridge-plan.json` | Shows the datasetProperties, schemaMetadata, ownership, and glossaryTerms handoff. |
| 9. Inspect the MCP-style read contract | `examples/cat-context-agent/generated-mcp-context-read.json` | Shows the agent reading entity, lineage, and CAT context before action. |
| 10. Run the DataHub readiness doctor | `hackathon-assets/datahub-readiness-doctor.md`<br><code>npm run datahub:doctor</code> | Checks generated DataHub artifacts and optional local GMS reachability without posting metadata. |
| 11. Inspect the DataHub integration checklist | `hackathon-assets/datahub-integration-checklist.md`<br><code>npm run datahub:checklist</code> | Shows what is judgeable now, what requires local DataHub, and what is intentionally out of scope. |
| 12. Inspect the DataHub claim audit | `hackathon-assets/datahub-claim-audit.md`<br><code>npm run datahub:audit</code> | Gives a compact pass/fail audit of the submission's DataHub-specific claims. |
| 13. Inspect the DataHub MCP handoff | `hackathon-assets/datahub-mcp-handoff.md`<br><code>npm run datahub:mcp</code> | Shows how DataHub reads, CAT policy context, and bounded receipt writes connect in the live path. |
| 14. Run the MCP adapter smoke test | `hackathon-assets/mcp-adapter-smoke-report.md`<br><code>npm run mcp:smoke</code> | Proves the local adapter reads DataHub/CAT context before writing bounded receipts. |
| 15. Inspect the submission honesty audit | `hackathon-assets/submission-honesty-audit.md`<br><code>npm run submission:honesty</code> | Checks that public copy does not overclaim live DataHub, credentials, or external automation. |
| 16. Inspect the lineage decision map | `hackathon-assets/lineage-decision-map.md`<br><code>npm run lineage:map</code> | Shows the source, DataHub context reads, decision branches, approval queue, and receipt path in one graph. |
| 17. Inspect the safety policy matrix | `hackathon-assets/safety-policy-matrix.md`<br><code>npm run policy:matrix</code> | Shows which agent actions are allowed, approval-required, or blocked based on context quality. |

## Proof commands

```bash
npm install
npm run demo
npm run submission:verify
npm run judge:walkthrough
npm run judge:faq
npm run judge:quick
npm run datahub:doctor
npm run datahub:checklist
npm run datahub:audit
npm run datahub:mcp
npm run mcp:smoke
npm run submission:honesty
npm run lineage:map
npm run policy:matrix
npm run evidence:reproduce
npm run judge:brief
npm run devpost:copy
npm run ci:local
```

## Claim shortlist

### DataHub is the context layer.

- `examples/cat-context-agent/generated-datahub-metadata.json`
- `examples/cat-context-agent/generated-datahub-bridge-plan.json`
- `hackathon-assets/datahub-payload-preview.md`
- `hackathon-assets/datahub-readiness-doctor.md`
- `hackathon-assets/datahub-integration-checklist.md`
- `hackathon-assets/datahub-claim-audit.md`
- `hackathon-assets/datahub-mcp-handoff.md`
- `hackathon-assets/mcp-adapter-smoke-report.md`

### The agent reads context before action.

- `examples/cat-context-agent/generated-mcp-context-read.json`
- `hackathon-assets/datahub-mcp-handoff.md`
- `hackathon-assets/mcp-adapter-smoke-report.md`
- `hackathon-assets/context-tool-contracts.md`
- `hackathon-assets/submission-honesty-audit.md`
- `hackathon-assets/lineage-decision-map.md`
- `hackathon-assets/safety-policy-matrix.md`

### Unsafe work is approval-gated or blocked.

- `examples/cat-context-agent/generated-agent-output.json`
- `hackathon-assets/decision-trace.md`
- `hackathon-assets/lineage-decision-map.md`
- `hackathon-assets/safety-policy-matrix.md`
- `hackathon-assets/judge-evidence-pack.md`

### The submission is reproducible.

- `hackathon-assets/judge-walkthrough.md`
- `hackathon-assets/judge-faq.md`
- `hackathon-assets/judge-quick-card.md`
- `hackathon-assets/submission-honesty-audit.md`
- `hackathon-assets/reproduction-receipt.md`
- `hackathon-assets/submission-readiness-report.md`
- `hackathon-assets/artifact-validation-report.md`
