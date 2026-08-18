const AGENCY_PHONE = "303-909-6698";
const AGENCY_SITE = "firestarterseo.com";

// The full SEO campaign timeline — keyword map, onboarding, 30-day live date.
// Doesn't apply to General SOW / PPC-only / Website proposals, which use the
// simpler GENERAL_STEPS below (matches the generic "read it, sign it, we'll
// be in touch" copy in the real example proposals for those types).
const SEO_STEPS = [
  { title: "Sign the agreement", body: "Review the service agreement and sign digitally. 12-month initial term with 45-day written notice to cancel — no penalties, no traps." },
  { title: "Onboarding checklist sent", body: "Website access, Google Analytics, Google Business Profile. Takes about 15 minutes. We handle the rest." },
  { title: "Keyword map in two weeks", body: "Your complete discovery architecture delivered for review. Quick approval from you and the strategy is locked." },
  { title: "Full campaign live in 30 days", body: "First optimizations live, technical remediation underway, first citations submitted." },
];

const GENERAL_STEPS = [
  { title: "Review and sign", body: "Read through the agreement on the previous pages, then sign digitally when you're ready to move forward." },
  { title: "We'll be in touch", body: "As soon as we see your signature, someone from Firestarter will reach out to get things rolling." },
  { title: "Signed copy by email", body: "You'll get your own copy of the fully signed agreement for your records." },
  { title: "Questions any time", body: "Call us any time before or after signing — we're happy to walk through anything." },
];

export default function NextStepsSection({ variant = "seo" }) {
  const steps = variant === "general" ? GENERAL_STEPS : SEO_STEPS;
  return (
    <div className="sec-mid">
      <span className="eye">Next Steps</span>
      <h2 className="h2">Ready to<br /><em>Get Started?</em></h2>
      <p className="intro">Here&rsquo;s exactly what happens the moment you say go.</p>
      <div className="ns-grid">
        {steps.map((step, i) => (
          <div className="ns-c" key={i}>
            <div className="ns-num">{i + 1}</div>
            <div className="ns-body"><strong>{step.title}</strong>{step.body}</div>
          </div>
        ))}
      </div>
      <div className="cta-block">
        <div>
          <span className="cta-eye">Questions before you decide?</span>
          <div className="cta-head">Let&rsquo;s Talk Through It</div>
          <div className="cta-sub">No pressure. No pitch. Just answers.</div>
        </div>
        <div>
          <div className="cta-phone">{AGENCY_PHONE}</div>
          <div className="cta-url">{AGENCY_SITE}</div>
          <div className="cta-note">Responds within 1 business day</div>
        </div>
      </div>
    </div>
  );
}
