const leaks = [
  ["Lead-path failures", "Forms, call buttons, chat, inventory links, booking flows, and every handoff that can quietly lose a buyer."],
  ["Mobile friction", "Tiny targets, buried calls to action, dead ends, slow decisions, and steps that feel fine on desktop but fail on a phone."],
  ["Follow-up gaps", "What happens after the click: confirmations, routing, response expectations, and whether the prospect knows what to do next."],
];

const deliverables = [
  "Every tested path logged with evidence",
  "Revenue severity: critical, high, medium, or low",
  "Expected result versus what actually happened",
  "A fix-first list ordered by likely business impact",
  "A plain-language owner summary—no technical fog",
  "A retest receipt after the important fixes land",
];

const plans = [
  {
    name: "3-Leak Preview",
    price: "$0",
    note: "A fast proof before you buy",
    items: ["One public customer journey", "Up to three verified leaks", "Short owner-ready summary"],
    cta: "Reply “3 LEAKS”",
  },
  {
    name: "Revenue Leak Scan",
    price: "$249",
    note: "Fastest path to a useful fix list",
    items: ["Up to 25 visible controls", "Desktop + mobile path", "Evidence report", "Priority repair list"],
    cta: "Reply “SCAN”",
    featured: true,
  },
  {
    name: "Full Revenue Audit",
    price: "$749",
    note: "For businesses buying traffic now",
    items: ["All primary lead paths", "Google-to-site journey", "Three viewport checks", "Video walkthrough", "One fix retest"],
    cta: "Reply “FULL AUDIT”",
  },
];

export default function Home() {
  return (
    <main>
      <nav className="nav shell" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Revenue Leak Audit home">
          <span className="brandMark">R</span>
          <span>Revenue Leak Audit</span>
        </a>
        <a className="navCta" href="#pricing">Find the leaks</a>
      </nav>

      <section className="hero shell" id="top">
        <div className="heroCopy">
          <p className="eyebrow"><span /> Built for dealerships and local businesses</p>
          <h1>Your website may be <em>losing buyers</em> before your team ever sees them.</h1>
          <p className="heroLead">We physically test every important click, call, form, and follow-up path—then show you exactly where revenue is leaking and what to fix first.</p>
          <div className="heroActions">
            <a className="button primary" href="#pricing">Get a 3-leak preview</a>
            <a className="button ghost" href="#process">See what gets tested</a>
          </div>
          <p className="micro">No access required for the preview. No vague 80-page report. No sales guarantee—just evidence and prioritized fixes.</p>
        </div>
        <div className="signalCard" aria-label="Example revenue leak report">
          <div className="signalHead">
            <span>LIVE PATH CHECK</span>
            <span className="live"><i /> IN PROGRESS</span>
          </div>
          <div className="path"><b>Google listing</b><span>→</span><b>Inventory</b><span>→</span><b>Lead form</b></div>
          <div className="finding critical"><span>01</span><div><small>CRITICAL LEAK</small><strong>Mobile “Check Availability” returns no visible confirmation</strong></div></div>
          <div className="finding high"><span>02</span><div><small>HIGH-FRICTION</small><strong>Call button disappears after the first inventory step</strong></div></div>
          <div className="finding medium"><span>03</span><div><small>FOLLOW-UP GAP</small><strong>Customer is never told when a response should arrive</strong></div></div>
          <div className="impact"><span>First repair target</span><strong>Lead confirmation + routing</strong><em>FIX FIRST</em></div>
        </div>
      </section>

      <section className="proofBar">
        <div className="shell proofGrid">
          <div><strong>Every button</strong><span>physically checked</span></div>
          <div><strong>Every failure</strong><span>backed by evidence</span></div>
          <div><strong>Every fix</strong><span>ranked by revenue risk</span></div>
          <div><strong>Every retest</strong><span>closed with a receipt</span></div>
        </div>
      </section>

      <section className="section shell" id="process">
        <p className="sectionTag">WHAT WE FIND</p>
        <div className="sectionIntro">
          <h2>Traffic is expensive. Broken handoffs make it worthless.</h2>
          <p>This is a buyer-journey audit, not a design critique. We follow the paths a real customer takes and document where intent gets lost.</p>
        </div>
        <div className="leakGrid">
          {leaks.map(([title, text], index) => (
            <article className="leakCard" key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section darkSection">
        <div className="shell reportGrid">
          <div>
            <p className="sectionTag lime">WHAT YOU RECEIVE</p>
            <h2>A repair order for your customer journey.</h2>
            <p className="muted">Your team gets a clean, practical report they can act on immediately. Owners see the money risk. Builders see the exact path to retest.</p>
          </div>
          <ul className="checkList">
            {deliverables.map((item) => <li key={item}><span>✓</span>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="section shell" id="pricing">
        <p className="sectionTag">START SMALL. PROVE VALUE. FIX THE MONEY PATH.</p>
        <div className="sectionIntro pricingIntro">
          <h2>Choose how deep we go.</h2>
          <p>The free preview is intentionally small. If the first three findings are useful, move into a complete scan.</p>
        </div>
        <div className="pricingGrid">
          {plans.map((plan) => (
            <article className={`priceCard ${plan.featured ? "featured" : ""}`} key={plan.name}>
              {plan.featured && <div className="popular">BEST FIRST PAID STEP</div>}
              <h3>{plan.name}</h3>
              <div className="price">{plan.price}</div>
              <p>{plan.note}</p>
              <ul>{plan.items.map((item) => <li key={item}>✓ {item}</li>)}</ul>
              <a className={`button ${plan.featured ? "primary" : "ghost"}`} href="#start">{plan.cta}</a>
            </article>
          ))}
        </div>
        <div className="monitor"><div><span>KEEP IT CLEAN</span><strong>Weekly Monitoring · $299/month</strong></div><p>One scheduled buyer-path check each week, change alerts, and a monthly owner summary.</p></div>
      </section>

      <section className="ctaSection" id="start">
        <div className="shell ctaInner">
          <p className="sectionTag lime">THE NEXT MOVE</p>
          <h2>Let’s find the first three leaks.</h2>
          <p>Reply <strong>3 LEAKS</strong> to the person who sent you this page with your business name and website. You’ll get a short evidence-backed preview—no login required.</p>
          <a className="button primary large" href="#top">Start with the preview</a>
        </div>
      </section>

      <footer className="shell footer"><span>Revenue Leak Audit</span><span>Evidence first · Fix what costs money</span></footer>
    </main>
  );
}
