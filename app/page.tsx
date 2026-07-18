const contextSteps = [
  {
    title: "Catalog the messy inputs",
    text: "Register sample CSVs, notes, and operational records as DataHub-aware assets instead of treating them as anonymous uploads.",
  },
  {
    title: "Ask DataHub before acting",
    text: "The agent checks schemas, ownership, lineage, and field meaning before recommending workflow actions.",
  },
  {
    title: "Expose missing context",
    text: "When data is incomplete, stale, or ambiguous, CAT produces questions and an approval queue instead of pretending.",
  },
  {
    title: "Leave a receipt",
    text: "Every recommendation carries the sources, assumptions, confidence level, and safe next step that produced it.",
  },
];

const demoArtifacts = [
  "messy business sample dataset",
  "DataHub metadata/context map",
  "agent-read context summary",
  "approval queue",
  "receipt-backed action plan",
];

const buildTracks = [
  ["Live demo", "cat-context-agent.flyguy.chatgpt.site"],
  ["Demo video", "youtu.be/Gcbhl5_YlSM"],
  ["Challenge", "Agents That Do Real Work"],
  ["Core platform", "DataHub OSS + MCP Server"],
  ["Agent context", "Agent Context Kit + DataHub Skills"],
  ["Demo slice", "messy CSV, context map, approval queue, receipt JSON"],
];

const datahubUsage = [
  {
    aspect: "Dataset identity",
    datahubInput: "urn:li:dataset:(cat,messy_business_requests,PROD)",
    agentEffect: "Anchors every receipt to a named source asset instead of anonymous uploaded data.",
  },
  {
    aspect: "Schema metadata",
    datahubInput: "mapped fields, confidence, missing contact field",
    agentEffect: "Separates safe internal queueing from rows that need a human question first.",
  },
  {
    aspect: "Ownership",
    datahubInput: "finance owner, success owner, unknown owner",
    agentEffect: "Blocks or escalates external-facing work when accountable ownership is missing.",
  },
  {
    aspect: "Glossary + policy",
    datahubInput: "outreach guardrail, approval-required customer contact rule",
    agentEffect: "Turns high-value work into approval tasks instead of unauthorized outreach.",
  },
];

const judgeScorecard = [
  {
    criterion: "Agents That Do Real Work",
    proof: "The demo turns messy requests into safe-to-queue, approval-required, and blocked workflow outcomes.",
    receipt: "generated-agent-output.json",
  },
  {
    criterion: "Meaningful DataHub use",
    proof: "Dataset identity, schema metadata, ownership, glossary terms, and policy signals shape the decision boundary.",
    receipt: "generated-datahub-bridge-plan.json",
  },
  {
    criterion: "Context before action",
    proof: "The agent simulates DataHub/MCP reads before recommending or blocking any next step.",
    receipt: "generated-mcp-context-read.json",
  },
  {
    criterion: "Safety and governance",
    proof: "Missing owner/contact context creates approval tasks or blocks external outreach.",
    receipt: "agent-receipts.json",
  },
  {
    criterion: "Reproducible submission",
    proof: "A one-command evidence run regenerates the artifacts and validation receipt.",
    receipt: "reproduction-receipt.md",
  },
];

const outcomeStats = [
  ["3", "messy requests"],
  ["6/7", "fields mapped"],
  ["1", "safe internal task"],
  ["1", "approval + 1 block"],
];

const verificationCommands = [
  {
    label: "Fast proof",
    command: "npm run evidence:reproduce",
    expected: "Regenerates the evidence chain and writes the reproduction receipt.",
  },
  {
    label: "Full local check",
    command: "npm run ci:local",
    expected: "Runs the full artifact pipeline, build, and 22 render/evidence tests.",
  },
  {
    label: "Context read",
    command: "npm run context:read",
    expected: "Writes the MCP-style DataHub context packet the agent reads before action.",
  },
];

const readinessChecks = [
  {
    label: "Runnability",
    status: "Live + local",
    detail: "Public page, demo video, repo commands, and generated evidence artifacts are available now.",
  },
  {
    label: "DataHub use",
    status: "Context contract",
    detail: "Dataset identity, schema, ownership, glossary, lineage, and policy signals drive the agent decision path.",
  },
  {
    label: "Safety boundary",
    status: "Guarded actions",
    detail: "External outreach is blocked or approval-gated when owner, contact, or policy context is missing.",
  },
  {
    label: "Live integration",
    status: "Documented next",
    detail: "The opt-in runbook shows how to post the same DataHub aspects to a local GMS when judges want the live path.",
  },
];

const judgePath = [
  {
    step: "1",
    title: "Watch the two-minute video",
    href: "https://youtu.be/Gcbhl5_YlSM",
    text: "See the full context-before-action loop without needing to run anything first.",
  },
  {
    step: "2",
    title: "Skim the live demo slice",
    href: "#demo",
    text: "Review the messy data, DataHub-style context read, approval queue, and receipt output.",
  },
  {
    step: "3",
    title: "Open the judge start guide",
    href: "https://github.com/mytodd1-dotcom/cat-context-agent/blob/main/JUDGE_START_HERE.md",
    text: "Follow the shortest repo path through claims, commands, artifacts, and scope transparency.",
  },
  {
    step: "4",
    title: "Run one proof command",
    href: "https://github.com/mytodd1-dotcom/cat-context-agent/blob/main/hackathon-assets/reproduction-receipt.md",
    text: "Use npm run evidence:reproduce or npm run ci:local to regenerate the receipt-backed evidence chain.",
  },
];

const runnableArtifacts = [
  {
    label: "Judge start here",
    command: "open JUDGE_START_HERE.md",
    href: "https://github.com/mytodd1-dotcom/cat-context-agent/blob/main/JUDGE_START_HERE.md",
    text: "The shortest review path through the video, live demo, scoring brief, one-command proof, and DataHub evidence.",
  },
  {
    label: "Demo video",
    command: "watch the 2-minute walkthrough",
    href: "https://youtu.be/Gcbhl5_YlSM",
    text: "A quick judge-facing walkthrough of the context-before-action workflow and evidence chain.",
  },
  {
    label: "Video guide",
    command: "npm run demo:guide",
    href: "https://github.com/mytodd1-dotcom/cat-context-agent/blob/main/hackathon-assets/demo-video-guide.md",
    text: "Timestamped companion notes and a transcript summary for judges reviewing without audio.",
  },
  {
    label: "One-command proof",
    command: "npm run evidence:reproduce",
    href: "https://github.com/mytodd1-dotcom/cat-context-agent/blob/main/hackathon-assets/reproduction-receipt.md",
    text: "Reruns submission verification and artifact validation, then writes a reproduction receipt for judges.",
  },
  {
    label: "Submission index",
    command: "npm run submission:index",
    href: "https://github.com/mytodd1-dotcom/cat-context-agent/blob/main/hackathon-assets/submission-index.md",
    text: "A judge-first start-here map with the exact review order, proof commands, canonical links, and claim shortlist.",
  },
  {
    label: "Judge scoring brief",
    command: "npm run judge:brief",
    href: "https://github.com/mytodd1-dotcom/cat-context-agent/blob/main/hackathon-assets/judge-scoring-brief.md",
    text: "Maps each major claim to inspectable repo evidence: DataHub context, read-before-action, safety, and reproducibility.",
  },
  {
    label: "Devpost copy pack",
    command: "npm run devpost:copy",
    href: "https://github.com/mytodd1-dotcom/cat-context-agent/blob/main/hackathon-assets/devpost-submission-copy.md",
    text: "Keeps the final submission story, links, built-with list, next steps, and organizer feedback in one canonical file.",
  },
  {
    label: "Local decision runner",
    command: "npm run demo",
    href: "https://github.com/mytodd1-dotcom/cat-context-agent/blob/main/examples/cat-context-agent/generated-agent-output.json",
    text: "Turns messy CSV rows into safe-to-queue, approval-required, and blocked receipt outcomes.",
  },
  {
    label: "DataHub bridge plan",
    command: "npm run datahub:bridge",
    href: "https://github.com/mytodd1-dotcom/cat-context-agent/blob/main/examples/cat-context-agent/generated-datahub-bridge-plan.json",
    text: "Shows datasetProperties, schemaMetadata, ownership, and glossaryTerms ready for DataHub.",
  },
  {
    label: "Live DataHub runbook",
    command: "npm run datahub:runbook",
    href: "https://github.com/mytodd1-dotcom/cat-context-agent/blob/main/hackathon-assets/live-datahub-runbook.md",
    text: "Documents the local GMS prerequisites, opt-in post command, acceptance checks, fallback, and safety boundary.",
  },
  {
    label: "DataHub integration checklist",
    command: "npm run datahub:checklist",
    href: "https://github.com/mytodd1-dotcom/cat-context-agent/blob/main/hackathon-assets/datahub-integration-checklist.md",
    text: "Separates what judges can verify without credentials from the optional local DataHub posting path.",
  },
  {
    label: "DataHub claim audit",
    command: "npm run datahub:audit",
    href: "https://github.com/mytodd1-dotcom/cat-context-agent/blob/main/hackathon-assets/datahub-claim-audit.md",
    text: "Gives judges a compact pass/fail audit of the DataHub-specific claims in the submission.",
  },
  {
    label: "MCP-style context read",
    command: "npm run context:read",
    href: "https://github.com/mytodd1-dotcom/cat-context-agent/blob/main/examples/cat-context-agent/generated-mcp-context-read.json",
    text: "Simulates datahub.get_entity, datahub.get_lineage, and CAT's agent context packet before action.",
  },
  {
    label: "Lineage decision map",
    command: "npm run lineage:map",
    href: "https://github.com/mytodd1-dotcom/cat-context-agent/blob/main/hackathon-assets/lineage-decision-map.md",
    text: "Shows the source → DataHub context → agent decision → approval queue → receipt chain as a Mermaid map.",
  },
  {
    label: "Safety policy matrix",
    command: "npm run policy:matrix",
    href: "https://github.com/mytodd1-dotcom/cat-context-agent/blob/main/hackathon-assets/safety-policy-matrix.md",
    text: "Shows which agent actions are allowed, approval-required, or blocked from the available DataHub-style context.",
  },
  {
    label: "Judge evidence pack",
    command: "npm run judge:pack",
    href: "https://github.com/mytodd1-dotcom/cat-context-agent/blob/main/hackathon-assets/judge-evidence-pack.md",
    text: "Summarizes commands, artifacts, DataHub aspects, safety claims, and decision receipts in one skim-ready file.",
  },
];

const messyRows = [
  ["REQ-1042", "Acme HVAC", "renewal follow-up", "renewals@acme.example", "USD 8,400", "high", "owner unknown"],
  ["REQ-1043", "Northline Dental", "invoice mismatch", "ap@northline.example", "USD 1,280", "medium", "finance"],
  ["REQ-1044", "Cedar Auto", "churn risk", "", "USD 3,100", "high", "success"],
];

const contextSignals = [
  {
    label: "DataHub asset",
    value: "urn:li:dataset:(cat,messy_business_requests,PROD)",
    state: "cataloged",
  },
  {
    label: "Schema confidence",
    value: "6/7 fields mapped",
    state: "warning",
  },
  {
    label: "Owner context",
    value: "2 owner gaps found",
    state: "blocked",
  },
  {
    label: "Policy",
    value: "outreach requires contact owner + approval",
    state: "guardrail",
  },
];

const decisionComparison = [
  {
    request: "REQ-1042 · Acme HVAC renewal",
    withoutContext: "Send follow-up because value and priority are high.",
    withContext: "Hold for approval until the missing contact owner is confirmed.",
    datahubSignal: "owner metadata + outreach policy",
  },
  {
    request: "REQ-1043 · Northline invoice mismatch",
    withoutContext: "Escalate as a generic customer issue.",
    withContext: "Queue an internal finance review because owner and contact context are known.",
    datahubSignal: "schema mapping + finance owner",
  },
  {
    request: "REQ-1044 · Cedar Auto churn risk",
    withoutContext: "Try to find or guess a customer contact.",
    withContext: "Block external outreach because the contact field is blank.",
    datahubSignal: "field completeness + safety guardrail",
  },
];

const approvalQueue = [
  {
    item: "REQ-1042 · Acme HVAC",
    decision: "Ask for contact owner before follow-up",
    why: "High priority, but contact owner is missing and the action could trigger client outreach.",
    status: "Needs human approval",
  },
  {
    item: "REQ-1043 · Northline Dental",
    decision: "Create finance review task",
    why: "Contact and owner are known; invoice mismatch can be routed internally without external messaging.",
    status: "Safe to queue",
  },
  {
    item: "REQ-1044 · Cedar Auto",
    decision: "Block automated outreach",
    why: "Churn risk is high, but customer email is blank; the agent must not guess or scrape contacts.",
    status: "Blocked",
  },
];

const scopeCards = [
  {
    title: "Working in this submission",
    items: [
      "local decision runner",
      "DataHub-ready metadata artifacts",
      "dry-run DataHub bridge plan",
      "MCP-style context read contract",
      "approval queue and receipt outputs",
      "public demo, video, and proof commands",
    ],
  },
  {
    title: "Planned live integration",
    items: [
      "post metadata change proposals to local DataHub GMS",
      "replace static context packet with DataHub MCP / Agent Context Kit reads",
      "write approval and blocked receipts back as auditable metadata",
      "wire safe internal decisions into a production workflow engine",
    ],
  },
];

const judgeFaq = [
  {
    question: "Is this connected to a live DataHub instance?",
    answer: "The submitted demo is intentionally runnable without credentials or Docker. It ships DataHub-ready metadata, a dry-run bridge plan, and a live-runbook for posting the same aspects to a local DataHub GMS.",
  },
  {
    question: "What does the agent actually decide?",
    answer: "It classifies each messy request as safe to queue, approval required, or blocked. The decision changes when owner, contact, schema, or policy context is missing.",
  },
  {
    question: "Why is DataHub important here?",
    answer: "DataHub is the context layer: dataset identity, schema meaning, ownership, lineage, glossary terms, and policy signals become the evidence the agent must read before action.",
  },
  {
    question: "How can judges reproduce the claim?",
    answer: "Run npm run evidence:reproduce for the short proof or npm run ci:local for the full validation chain. The repo writes receipts and generated artifacts judges can inspect.",
  },
];

const evidenceMatrix = [
  {
    claim: "The agent reads context before action.",
    evidence: "MCP-style context read + generated agent context packet",
    link: "https://github.com/mytodd1-dotcom/cat-context-agent/blob/main/examples/cat-context-agent/generated-mcp-context-read.json",
  },
  {
    claim: "DataHub metadata shapes the decision boundary.",
    evidence: "DataHub bridge plan with datasetProperties, schemaMetadata, ownership, and glossaryTerms",
    link: "https://github.com/mytodd1-dotcom/cat-context-agent/blob/main/examples/cat-context-agent/generated-datahub-bridge-plan.json",
  },
  {
    claim: "Unsafe or underspecified work is blocked.",
    evidence: "Generated agent output and receipt JSON showing safe, approval-required, and blocked outcomes",
    link: "https://github.com/mytodd1-dotcom/cat-context-agent/blob/main/examples/cat-context-agent/generated-agent-output.json",
  },
  {
    claim: "The submission is reproducible.",
    evidence: "One-command reproduction receipt and local CI-equivalent validation",
    link: "https://github.com/mytodd1-dotcom/cat-context-agent/blob/main/hackathon-assets/reproduction-receipt.md",
  },
];

const receiptJson = `{
  "receipt_id": "cat-demo-REQ-1042",
  "source_asset": "urn:li:dataset:(cat,messy_business_requests,PROD)",
  "context_checked": ["schema", "owner", "lineage", "policy"],
  "safe_next_step": "Ask for missing customer contact owner",
  "blocked_action": "Do not send external follow-up",
  "confidence": 0.78
}`;

export default function Home() {
  return (
    <main>
      <nav className="nav shell" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="CAT Context Agent home">
          <span className="brandMark">CAT</span>
          <span>Context Agent</span>
        </a>
        <a className="navCta" href="#demo">Working demo slice</a>
      </nav>

      <section className="hero shell" id="top">
        <div className="heroCopy">
          <p className="eyebrow"><span /> DataHub Agent Hackathon submission</p>
          <h1>Context before action for messy business data.</h1>
          <p className="heroLead">
            CAT Context Agent is a DataHub-backed workflow agent that helps small teams turn scattered files into trusted next steps, missing-info questions, and traceable receipts.
          </p>
          <div className="heroActions">
            <a className="button primary" href="https://youtu.be/Gcbhl5_YlSM">Watch demo</a>
            <a className="button dark" href="https://github.com/mytodd1-dotcom/cat-context-agent">Open repo</a>
            <a className="button ghost" href="#demo">Try live slice</a>
          </div>
          <div className="outcomeStrip" aria-label="Demo outcome snapshot">
            {outcomeStats.map(([value, label]) => (
              <div className="outcomeStat" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <p className="micro">
            Submission foundation is live and reproducible. Start with the <a href="https://github.com/mytodd1-dotcom/cat-context-agent/blob/main/JUDGE_START_HERE.md">judge guide</a>, then inspect the concrete demo slice, proof commands, DataHub-style context, approval queue, and receipt output.
          </p>
        </div>

        <div className="contextCard" aria-label="Example context receipt">
          <div className="contextHead">
            <span>AGENT RECEIPT</span>
            <span className="status"><i /> REPRODUCIBLE</span>
          </div>
          <div className="assetPath">
            <b>CSV</b><span>→</span><b>DataHub</b><span>→</span><b>Agent</b><span>→</span><b>Approval</b>
          </div>
          <div className="receiptItem strong">
            <small>SAFE NEXT STEP</small>
            <strong>Ask for missing customer contact owner before sending follow-up tasks.</strong>
          </div>
          <div className="receiptItem">
            <small>CONTEXT USED</small>
            <strong>source file, inferred schema, field confidence, owner metadata</strong>
          </div>
          <div className="receiptItem warning">
            <small>BLOCKED ACTION</small>
            <strong>No automated outreach until approval and ownership are confirmed.</strong>
          </div>
        </div>
      </section>

      <section className="judgePath shell" aria-labelledby="judge-path-heading">
        <div className="judgePathIntro">
          <p className="sectionTag">FAST JUDGE PATH</p>
          <h2 id="judge-path-heading">If you only have ten minutes, start here.</h2>
        </div>
        <div className="judgePathGrid">
          {judgePath.map((item) => (
            <a className="judgePathCard" href={item.href} key={item.title}>
              <span>{item.step}</span>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section shell readinessSection" aria-labelledby="readiness-heading">
        <p className="sectionTag">SUBMISSION READINESS</p>
        <div className="sectionIntro">
          <h2 id="readiness-heading">Clear enough to judge without guessing.</h2>
          <p>
            CAT separates what is working in the submitted artifact from the documented live DataHub integration path, so the evaluation does not depend on hidden services or hand-waving.
          </p>
        </div>
        <div className="readinessGrid">
          {readinessChecks.map((item) => (
            <article className="readinessCard" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.status}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section shell datahubMap" aria-labelledby="datahub-map-heading">
        <p className="sectionTag">DATAHUB → AGENT MAP</p>
        <div className="sectionIntro">
          <h2 id="datahub-map-heading">DataHub is the context layer, not a logo on the slide.</h2>
          <p>
            The agent reads catalog context before it decides. These are the exact kinds of DataHub signals the demo converts into safer actions and auditable receipts.
          </p>
        </div>
        <div className="datahubMapGrid">
          {datahubUsage.map((item) => (
            <article className="datahubMapCard" key={item.aspect}>
              <span>{item.aspect}</span>
              <code>{item.datahubInput}</code>
              <p>{item.agentEffect}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section shell scorecardSection" aria-labelledby="scorecard-heading">
        <p className="sectionTag">JUDGE SCORECARD</p>
        <div className="sectionIntro">
          <h2 id="scorecard-heading">The scoring case, compressed.</h2>
          <p>
            CAT is intentionally narrow: one realistic workflow, one context layer, one auditable decision loop, and inspectable proof for every claim.
          </p>
        </div>
        <div className="scorecardList">
          {judgeScorecard.map((item) => (
            <article className="scorecardItem" key={item.criterion}>
              <strong>{item.criterion}</strong>
              <p>{item.proof}</p>
              <code>{item.receipt}</code>
            </article>
          ))}
        </div>
      </section>

      <section className="section shell verifySection" aria-labelledby="verify-heading">
        <p className="sectionTag">COPY/PASTE VERIFICATION</p>
        <div className="sectionIntro">
          <h2 id="verify-heading">Three commands prove the submission path.</h2>
          <p>
            The repo is built so a judge can verify the context-before-action claim locally without accounts, credentials, or hidden services.
          </p>
        </div>
        <div className="verifyGrid">
          {verificationCommands.map((item) => (
            <article className="verifyCard" key={item.label}>
              <span>{item.label}</span>
              <code>{item.command}</code>
              <p>{item.expected}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section shell demoSection" id="demo">
        <p className="sectionTag">DEMO SLICE</p>
        <div className="sectionIntro">
          <h2>One messy workflow, made safe enough to judge.</h2>
          <p>
            The current prototype models the agent decision loop the full build will wire to DataHub: identify the dataset, read available context, detect missing fields, then choose between safe queueing and human approval.
          </p>
        </div>

        <div className="demoGrid">
          <article className="demoPanel wide">
            <div className="panelHead">
              <span>01</span>
              <h3>Messy business requests</h3>
            </div>
            <div className="miniTable" role="table" aria-label="Messy business request sample">
              <div className="miniRow miniHeader" role="row">
                {["id", "account", "request", "contact", "value", "priority", "owner"].map((heading) => (
                  <b role="columnheader" key={heading}>{heading}</b>
                ))}
              </div>
              {messyRows.map((row) => (
                <div className="miniRow" role="row" key={row[0]}>
                  {row.map((cell, index) => (
                    <span className={cell === "missing" || cell === "" || cell === "owner unknown" ? "cellWarn" : ""} role="cell" key={`${row[0]}-${index}`}>
                      {cell || "blank"}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </article>

          <article className="demoPanel">
            <div className="panelHead">
              <span>02</span>
              <h3>DataHub context read</h3>
            </div>
            <div className="signalStack">
              {contextSignals.map((signal) => (
                <div className={`signal ${signal.state}`} key={signal.label}>
                  <small>{signal.label}</small>
                  <strong>{signal.value}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="demoPanel">
            <div className="panelHead">
              <span>03</span>
              <h3>Receipt JSON</h3>
            </div>
            <pre className="receiptCode">{receiptJson}</pre>
          </article>
        </div>
      </section>

      <section className="section shell contextDelta" aria-labelledby="context-delta-heading">
        <p className="sectionTag">CONTEXT CHANGES THE DECISION</p>
        <div className="sectionIntro">
          <h2 id="context-delta-heading">Same messy row, safer outcome.</h2>
          <p>
            The demo’s core proof is not that an agent can summarize a CSV. It is that DataHub-style context changes what the agent is allowed to do next.
          </p>
        </div>
        <div className="deltaMatrix" role="table" aria-label="Decision comparison with and without DataHub context">
          <div className="deltaRow deltaHeader" role="row">
            <b role="columnheader">Request</b>
            <b role="columnheader">Without trusted context</b>
            <b role="columnheader">With DataHub context</b>
            <b role="columnheader">Signal used</b>
          </div>
          {decisionComparison.map((item) => (
            <div className="deltaRow" role="row" key={item.request}>
              <strong role="cell">{item.request}</strong>
              <span role="cell">{item.withoutContext}</span>
              <span role="cell">{item.withContext}</span>
              <code role="cell">{item.datahubSignal}</code>
            </div>
          ))}
        </div>
      </section>

      <section className="proofBar">
        <div className="shell proofGrid">
          <div><strong>Metadata first</strong><span>DataHub context grounds the agent</span></div>
          <div><strong>Human checkpoints</strong><span>Unsafe actions become questions</span></div>
          <div><strong>Receipts</strong><span>Recommendations cite their source context</span></div>
          <div><strong>Small-business demo</strong><span>Practical files, practical workflows</span></div>
        </div>
      </section>

      <section className="section shell" id="evidence">
        <p className="sectionTag">CLAIM TO EVIDENCE</p>
        <div className="sectionIntro">
          <h2>Every major claim has a thing judges can open.</h2>
          <p>
            The submission avoids hand-wavy agent claims. Each promise points to a generated artifact or proof command in the repo.
          </p>
        </div>
        <div className="evidenceMatrix" role="table" aria-label="Claim to evidence matrix">
          <div className="evidenceRow evidenceHeader" role="row">
            <b role="columnheader">Claim</b>
            <b role="columnheader">Evidence to inspect</b>
            <b role="columnheader">Artifact</b>
          </div>
          {evidenceMatrix.map((item) => (
            <div className="evidenceRow" role="row" key={item.claim}>
              <strong role="cell">{item.claim}</strong>
              <span role="cell">{item.evidence}</span>
              <a role="cell" href={item.link}>Open proof →</a>
            </div>
          ))}
        </div>
      </section>

      <section className="section shell" id="artifacts">
        <p className="sectionTag">RUNNABLE EVIDENCE</p>
        <div className="sectionIntro">
          <h2>Judges can verify the agent path from the repo.</h2>
          <p>
            The demo is intentionally reproducible without credentials: run the commands, inspect the generated artifacts, and see where DataHub context changes what the agent is allowed to do.
          </p>
        </div>
        <div className="artifactGrid">
          {runnableArtifacts.map((artifact) => (
            <article className="artifactCard" key={artifact.label}>
              <div>
                <span>{artifact.label}</span>
                <code>{artifact.command}</code>
              </div>
              <p>{artifact.text}</p>
              <a href={artifact.href}>Inspect artifact →</a>
            </article>
          ))}
        </div>
      </section>

      <section className="section shell" id="workflow">
        <p className="sectionTag">WORKFLOW</p>
        <div className="sectionIntro">
          <h2>From scattered files to safe agent work.</h2>
          <p>
            CAT is not trying to be a reckless “do everything” bot. The point is to show how DataHub context can make an agent more careful, explainable, and useful.
          </p>
        </div>
        <div className="stepGrid">
          {contextSteps.map((step, index) => (
            <article className="stepCard" key={step.title}>
              <span>0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section shell">
        <p className="sectionTag">APPROVAL QUEUE</p>
        <div className="sectionIntro">
          <h2>CAT separates safe internal work from risky action.</h2>
          <p>
            This is the “Agents That Do Real Work” part: the agent does not merely summarize data. It decides which next step is allowed, which needs approval, and which must be blocked.
          </p>
        </div>
        <div className="queueGrid">
          {approvalQueue.map((task) => (
            <article className="queueCard" key={task.item}>
              <div className="queueTop">
                <span>{task.status}</span>
                <b>{task.item}</b>
              </div>
              <h3>{task.decision}</h3>
              <p>{task.why}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section darkSection" id="receipt">
        <div className="shell receiptGrid">
          <div>
            <p className="sectionTag lime">WHAT THE DEMO WILL PROVE</p>
            <h2>An agent should explain why it is safe to act — or refuse.</h2>
            <p className="muted">
              The prototype will generate an action plan only after it reads the available DataHub context. If the context is missing, the agent produces a question or an approval task instead.
            </p>
          </div>
          <ul className="checkList">
            {demoArtifacts.map((item) => <li key={item}><span>✓</span>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="section shell" id="scope">
        <p className="sectionTag">SCOPE TRANSPARENCY</p>
        <div className="sectionIntro">
          <h2>Clear about what is real now and what comes next.</h2>
          <p>
            The current submission keeps the core agent-context contract runnable and inspectable. The live DataHub mutation path is documented as an opt-in next step, not hidden inside the demo.
          </p>
        </div>
        <div className="scopeGrid">
          {scopeCards.map((card) => (
            <article className="scopeCard" key={card.title}>
              <h3>{card.title}</h3>
              <ul>
                {card.items.map((item) => <li key={item}><span>•</span>{item}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section shell" id="faq">
        <p className="sectionTag">JUDGE FAQ</p>
        <div className="sectionIntro">
          <h2>Short answers to the reviewer questions we expect.</h2>
          <p>
            CAT is strongest when it is honest about boundaries. This section separates the runnable submission from the documented live DataHub path.
          </p>
        </div>
        <div className="faqGrid">
          {judgeFaq.map((item) => (
            <article className="faqCard" key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section shell" id="build">
        <p className="sectionTag">BUILD PLAN</p>
        <div className="sectionIntro">
          <h2>Designed for the DataHub “Agents That Do Real Work” category.</h2>
          <p>
            The submission will prioritize a focused, runnable demo over a giant platform: one messy-data scenario, one context graph, one agent decision loop, and one receipt page.
          </p>
        </div>
        <div className="trackTable" role="table" aria-label="Hackathon build plan">
          {buildTracks.map(([label, value]) => (
            <div className="trackRow" role="row" key={label}>
              <span role="cell">{label}</span>
              <strong role="cell">{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="ctaSection">
        <div className="shell ctaInner">
          <p className="sectionTag lime">NEXT MILESTONE</p>
          <h2>Wire this demo slice to a live DataHub-backed run.</h2>
          <p>
            Next up: replace the static context map with a local DataHub quickstart run, post metadata change proposals to DataHub GMS, and swap the generated context packet for live MCP / Agent Context Kit reads.
          </p>
        </div>
      </section>

      <footer className="shell footer">
        <span>CAT Context Agent</span>
        <span>Context-aware automation · DataHub hackathon submission</span>
      </footer>
    </main>
  );
}
