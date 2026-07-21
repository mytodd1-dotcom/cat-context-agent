import packet from "../evidence/live-datahub-remediation.json";

const repo = "https://github.com/mytodd1-dotcom/cat-context-agent";
const field = packet.finding.missing_descriptions[0];

export default function Home() {
  return (
    <main>
      <nav className="nav shell">
        <a className="brand" href="#proof"><span className="brandMark">CAT</span> Schema Remediation Agent</a>
        <div className="navLinks"><a href="#proof">Live proof</a><a href="#plan">Plan</a><a href="#verify">Verify</a></div>
        <a className="navCta" href={repo}>Open repo ↗</a>
      </nav>

      <section className="hero shell">
        <div>
          <p className="eyebrow"><span /> DATAHUB AGENT HACKATHON REBUILD</p>
          <h1>Fix the metadata that makes an agent unsafe to trust.</h1>
          <p className="heroLead">
            CAT reads a real DataHub catalog through the official MCP server, finds the smallest blocking metadata gap, traces its lineage, and prepares one human-approved remediation.
          </p>
          <div className="heroActions">
            <a className="button primary" href="#proof">See the live evidence</a>
            <a className="button dark" href="#verify">Run the proof command</a>
          </div>
          <p className="micro">Real local stack: DataHub OSS + <b>{packet.mcp_server}</b>. No simulated MCP adapter is used in this proof.</p>
        </div>

        <aside className="contextCard" aria-label="Live DataHub MCP finding">
          <div className="contextHead"><span>OFFICIAL MCP READ</span><span className="status"><i /> COMPLETE</span></div>
          <div className="assetPath"><span>DATASET</span><b>{packet.datahub.dataset}</b></div>
          <div className="receiptItem warning"><small>METADATA GAP</small><strong>{field.field_path} has no description</strong></div>
          <div className="receiptItem"><small>LINEAGE READ</small><strong>{packet.datahub.upstreams[0]?.name} → {packet.datahub.dataset}</strong></div>
          <div className="receiptItem strong"><small>SAFE NEXT MOVE</small><strong>Prepare one description update for human approval.</strong></div>
        </aside>
      </section>

      <section id="proof" className="section shell">
        <p className="sectionTag">LIVE EVIDENCE SNAPSHOT</p>
        <div className="sectionIntro"><h2>One dataset. One missing definition. One bounded fix.</h2><p>This snapshot was generated from the local DataHub OSS catalog by official MCP reads of entity metadata, schema fields, and upstream lineage.</p></div>
        <div className="proofFlow">
          <article><span>01</span><h3>Read</h3><p>Get entity + schema fields from DataHub.</p><code>{packet.datahub.urn}</code></article>
          <article><span>02</span><h3>Locate</h3><p>The tool found a field with no definition.</p><strong>{field.field_path} · {field.native_type}</strong></article>
          <article><span>03</span><h3>Trace</h3><p>Check the immediate upstream impact context.</p><strong>{packet.datahub.upstreams[0]?.name}</strong></article>
          <article><span>04</span><h3>Propose</h3><p>Prepare a precise metadata change. Do not write it yet.</p><strong>Human approval required</strong></article>
        </div>
      </section>

      <section id="plan" className="section darkSection">
        <div className="shell remediationGrid">
          <div><p className="sectionTag lime">REMEDIATION PACKET</p><h2>Small enough to approve. Useful enough to ship.</h2><p className="muted">CAT does not pretend it knows the business definition. It creates a draft and makes the owner’s decision explicit.</p></div>
          <article className="planCard"><small>PROPOSED DESCRIPTION FOR <b>{packet.proposed_remediation.target_field}</b></small><blockquote>“{packet.proposed_remediation.draft_description}”</blockquote><ul>{packet.proposed_remediation.acceptance_checks.map((check) => <li key={check}>✓ {check}</li>)}</ul></article>
        </div>
      </section>

      <section className="section shell" id="verify">
        <p className="sectionTag">REPRODUCIBLE, NOT THEATRICAL</p>
        <div className="sectionIntro"><h2>Refresh the evidence against local DataHub.</h2><p>The command seeds the controlled catalog, calls the official MCP server, and writes the snapshot used above.</p></div>
        <div className="verifyGrid">
          <article><span>1</span><code>python scripts/seed-datahub-remediation-demo.py</code><p>Creates the two demo datasets and their lineage in local DataHub.</p></article>
          <article><span>2</span><code>npm run datahub:remediation:live</code><p>Runs official MCP reads and regenerates the evidence packet.</p></article>
          <article><span>3</span><code>npm run build</code><p>Builds this site with the refreshed, inspectable proof snapshot.</p></article>
        </div>
        <p className="safetyNote">{packet.safety_boundary}</p>
      </section>

      <footer className="shell footer"><span>CAT Schema Remediation Agent</span><span>DataHub OSS · Official MCP · approval-gated writes</span></footer>
    </main>
  );
}
