# CAT Context Agent — Demo Video Guide

Accessibility and judge companion for the demo video, so the project can be reviewed quickly even without audio.

Video: [https://youtu.be/_4qvnsGBbtA](https://youtu.be/_4qvnsGBbtA)

## Timestamp guide

| Time | Segment | What to look for |
| --- | --- | --- |
| 0:00 | Problem | Small businesses have messy operational files, unclear owners, and missing contact context. The risk is an agent acting before it understands the data. |
| 0:25 | DataHub context layer | CAT treats DataHub-style metadata as the context layer: schema, ownership, lineage, field confidence, glossary terms, and safety policy. |
| 0:50 | Agent read-before-action loop | The agent reads entity context, lineage, and a CAT context packet before recommending any workflow action. |
| 1:15 | Approval queue | The same messy input produces three different outcomes: safe internal task, approval-required work, and blocked outreach. |
| 1:40 | Receipts and reproducibility | Every recommendation points back to source data, checked context, missing information, confidence, safe next step, and blocked action. |
| 2:00 | Judge proof path | The repo includes a submission index, one-command reproduction receipt, scoring brief, Devpost copy pack, and local CI command. |

## Transcript summary

CAT Context Agent demonstrates context before action. It starts with messy business request data, maps it into DataHub-style metadata, reads the context needed to understand the work, and only then decides whether to queue a safe internal task, ask for approval, or block an unsafe action. The important behavior is not just automation; it is safer automation with receipts that explain what the agent knew, what was missing, and why an action was allowed or refused.

## Judge takeaways

- DataHub is used as the agent context boundary, not just a named dependency.
- The demo is intentionally reproducible without credentials or Docker.
- Safety behavior is visible in the output receipts and approval queue.
- The live page, video, repo, and Devpost copy all point to the same evidence chain.
