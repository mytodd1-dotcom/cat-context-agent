# CAT Context Agent — Context Tool Contracts

Protocol: `cat-context-tool-contracts-v0`

Machine-readable tool boundary for the CAT Context Agent demo. These contracts show how the local artifacts map to DataHub/MCP-style reads and guarded CAT actions.

## Safety boundary

- Default mode: `read_before_action`
- Blocked without verified context: `send_external_outreach_without_verified_contact`, `invent_missing_owner`, `scrape_contact_details`
- Human approval required for: `external_customer_follow_up_when_owner_is_missing`, `low_confidence_fields_below_policy_threshold`

## Tools

### `datahub.get_entity`

- Kind: DataHub read
- Purpose: Read dataset properties, schema metadata, ownership, and glossary terms before agent action.
- Local demo source: `examples/cat-context-agent/generated-datahub-bridge-plan.json`
- Required input: `urn`

### `datahub.get_lineage`

- Kind: DataHub read
- Purpose: Confirm the dataset's path from uploaded CSV through context mapping and decision receipts.
- Local demo source: `examples/cat-context-agent/generated-agent-context-packet.json`
- Required input: `urn`, `direction`

### `cat.get_agent_context_packet`

- Kind: CAT guarded read
- Purpose: Read the minimum action-safety contract derived from DataHub context before deciding next steps.
- Local demo source: `examples/cat-context-agent/generated-mcp-context-read.json`
- Required input: `asset`

### `cat.write_receipt`

- Kind: CAT guarded write
- Purpose: Persist a decision receipt after the agent has read context and chosen safe-to-queue, approval-required, or blocked.
- Local demo source: `examples/cat-context-agent/generated-agent-output.json`
- Required input: `request_id`, `decision`, `source_asset`, `context_checked`, `safe_next_step`

