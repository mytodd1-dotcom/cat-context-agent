# CAT Context Agent — Judge FAQ

Generated: `demo-static-run`  
Status: **ready**

This is a direct objection-handler for judges: what is real now, what is optional, what DataHub contributes, and how to verify the claims without guessing.

## Quick facts

- Submission readiness checks: 14
- Honesty audit checks: 5
- DataHub doctor status: `ready_without_live_datahub`
- Local DataHub required for judging: `false`
- MCP smoke request flows: 3
- External side effects: `none`
- Blocked actions: `send_external_outreach_without_verified_contact`, `invent_missing_owner`, `scrape_contact_details`

## Questions judges may ask

### Is this connected to live DataHub right now?

The submitted artifact is intentionally judgeable without live DataHub, Docker, or credentials. It generates DataHub-ready metadata, exact Rest.li ingestProposal bodies, a readiness doctor, and an explicit local-only post runbook for judges who want the live GMS path.

**Evidence:** `hackathon-assets/datahub-readiness-doctor.md`, `hackathon-assets/datahub-integration-checklist.md`, `hackathon-assets/live-datahub-runbook.md`

**Verification command:** `npm run datahub:doctor`

### What does DataHub actually contribute?

DataHub is modeled as the context layer: dataset identity, schema metadata, ownership, glossary/policy signals, and lineage become the evidence the agent reads before it chooses safe-to-queue, approval-required, or blocked outcomes.

**Evidence:** `examples/cat-context-agent/generated-datahub-metadata.json`, `examples/cat-context-agent/generated-datahub-bridge-plan.json`, `examples/cat-context-agent/generated-mcp-context-read.json`

**Verification command:** `npm run datahub:bridge`

### Is this more than a chatbot wrapper?

Yes. The demo has a deterministic workflow boundary: three messy business requests produce one safe internal task, one approval-required action, and one blocked outreach action, with receipts tied back to source context.

**Evidence:** `examples/cat-context-agent/generated-agent-output.json`, `hackathon-assets/decision-trace.md`, `hackathon-assets/lineage-decision-map.md`

**Verification command:** `npm run evidence:reproduce`

### What prevents unsafe automation?

The policy matrix and MCP smoke test preserve the refusal boundary. Missing verified contact or ownership blocks external outreach, and the local adapter records external_side_effects as none.

**Evidence:** `hackathon-assets/safety-policy-matrix.md`, `hackathon-assets/mcp-adapter-smoke-report.md`, `hackathon-assets/submission-honesty-audit.md`

**Verification command:** `npm run submission:honesty`

### How can I verify the whole submission quickly?

Use the five-minute walkthrough for the shortest path, or run the full local CI command. The proof chain regenerates judge artifacts and checks the build/test suite together.

**Evidence:** `hackathon-assets/judge-walkthrough.md`, `hackathon-assets/reproduction-receipt.md`, `hackathon-assets/artifact-validation-report.md`

**Verification command:** `npm run judge:walkthrough`
