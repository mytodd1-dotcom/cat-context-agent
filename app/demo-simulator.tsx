"use client";

import { useMemo, useState } from "react";

const simulatorCases = [
  {
    id: "REQ-1042",
    account: "Acme HVAC",
    request: "renewal follow-up",
    sourceRow: "REQ-1042, Acme HVAC, renewal follow-up, renewals@acme.example, USD 8,400, high, owner unknown",
    decision: "Needs human approval",
    tone: "approval",
    confidence: "0.78",
    datahubSignals: [
      ["Dataset", "urn:li:dataset:(cat,messy_business_requests,PROD)"],
      ["Schema", "contact mapped; owner low confidence"],
      ["Ownership", "contact owner missing"],
      ["Policy", "external outreach requires verified owner + approval"],
    ],
    safeNextStep: "Ask for the missing customer contact owner before creating any follow-up task.",
    blockedAction: "Do not send external renewal outreach yet.",
  },
  {
    id: "REQ-1043",
    account: "Northline Dental",
    request: "invoice mismatch",
    sourceRow: "REQ-1043, Northline Dental, invoice mismatch, ap@northline.example, USD 1,280, medium, finance",
    decision: "Safe to queue",
    tone: "safe",
    confidence: "0.91",
    datahubSignals: [
      ["Dataset", "urn:li:dataset:(cat,messy_business_requests,PROD)"],
      ["Schema", "invoice fields and contact mapped"],
      ["Ownership", "finance owner present"],
      ["Policy", "internal review task is allowed without customer outreach"],
    ],
    safeNextStep: "Create an internal finance review task with the original row attached.",
    blockedAction: "No customer-facing message is needed for the first step.",
  },
  {
    id: "REQ-1044",
    account: "Cedar Auto",
    request: "churn risk",
    sourceRow: "REQ-1044, Cedar Auto, churn risk, blank contact, USD 3,100, high, success",
    decision: "Blocked",
    tone: "blocked",
    confidence: "0.64",
    datahubSignals: [
      ["Dataset", "urn:li:dataset:(cat,messy_business_requests,PROD)"],
      ["Schema", "contact field blank"],
      ["Ownership", "success owner present, customer contact missing"],
      ["Policy", "do not guess, scrape, or invent contact details"],
    ],
    safeNextStep: "Ask the success owner to supply a verified contact or mark the record incomplete.",
    blockedAction: "Do not scrape, guess, or infer a customer contact.",
  },
];

export default function DemoSimulator() {
  const [activeId, setActiveId] = useState(simulatorCases[0].id);
  const activeCase = useMemo(
    () => simulatorCases.find((item) => item.id === activeId) ?? simulatorCases[0],
    [activeId],
  );

  const receipt = {
    receipt_id: `cat-demo-${activeCase.id}`,
    source_asset: "urn:li:dataset:(cat,messy_business_requests,PROD)",
    context_checked: ["dataset identity", "schema", "ownership", "policy"],
    decision: activeCase.decision.toLowerCase().replaceAll(" ", "_"),
    safe_next_step: activeCase.safeNextStep,
    blocked_action: activeCase.blockedAction,
    confidence: activeCase.confidence,
  };

  return (
    <section className="section shell simulatorSection" aria-labelledby="simulator-heading">
      <p className="sectionTag">INTERACTIVE JUDGE SIMULATOR</p>
      <div className="sectionIntro">
        <h2 id="simulator-heading">Pick a messy request and watch the guardrail move.</h2>
        <p>
          This is the CAT behavior in miniature: DataHub-style context changes whether the agent queues work, asks for approval, or refuses a risky action.
        </p>
      </div>

      <div className="simulatorGrid">
        <div className="simulatorPicker" aria-label="Choose a sample request">
          {simulatorCases.map((item) => (
            <button
              className={item.id === activeCase.id ? "active" : ""}
              key={item.id}
              onClick={() => setActiveId(item.id)}
              type="button"
            >
              <span>{item.id}</span>
              <strong>{item.account}</strong>
              <small>{item.request}</small>
            </button>
          ))}
        </div>

        <article className={`simulatorResult ${activeCase.tone}`}>
          <div className="resultTop">
            <div>
              <span>Current decision</span>
              <h3>{activeCase.decision}</h3>
            </div>
            <b>{activeCase.confidence} confidence</b>
          </div>

          <div className="sourceRow">
            <small>Source row</small>
            <code>{activeCase.sourceRow}</code>
          </div>

          <div className="signalList">
            {activeCase.datahubSignals.map(([label, value]) => (
              <div key={`${activeCase.id}-${label}`}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>

          <div className="nextStepGrid">
            <div>
              <small>Safe next step</small>
              <p>{activeCase.safeNextStep}</p>
            </div>
            <div>
              <small>Blocked action</small>
              <p>{activeCase.blockedAction}</p>
            </div>
          </div>

          <pre className="simulatorReceipt">{JSON.stringify(receipt, null, 2)}</pre>
        </article>
      </div>
    </section>
  );
}
