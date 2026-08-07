const AGENCY_PHONE = "303-909-6698";
const AGENCY_SITE = "firestarterseo.com";

export default function NextStepsSection() {
  return (
    <div className="sec-mid">
      <span className="eye">Next Steps</span>
      <h2 className="h2">Ready to<br /><em>Get Started?</em></h2>
      <p className="intro">Here&rsquo;s exactly what happens the moment you say go.</p>
      <div className="ns-grid">
        <div className="ns-c"><div className="ns-num">1</div><div className="ns-body"><strong>Sign the agreement</strong>Review the service agreement and sign digitally. 12-month initial term with 45-day written notice to cancel &mdash; no penalties, no traps.</div></div>
        <div className="ns-c"><div className="ns-num">2</div><div className="ns-body"><strong>Onboarding checklist sent</strong>Website access, Google Analytics, Google Business Profile. Takes about 15 minutes. We handle the rest.</div></div>
        <div className="ns-c"><div className="ns-num">3</div><div className="ns-body"><strong>Keyword map in two weeks</strong>Your complete discovery architecture delivered for review. Quick approval from you and the strategy is locked.</div></div>
        <div className="ns-c"><div className="ns-num">4</div><div className="ns-body"><strong>Full campaign live in 30 days</strong>First optimizations live, technical remediation underway, first citations submitted.</div></div>
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
