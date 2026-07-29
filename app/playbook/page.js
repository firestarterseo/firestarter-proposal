import SignOutButton from "../../components/SignOutButton";

const FORMULA = [
  { pillars: "Pillars S + O", title: "A data pattern only they have", desc: "Something in their own numbers: seasonality, demand timing, service or product mix, customer behavior." },
  { pillars: "Pillar U", title: "An asset built from it", desc: "A benchmark, pricing guide, or report that answers a real buyer question — “what does X cost,” “when should I book X.”" },
  { pillars: "Pillars U + C", title: "Proof via named case studies", desc: "Specific, named, verifiable outcomes — never a generic testimonial." },
  { pillars: "Pillars C + E", title: "Ongoing citation tracking vs. named competitors", desc: "Pull the actual competitor names straight from that proposal’s Gap Analysis section — never “your competitors” generically." },
];

const PILLARS = [
  { letter: "S", name: "Source Data", goal: "What do they already have", questions: [
    "What tracks your calls or leads? CallRail, a CRM, scheduling software?",
    "How long has the business run, and roughly how many jobs / patients / cases has it seen?",
    "Do you have GBP insights, GA4/GSC history, or review data going back a while?",
  ] },
  { letter: "O", name: "Original Insights", goal: "What pattern is hiding in it", questions: [
    "Is there a busy season, or a spike tied to weather, timing, or an event?",
    "Do certain services or practice areas spike in certain markets or months?",
    "What’s the #1 thing people ask before they buy?",
  ] },
  { letter: "U", name: "Unique Assets", goal: "What asset would that become", questions: [
    "Would a “what does X cost in [city]” guide get searched for here?",
    "Are there specific projects, patients, or customers willing to be named?",
  ] },
  { letter: "R", name: "Reinforcement", goal: "Where else could this live", questions: [
    "Open to being quoted in press, partner content, or community platforms like Reddit/Quora?",
  ] },
  { letter: "C", name: "Citations", goal: "Who are we measuring against", questions: [
    "Who are your 2–3 named competitors? (Already in the proposal’s Gap Analysis — reuse it, don’t re-ask.)",
  ] },
  { letter: "E", name: "Expansion", goal: "Does this get refreshed", questions: [
    "Open to an annual refresh of this data or report?",
  ] },
];

const INDUSTRIES = [
  ["Aerospace", "Certification/turnaround times, contract win history", "Certification lead-time benchmark vs. industry norms"],
  ["Business Services", "Onboarding time, retention/renewal data", "Client-outcomes benchmark by engagement type"],
  ["Dental", "Scheduling data, insurance mix, intake seasonality", "Patient intake-seasonality study (e.g. January new-patient surge)"],
  ["E-Commerce", "Order data, return rates, SKU velocity", "Category demand-seasonality report"],
  ["Education", "Enrollment cycles, inquiry-to-enrollment timing", "Enrollment-funnel timing study"],
  ["Franchise", "Cross-location performance, territory demand", "Aggregate location-performance benchmark"],
  ["Healthcare", "Scheduling/referral data, seasonal condition trends", "Referral-source and seasonal-visit study"],
  ["Home Services", "CallRail/CRM job history, seasonal service mix", "Seasonal demand study (the sample pergola bullet)"],
  ["Law Firm", "Case-type intake volume, consult-to-retention data", "Practice-area demand benchmark by season"],
  ["Med Spa", "Treatment booking data, seasonal treatment mix", "Treatment-seasonality and pricing guide"],
  ["Non-Profit", "Donor/volunteer engagement, campaign response timing", "Donor-engagement timing study"],
  ["Small Business", "Whatever CRM/POS exists — traffic, repeat-customer rate", "Customer-behavior benchmark tailored to their vertical"],
  ["Travel", "Booking lead-time, seasonal destination demand", "Booking-window and demand-seasonality report"],
];

const EXAMPLES = [
  { industry: "Dental", bad: "We’ll create content that highlights your expertise and helps you get found online.", good: "Patient intake-seasonality study — your scheduling data shows a January new-patient surge and a pre-summer whitening spike. Published as original research, cited when local buyers ask “best time to book a dental cleaning.”" },
  { industry: "Law Firm", bad: "We’ll publish case studies to build trust with potential clients.", good: "Case outcomes by practice area — three named, verifiable results (with client permission) in [practice area]. AI systems weight named, verifiable outcomes over generic testimonials." },
  { industry: "E-Commerce", bad: "We’ll track your brand mentions across AI platforms.", good: "Monthly citation tracking vs. [Competitor A] and [Competitor B] — how often your product pages get pulled into ChatGPT and Google AI Overview shopping answers." },
];

export default function PlaybookPage() {
  return (
    <div className="page">
      <div className="brand-bar">
        <img src="/firestarter-logo.png" alt="Firestarter SEO" className="brand-logo" />
        <span className="brand-tagline">Proposals</span>
        <div className="spacer" />
        <nav>
          <a className="brand-link" href="/">Dashboard</a>
          <a className="brand-link" href="/catalog">Catalog</a>
          <SignOutButton />
        </nav>
      </div>

      <h1>SOURCE&trade; Playbook</h1>
      <p className="subtitle">
        How to turn the six SOURCE&trade; pillars into four confident, client-specific callout bullets
        for the &ldquo;What SOURCE&trade; Means for [Client]&rdquo; section of a proposal &mdash; for any
        industry, with no fixed template to lean on.
      </p>

      <div className="soft-card" style={{ padding: 24, marginBottom: 28 }}>
        <div className="section-label">Why this isn&rsquo;t templated</div>
        <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.7, margin: 0, maxWidth: "70ch" }}>
          Those four bullets are deliberately free text, not a fixed template, because the whole SOURCE&trade;
          pitch is <em>&ldquo;we find what&rsquo;s unique about your business&rdquo;</em> &mdash; a templated
          bullet undercuts that on the spot. This page gives you the recipe and the questions to ask, not
          words to copy-paste.
        </p>
      </div>

      <div className="section-label">The 4-bullet formula</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
        {FORMULA.map((f, i) => (
          <div className="soft-card playbook-formula-row" key={i}>
            <div className="playbook-num">{i + 1}</div>
            <div>
              <div className="playbook-pillars">{f.pillars}</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{f.title}</div>
              <div style={{ fontSize: 13.5, color: "var(--muted)" }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-label">Discovery questions, by pillar</div>
      <div className="playbook-grid" style={{ marginBottom: 32 }}>
        {PILLARS.map((p) => (
          <div className="soft-card" style={{ padding: "18px 20px" }} key={p.letter}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div className="playbook-letter">{p.letter}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{p.goal}</div>
              </div>
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13 }}>
              {p.questions.map((q, i) => <li key={i} style={{ marginBottom: 6 }}>{q}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <div className="section-label">Industry quick reference</div>
      <div className="soft-card" style={{ overflowX: "auto", marginBottom: 32 }}>
        <table>
          <thead>
            <tr><th>Industry</th><th>Likely data source</th><th>Example angle (bullet 1)</th></tr>
          </thead>
          <tbody>
            {INDUSTRIES.map(([industry, source, angle]) => (
              <tr key={industry}>
                <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{industry}</td>
                <td>{source}</td>
                <td>{angle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section-label">Before / after</div>
      <div style={{ marginBottom: 32 }}>
        {EXAMPLES.map((ex) => (
          <div className="soft-card" style={{ padding: "18px 20px", marginBottom: 14 }} key={ex.industry}>
            <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 4 }}>
              {ex.industry}
            </div>
            <div className="playbook-line playbook-bad"><span className="tag">Weak</span><span>{ex.bad}</span></div>
            <div className="playbook-line playbook-good"><span className="tag">Specific</span><span>{ex.good}</span></div>
          </div>
        ))}
      </div>

      <div className="section-label">Do / don&rsquo;t</div>
      <div className="playbook-grid">
        <div className="soft-card playbook-do">
          <div className="playbook-dd-head">Do</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5 }}>
            <li style={{ marginBottom: 8 }}>Name the actual data source the client has — CallRail, CRM, POS, scheduling software, GA4/GSC, GBP.</li>
            <li style={{ marginBottom: 8 }}>Name their real competitors, pulled straight from that proposal&rsquo;s Gap Analysis list.</li>
            <li style={{ marginBottom: 8 }}>Keep each bullet to one sentence of &ldquo;what&rdquo; plus one sentence of &ldquo;why it matters to AI/buyers.&rdquo;</li>
            <li>Ground pricing/benchmark bullets in a real buyer question.</li>
          </ul>
        </div>
        <div className="soft-card playbook-dont">
          <div className="playbook-dd-head">Don&rsquo;t</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5 }}>
            <li style={{ marginBottom: 8 }}>Write a bullet that could apply to literally any client.</li>
            <li style={{ marginBottom: 8 }}>Invent data the client hasn&rsquo;t confirmed they track — ask first.</li>
            <li style={{ marginBottom: 8 }}>Skip bullet 4, or leave the competitors generic.</li>
            <li>Reuse the sample pergola/landscape bullets verbatim — they&rsquo;re an example of the pattern, not copy.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
