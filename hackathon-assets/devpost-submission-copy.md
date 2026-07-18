# CAT Context Agent — Devpost Submission Copy

Use this as the canonical copy pack if the Devpost draft needs edits.

## Links

- Live demo / test URL: [https://cat-context-agent.flyguy.chatgpt.site](https://cat-context-agent.flyguy.chatgpt.site)
- Repository: [https://github.com/mytodd1-dotcom/cat-context-agent](https://github.com/mytodd1-dotcom/cat-context-agent)
- Demo video: [https://youtu.be/Gcbhl5_YlSM](https://youtu.be/Gcbhl5_YlSM)
- Event: Build with DataHub: The Agent Hackathon
- Category: Agents That Do Real Work

## Tagline

Context before action for messy business data: a DataHub-aware agent that turns scattered files into safe next steps, approval questions, and traceable receipts.

## Elevator pitch

CAT Context Agent helps small businesses turn messy operational files into trusted, traceable workflows. Before the agent recommends action, it checks what the data is, what fields mean, what is missing, who owns the workflow, and which actions are safe, approval-gated, or blocked.

## Inspiration

Most agent demos jump from input to action too quickly. In real small-business operations, messy spreadsheets and notes are full of missing owners, unclear fields, stale context, and unsafe assumptions. CAT was built around the idea that an agent should understand context before it acts.

## What it does

The demo ingests messy business request data, maps it into DataHub-style metadata, reads schema/ownership/lineage/policy context, and separates requests into safe internal tasks, approval-required work, and blocked outreach. Every recommendation produces a receipt that shows the source asset, context checked, missing information, confidence, safe next step, and blocked action.

## How we built it

We built a runnable local evidence chain around one focused workflow. The repo includes a sample messy CSV, a DataHub-style context map, generated DataHub metadata aspects, a dry-run DataHub bridge plan, a DataHub integration checklist, a DataHub claim audit, a DataHub MCP handoff, an MCP-style context read artifact, a lineage-to-decision map, a safety policy matrix, a decision trace, a judge evidence pack, and a public Next.js landing page. The key design choice was to make the context boundary inspectable instead of hiding it inside a black-box prompt.

## Challenges we ran into

The hardest part was keeping the scope honest. A full live DataHub deployment, MCP server, and workflow engine could grow quickly, so the current submission isolates the agent-context contract and makes every simulated boundary explicit. That keeps the prototype reproducible while showing the intended DataHub integration path.

## Accomplishments

The project now has a public demo, a public GitHub repo, Apache 2.0 licensing, reproducible local commands, generated judge artifacts, a one-command evidence reproduction path, and tests that verify the submission shell and evidence chain.

## What we learned

The strongest agent pattern here is not more autonomy. It is better context, better refusal, and better receipts. DataHub is valuable because it gives the agent a structured way to ask what data means before deciding what action is safe.

## What's next

Next we would run a local DataHub quickstart, post the generated metadata change proposals to DataHub GMS, replace the static context packet with live DataHub MCP / Agent Context Kit reads, and write workflow receipt outcomes back as metadata or auditable artifacts.

## Built with

- DataHub OSS context model
- DataHub MCP-style read plan
- DataHub Agent Context Kit concept
- Next.js
- TypeScript
- Node.js
- Apache 2.0

## Feedback for DataHub / organizers

The hackathon theme is strong because it pushes builders toward context-aware agents instead of generic chatbots. The most helpful next addition would be a small reference example showing the preferred shape of a DataHub MCP / Agent Context Kit hackathon submission, including what judges consider a good boundary between dry-run metadata, live DataHub posting, and agent action.
