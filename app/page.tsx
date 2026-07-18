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
  ["Challenge", "Agents That Do Real Work"],
  ["Core platform", "DataHub OSS + MCP Server"],
  ["Agent context", "Agent Context Kit + DataHub Skills"],
  ["Demo slice", "messy CSV, context map, approval queue, receipt JSON"],
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
          <p className="eyebrow"><span /> DataHub Agent Hackathon draft</p>
          <h1>Context before action for messy business data.</h1>
          <p className="heroLead">
            CAT Context Agent is a DataHub-backed workflow agent that helps small teams turn scattered files into trusted next steps, missing-info questions, and traceable receipts.
          </p>
          <div className="heroActions">
            <a className="button primary" href="#workflow">See the workflow</a>
            <a className="button ghost" href="#receipt">View the receipt model</a>
          </div>
          <p className="micro">
            Submission foundation is live. This page now includes the first concrete demo slice: sample messy data, DataHub-style context, an approval queue, and receipt output.
          </p>
        </div>

        <div className="contextCard" aria-label="Example context receipt">
          <div className="contextHead">
            <span>AGENT RECEIPT</span>
            <span className="status"><i /> DRAFT</span>
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

      <section className="proofBar">
        <div className="shell proofGrid">
          <div><strong>Metadata first</strong><span>DataHub context grounds the agent</span></div>
          <div><strong>Human checkpoints</strong><span>Unsafe actions become questions</span></div>
          <div><strong>Receipts</strong><span>Recommendations cite their source context</span></div>
          <div><strong>Small-business demo</strong><span>Practical files, practical workflows</span></div>
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
            Next up: replace the static context map with a local DataHub quickstart run, add generated example artifacts, and record the final under-3-minute walkthrough.
          </p>
        </div>
      </section>

      <footer className="shell footer">
        <span>CAT Context Agent</span>
        <span>Context-aware automation · DataHub hackathon draft</span>
      </footer>
    </main>
  );
}
