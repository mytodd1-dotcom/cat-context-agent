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
| 3. Read the judge scoring brief | `hackathon-assets/judge-scoring-brief.md` | Maps the main claims to concrete repo evidence. |
| 4. Run the one-command proof | `hackathon-assets/reproduction-receipt.md`<br><code>npm run evidence:reproduce</code> | Regenerates the evidence chain and receipt from local source. |
| 5. Inspect DataHub context artifacts | `examples/cat-context-agent/generated-datahub-bridge-plan.json` | Shows the datasetProperties, schemaMetadata, ownership, and glossaryTerms handoff. |
| 6. Inspect the MCP-style read contract | `examples/cat-context-agent/generated-mcp-context-read.json` | Shows the agent reading entity, lineage, and CAT context before action. |

## Proof commands

```bash
npm install
npm run demo
npm run submission:verify
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

### The agent reads context before action.

- `examples/cat-context-agent/generated-mcp-context-read.json`
- `hackathon-assets/context-tool-contracts.md`

### Unsafe work is approval-gated or blocked.

- `examples/cat-context-agent/generated-agent-output.json`
- `hackathon-assets/decision-trace.md`
- `hackathon-assets/judge-evidence-pack.md`

### The submission is reproducible.

- `hackathon-assets/reproduction-receipt.md`
- `hackathon-assets/submission-readiness-report.md`
- `hackathon-assets/artifact-validation-report.md`
