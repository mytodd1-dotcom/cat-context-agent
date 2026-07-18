# CAT Context Agent — Judge Rubric Matrix

Generated: `demo-static-run`  
Status: **ready**  
Source checked: [https://datahub.devpost.com/](https://datahub.devpost.com/)

This artifact maps the submission to the public DataHub Agent Hackathon judging criteria, so judges can score the project without reverse-engineering the evidence stack.

## Rubric alignment

| Criterion | CAT alignment | Evidence | Current limitation / next step |
| --- | --- | --- | --- |
| Use of DataHub | Strong for a reproducible prototype: DataHub-style dataset identity, schema metadata, ownership, glossary/policy context, lineage reads, MCP handoff, and optional local Rest.li ingestProposal write path are explicit. | `examples/cat-context-agent/generated-datahub-metadata.json`<br>`examples/cat-context-agent/generated-datahub-bridge-plan.json`<br>`hackathon-assets/datahub-claim-audit.md`<br>`hackathon-assets/datahub-mcp-handoff.md`<br>`hackathon-assets/live-datahub-runbook.md` | The submitted path is intentionally dry-run judgeable; the next step is posting the same aspects to a local DataHub GMS and reading through live MCP / Agent Context Kit. |
| Technical Execution | Strong for submitted scope: deterministic scripts regenerate the demo outputs, validate artifacts, build the page, and test the evidence chain end-to-end. | `package.json`<br>`hackathon-assets/reproduction-receipt.md`<br>`hackathon-assets/artifact-validation-report.md`<br>`hackathon-assets/github-actions-ci-template.yml` | The next engineering step is turning the artifact pipeline into a live service endpoint with persisted request history. |
| Originality | Strong conceptually: CAT focuses on the overlooked agent step between messy business data and action — deciding what context is trusted enough to act on. | `hackathon-assets/lineage-decision-map.md`<br>`hackathon-assets/safety-policy-matrix.md`<br>`hackathon-assets/judge-faq.md`<br>`hackathon-assets/judge-quick-card.md` | A deeper submission could add more industries and compare multiple context policies side by side. |
| Real-World Usefulness | Strong for small-business operations: the demo turns revenue-risk, onboarding, and renewal requests into safe internal work, approval questions, or blocked outreach. | `examples/cat-context-agent/messy-business-requests.csv`<br>`examples/cat-context-agent/generated-agent-output.json`<br>`hackathon-assets/decision-trace.md`<br>`hackathon-assets/judge-evidence-pack.md` | The next product step is connecting a real inbox/CRM export and adding human approval handoff. |
| Submission Quality | Strong: the project has a public demo, public repo, demo video, Apache 2.0 license, quick card, scoring brief, FAQ, start guide, and reproducible setup commands. | `JUDGE_START_HERE.md`<br>`hackathon-assets/judge-quick-card.md`<br>`hackathon-assets/judge-scoring-brief.md`<br>`hackathon-assets/demo-video-guide.md`<br>`LICENSE` | Keep the Devpost description synchronized with generated copy if any late demo/video fields change. |
| Bonus: Meaningful Open-Source Contribution | Emerging: the repo is Apache 2.0 and packages reusable DataHub/MCP-style context artifacts, but it does not yet contribute upstream code to DataHub. | `LICENSE`<br>`hackathon-assets/context-tool-contracts.md`<br>`hackathon-assets/datahub-integration-checklist.md`<br>`hackathon-assets/datahub-mcp-handoff.md` | Potential bonus path: submit a small DataHub documentation PR or starter-kit note derived from the MCP handoff and local runbook. |

## Fastest scoring path

```bash
npm run judge:quick
```

Full validation:

```bash
npm run ci:local
```

## Signals judges can verify

- DataHub aspects prepared: `datasetProperties`, `schemaMetadata`, `ownership`, `glossaryTerms`
- MCP-style context reads: `datahub.get_entity`, `datahub.get_lineage`, `cat.get_agent_context_packet`
- MCP smoke flows: 3
- External side effects: `none`
- Honesty audit status: `passed`
- DataHub claim audit status: `passed`

## Bottom line

CAT is strongest on context-before-action, safety, reproducibility, and submission clarity. The only intentional limitation is that live DataHub posting remains opt-in/local instead of required for judging, but the repo now exposes the exact Rest.li ingestProposal bodies for that local verification path.
