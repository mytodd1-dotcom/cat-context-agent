# CAT Context Agent — Judge Walkthrough

Generated: `demo-static-run`  
Status: **ready**

This is the shortest terminal walkthrough for judges who want to verify the submission without guessing which files matter.

## Five-minute path

### 1. Open the judge start guide

```bash
open JUDGE_START_HERE.md
```

Proves: The submission has a judge-first entry point with live demo, video, scoring brief, and local proof commands.

Expected: A compact start-here file that points to the live demo, GitHub repo, evidence pack, and DataHub artifacts.

Inspect:
- `JUDGE_START_HERE.md`
- `DEVPOST_JUDGE_NOTES.md`

### 2. Run the one-command proof

```bash
npm run evidence:reproduce
```

Proves: The core evidence chain can be regenerated locally from source.

Expected: A reproducible receipt with generated DataHub, policy, validation, and safety reports.

Inspect:
- `hackathon-assets/reproduction-receipt.md`
- `hackathon-assets/artifact-validation-report.md`

### 3. Check DataHub readiness without posting

```bash
npm run datahub:doctor
```

Proves: The optional local DataHub path is explicit, guarded, and not required for judging.

Expected: A readiness report that confirms dry-run artifacts are ready and no metadata is posted.

Inspect:
- `hackathon-assets/datahub-readiness-doctor.md`
- `hackathon-assets/live-datahub-runbook.md`

### 4. Smoke-test the MCP adapter boundary

```bash
npm run mcp:smoke
```

Proves: The local adapter reads DataHub/CAT context before writing bounded receipts.

Expected: Three request flows, twelve tool calls, and no external side effects.

Inspect:
- `hackathon-assets/mcp-adapter-smoke-report.md`
- `hackathon-assets/datahub-mcp-handoff.md`

### 5. Run the full local CI equivalent

```bash
npm run ci:local
```

Proves: A fresh-install check, all generators, build, and render/evidence tests pass together.

Expected: The build succeeds and the Node test suite reports all tests passing.

Inspect:
- `package.json`
- `hackathon-assets/github-actions-ci-template.yml`

## Safety summary

- No command in the five-minute path posts to DataHub, contacts customers, sends outreach, or requires secrets.
- The optional live DataHub mutation remains isolated behind DATAHUB_GMS_URL plus --post.
- The MCP smoke test writes only local receipts and records external_side_effects as none.
- Missing owner/contact context still produces approval-required or blocked outcomes.

## Current evidence snapshot

- Submission readiness checks: 13
- DataHub doctor status: `ready_without_live_datahub`
- Local DataHub required for judging: `false`
- MCP adapter request flows: 3
- MCP adapter tool calls: 12
- External side effects: `none`
