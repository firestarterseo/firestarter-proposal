// Fixed Discover/Design/Develop/Deliver process, verbatim from the real
// "Brothers BBQ Website" example proposal — Website type only (see
// lib/proposalTypes.js usesWebsitePlaybook). Not proposal-specific per the
// same "standardize fixed methodology copy" convention used elsewhere
// (StrategySection, NextStepsSection, etc.) — docs/proposal-types-questionnaire.md
// B2 flags this as still needing Kyle's confirmation either way.

const STEPS = [
  { title: "Discover", desc: "Gain insight into how many design layouts, technical and site functionality, including integrations with 3rd party integrations, domain name and hosting considerations." },
  { title: "Design", desc: "Create website mockups at flat visuals using insights gathered from discovery." },
  { title: "Develop", desc: "Develop design concepts into a functional backend and frontend WordPress website, including any necessary functionality, forms, integrations, etc." },
  { title: "Deliver", desc: "Testing and launch to live environment." },
];

export default function WebsitePlaybookSection() {
  return (
    <div className="sec-mid">
      <span className="eye">Web Design That Converts</span>
      <h2 className="h2">How We&rsquo;ll<br /><em>Get There</em></h2>
      <div className="tl">
        {STEPS.map((step, i) => (
          <div className="tl-item" key={step.title}>
            <div className="tl-l"><div className="tl-dot" /><div className="tl-line-v" /></div>
            <div className="tl-body">
              <div className="tl-per">Step {i + 1}</div>
              <div className="tl-title">{step.title}</div>
              <div className="tl-desc">{step.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
