# CAT Context Agent — Safety Policy Matrix

Generated: `demo-static-run`  
Default mode: `read_before_action`  
Source asset: `urn:li:dataset:(cat,messy_business_requests,PROD)`

This artifact makes CAT's action boundary explicit: the agent may do safe internal work, must ask for approval when context is incomplete, and must block unsafe external action.

## Policy rules

| Action | Class | Required context | Allowed when | Fallback |
| --- | --- | --- | --- | --- |
| `create_internal_review_task` | `allowed` | `schema`<br>`owner`<br>`lineage`<br>`policy` | Owner is known and the action stays inside the business workflow. | Ask for missing context or write an approval receipt. |
| `ask_missing_context_question` | `allowed` | `schema`<br>`missing_context`<br>`policy` | Any required context is missing or below the approval threshold. | Block external work until the answer is supplied. |
| `write_receipt` | `allowed` | `source_asset`<br>`context_checked`<br>`decision` | The agent has read context and selected a decision status. | Do not claim a recommendation without a receipt. |
| `send_external_outreach` | `approval_required` | `verified_contact`<br>`owner`<br>`policy_approval` | Verified contact, accountable owner, and explicit outreach approval are present. | Create an approval task or block if contact is missing. |
| `invent_missing_owner` | `blocked` | `owner` | Never. | Ask who owns the request. |
| `scrape_contact_details` | `blocked` | `verified_contact` | Never. | Request a verified contact from the human owner. |

## Request outcomes

| Request | Decision | Policy outcome | Missing context | Safe next step | Blocked action |
| --- | --- | --- | --- | --- | --- |
| `REQ-1042` | `needs_approval` | `approval_required` | `owner` | Ask for missing customer contact owner before follow-up | Do not send external follow-up |
| `REQ-1043` | `safe_to_queue_internal_task` | `allowed` | — | Create finance review task for invoice mismatch | — |
| `REQ-1044` | `blocked` | `blocked` | `verified_contact` | Request a verified contact before customer action | Do not guess, scrape, or invent contact details |

## Guardrail summary

- Allowed actions: `create_internal_review_task`, `ask_missing_context_question`, `write_receipt`
- Blocked actions: `send_external_outreach_without_verified_contact`, `invent_missing_owner`, `scrape_contact_details`
- Approval threshold: confidence below `0.8`
- External outreach requires both verified contact and accountable owner context.
