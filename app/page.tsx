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
  ["Submission goal", "public repo, runnable demo, under-3-minute video"],
];

export default function Home() {
  return (
    <main>
      <nav className="nav shell" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="CAT Context Agent home">
          <span className="brandMark">CAT</span>
          <span>Context Agent</span>
        </a>
        <a className="navCta" href="#build">Hackathon build</a>
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
            This is an early submission shell for Build with DataHub: The Agent Hackathon. Repo, demo, screenshots, and video will be attached as the prototype is built.
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

      <section className="section darkSection" id="receipt">
        <div className="shell receiptGrid">
          <div>
            <p className="sectionTag lime">WHAT THE DEMO WILL PROVE</p>
            <h2>An agent should explain why it is safe to act.</h2>
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
          <h2>Build the smallest credible receipt-backed workflow.</h2>
          <p>
            Next up: create the public GitHub repo, add the Apache 2.0 license, wire sample data into the prototype, and replace this draft page with a working demo.
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
