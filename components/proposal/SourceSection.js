// SOURCE™ methodology copy (the intro, the six pillars, the contrast table)
// is fixed agency-wide content. Only the closing "what SOURCE™ means for
// [client]" callout is per-proposal (data.sourceCalloutBullets).

const PILLARS = [
  { letter: "S", num: "01", title: "Source Data", goal: "Find what competitors don’t have", desc: "Identify proprietary data already inside your business — call tracking, CRM, service history, analytics. Most businesses have months of project data, seasonal demand patterns, and customer behavior signals no competitor can replicate.", tags: ["CallRail data", "CRM history", "GA4 & GSC", "GBP insights"] },
  { letter: "O", num: "02", title: "Original Insights", goal: "Transform data into findings worth citing", desc: "Analyze data to uncover trends no competitor can replicate — seasonality patterns, demand benchmarks, project cost studies. The analysis layer is what makes findings citable by AI systems, journalists, and industry publications.", tags: ["Seasonality", "Demand patterns", "Cost benchmarks", "Weather correlations"] },
  { letter: "U", num: "03", title: "Unique Assets", goal: "Create content worth citing", desc: "Package insights into authoritative assets — research reports, benchmark studies, pricing guides, case studies with named outcomes. One cornerstone asset per quarter, built with full schema markup and transparent methodology.", tags: ["Research reports", "Benchmark studies", "Pricing guides", "Case studies"] },
  { letter: "R", num: "04", title: "Reinforcement", goal: "Create multiple independent references", desc: "Publishing is not enough. AI systems weight content confirmed across multiple trusted, independent sources far more heavily than single-source content. One asset becomes 20+ references across PR, partner sites, LinkedIn, Reddit, and industry publications.", tags: ["PR & earned media", "Reddit / Quora", "Partner networks", "LinkedIn articles"] },
  { letter: "C", num: "05", title: "Citations", goal: "Become the source others reference", desc: "Earn references from AI engines, journalists, bloggers, and industry partners. We track citation frequency across ChatGPT, Gemini, Perplexity, and Google AI Overviews monthly — reporting citation share vs. your top competitors.", tags: ["AI engine citations", "Branded search", "Journalist refs", "Industry mentions"] },
  { letter: "E", num: "06", title: "Expansion", goal: "Compound authority over time", desc: "One research report becomes the foundation for compounding authority — 10 blog posts, 20 social assets, sales tools, and annual data refreshes. Businesses that execute Expansion become the permanent reference in their category.", tags: ["Blog post series", "Social content", "Sales tools", "Annual refresh"] },
];

export default function SourceSection({ data }) {
  return (
    <>
      <div className="sec-brand">
        <div style={{ fontFamily: '"Fjalla One",sans-serif', fontSize: 48, textTransform: "uppercase", lineHeight: 0.95, color: "#fff", marginBottom: 6 }}>
          BECOME THE <em style={{ color: "#F48020", fontStyle: "normal" }}>SOURCE.</em>
        </div>
        <div style={{ fontFamily: '"Fjalla One",sans-serif', fontSize: 22, textTransform: "uppercase", color: "#444", letterSpacing: "0.04em", marginBottom: 24 }}>
          Not Just an Answer.
        </div>
        <p className="intro-lt">
          Every agency is now claiming &ldquo;AI optimization.&rdquo; Most are rewriting content, adding
          structured data, and hoping. SOURCE&trade; is different &mdash; the only GEO methodology built on
          extracting the original data AI systems cite in the first place. Built from 150+ active campaigns.
          Each pillar independently scorable.
        </p>

        <span className="sec-label-lt">Why GEO Is Non-Negotiable</span>
        <div className="geo-stats">
          <div className="gs-cell"><div className="gs-num">58%</div><div className="gs-label">of Google searches now end without a click &mdash; AI answers before anyone reaches your site</div></div>
          <div className="gs-cell"><div className="gs-num">1B+</div><div className="gs-label">ChatGPT users globally making buying decisions through AI chat every day</div></div>
          <div className="gs-cell"><div className="gs-num">47%</div><div className="gs-label">of AI Overview citations go to the top-3 organic results &mdash; authority and rank are now the same signal</div></div>
        </div>

        <span className="sec-label-lt">What Everyone Else Does vs. What SOURCE&trade; Does</span>
        <div className="contrast">
          <div className="ct-head bad">What other agencies do</div>
          <div className="ct-head good">What SOURCE&trade; does</div>
          <div className="ct-cell bad">&ldquo;How do we rank for this keyword?&rdquo;</div>
          <div className="ct-cell good"><strong>What information can only you publish?</strong></div>
          <div className="ct-cell bad">&ldquo;Become another answer in AI responses.&rdquo;</div>
          <div className="ct-cell good"><strong>Become the source AI references when answering.</strong></div>
          <div className="ct-cell bad">&ldquo;Your brand appeared in 14 AI responses.&rdquo;</div>
          <div className="ct-cell good"><strong>AI citations that generate calls and booked jobs.</strong></div>
          <div className="ct-cell bad">&ldquo;Rewrite content. Add structured data. Hope.&rdquo;</div>
          <div className="ct-cell good"><strong>Extract your data. Build original research. Distribute until AI can&rsquo;t ignore you.</strong></div>
        </div>
      </div>

      <div className="sec">
        <span className="eye">SOURCE&trade; &mdash; Six Pillars</span>
        <div style={{ fontFamily: '"Fjalla One",sans-serif', fontSize: 32, textTransform: "uppercase", color: "var(--text)", lineHeight: 1, marginBottom: 6 }}>
          Six Pillars That Turn Your <em style={{ color: "#F48020", fontStyle: "normal" }}>Business Data</em> Into Undeniable Authority
        </div>
        <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.7, maxWidth: 600, marginBottom: 0 }}>
          Most businesses are sitting on 12&ndash;24 months of citable data they don&rsquo;t realize is
          research-grade. SOURCE&trade; starts by finding it &mdash; then turning it into assets AI systems,
          journalists, and industry publications want to reference.
        </p>
        <div className="pillars-grid">
          {PILLARS.map((p) => (
            <div className="pillar-card" key={p.num}>
              <div className="pc-head">
                <div>
                  <div className="pc-num">Pillar {p.num}</div>
                  <div className="pc-title">{p.title}</div>
                  <div className="pc-goal">{p.goal}</div>
                </div>
                <div className="pc-letter">{p.letter}</div>
              </div>
              <div className="pc-body">
                <div className="pc-desc">{p.desc}</div>
                <div className="pc-tags">
                  {p.tags.map((t) => <span className="pc-tag" key={t}>{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="source-callout">
          <div className="sc-stat"><div className="sc-num">150+</div><div className="sc-label">Active campaigns SOURCE&trade; is built from &mdash; real lead, call, and revenue data</div></div>
          <div className="sc-div" />
          <div className="sc-stat"><div className="sc-num">6</div><div className="sc-label">Independently scorable pillars, each with a defined implementation protocol</div></div>
          <div className="sc-div" />
          <div className="sc-stat"><div className="sc-num">4.2&times;</div><div className="sc-label">More AI citations for sites publishing original case study data vs. generic content</div></div>
        </div>

        {data.sourceCalloutBullets && data.sourceCalloutBullets.length > 0 && (
          <div className="tiol-box">
            <span className="tiol-eye">What SOURCE&trade; Means for {data.clientCompanyName}</span>
            <div className="tiol-head">Your Business Data Is Already Research-Grade. We Unlock It.</div>
            <div className="tiol-items">
              {data.sourceCalloutBullets.map((b, i) => (
                <div className="tiol-item" key={i}>
                  <div className="tiol-dot" />
                  <div className="tiol-text"><strong>{b.title}</strong>{b.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
