# CAT Context Agent — Decision Trace

Generated: `demo-static-run`  
Source asset: `urn:li:dataset:(cat,messy_business_requests,PROD)`

This file shows the end-to-end path from messy row → DataHub/MCP context read → agent decision → receipt.

## Trace table

| Request | Account | Data issue | Context reads | Decision | Safe next step | Blocked action |
| --- | --- | --- | --- | --- | --- | --- |
| `REQ-1042` | Acme HVAC | owner context missing | `datahub.get_entity`<br>`datahub.get_lineage`<br>`cat.get_agent_context_packet` | `needs_approval` | Ask for missing customer contact owner before follow-up | Do not send external follow-up |
| `REQ-1043` | Northline Dental | internal finance review | `datahub.get_entity`<br>`datahub.get_lineage`<br>`cat.get_agent_context_packet` | `safe_to_queue_internal_task` | Create finance review task for invoice mismatch | — |
| `REQ-1044` | Cedar Auto | verified contact missing | `datahub.get_entity`<br>`datahub.get_lineage`<br>`cat.get_agent_context_packet` | `blocked` | Request a verified contact before customer action | Do not guess, scrape, or invent contact details |

## What judges should notice

- The agent does not act directly on raw rows.
- Every decision cites DataHub-style context and CAT policy context.
- Missing owner/contact context changes the allowed action.
- Unsafe external outreach becomes approval-gated or blocked work.
