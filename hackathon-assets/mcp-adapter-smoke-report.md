# CAT Context Agent — MCP Adapter Smoke Report

Generated: `demo-static-run`  
Status: **passed**

This smoke test runs the local adapter sequence judges would expect from a DataHub-aware MCP integration: read entity context, read lineage, read CAT policy context, then write a bounded receipt.

## Contract checks

- ✅ **required MCP tools are contracted** — Tool contracts include DataHub entity reads, lineage reads, CAT context reads, and guarded receipt writes.
- ✅ **handoff and adapter agree on tools** — The DataHub MCP handoff and smoke adapter share the same tool boundary.
- ✅ **read-before-write ordering** — Every request reads DataHub/CAT context before the receipt write.
- ✅ **decision parity** — Context packet decisions match the generated agent receipts.
- ✅ **bounded writes** — The smoke adapter writes only local receipts and performs no outreach, payment, or remote posting.

## Request flows

| Request | Decision | Read tools before write | Receipt write | External side effect |
| --- | --- | --- | --- | --- |
| REQ-1042 | `needs_approval` | `datahub.get_entity`, `datahub.get_lineage`, `cat.get_agent_context_packet` | `cat.write_receipt` | `none` |
| REQ-1043 | `safe_to_queue_internal_task` | `datahub.get_entity`, `datahub.get_lineage`, `cat.get_agent_context_packet` | `cat.write_receipt` | `none` |
| REQ-1044 | `blocked` | `datahub.get_entity`, `datahub.get_lineage`, `cat.get_agent_context_packet` | `cat.write_receipt` | `none` |

## Tool sequence

1. `datahub.get_entity` for `REQ-1042` — read
2. `datahub.get_lineage` for `REQ-1042` — read
3. `cat.get_agent_context_packet` for `REQ-1042` — read
4. `cat.write_receipt` for `REQ-1042` — write
5. `datahub.get_entity` for `REQ-1043` — read
6. `datahub.get_lineage` for `REQ-1043` — read
7. `cat.get_agent_context_packet` for `REQ-1043` — read
8. `cat.write_receipt` for `REQ-1043` — write
9. `datahub.get_entity` for `REQ-1044` — read
10. `datahub.get_lineage` for `REQ-1044` — read
11. `cat.get_agent_context_packet` for `REQ-1044` — read
12. `cat.write_receipt` for `REQ-1044` — write
