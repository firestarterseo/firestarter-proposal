// Layer/methodology copy here is fixed agency-wide content (see plan: "mostly
// fixed, light edits"). The only per-client content is each channel's
// strategyNote (data.channelCards[i].strategyNote) and the case studies picked
// from the catalog.

// Order must match data.channelCards (organic, aiOverviews, localMaps, aeoLlm, googleAds).
const CHANNEL_LABELS = ["Organic SEO", "AI Overviews", "Local / Maps Pack", "AEO / LLM Citations", "Google Ads — Capture Demand While Organic Builds"];

export default function StrategySection({ data }) {
  const channels = data.channelCards || [];

  return (
    <div className="sec-dark">
      <span className="eye-lt">03 &mdash; What We Do</span>
      <h2 className="h2-lt">One Strategy.<br /><em>Five Channels.</em><br />Everything Compounds.</h2>
      <p className="intro-lt">
        Parallel execution across all five discovery channels &mdash; not one at a time. Work in one
        channel amplifies every other. A strong GBP feeds Maps and AI Overviews. High-authority content
        builds organic rankings and earns LLM citations. Strong organic authority lowers your Google Ads
        cost per click.
      </p>

      <div className="strategy-layers">
        <div className="layer">
          <div className="layer-letter">S</div>
          <span className="layer-eye">Layer 1</span>
          <div className="layer-title">Signals &mdash; What We Tell the Machines</div>
          <div className="layer-body">
            Every question your buyers ask, mapped across every channel and every stage of the buying
            journey. One source of truth that feeds all five channels. Without clean signals, you&rsquo;re
            running five strategies with five different compasses.
          </div>
          <div className="layer-items">
            <div className="li-card"><div className="li-title">Keyword Architecture</div><div className="li-desc">Full buyer journey mapped across services and geographies. Awareness through conversion intent &mdash; all targeted.</div></div>
            <div className="li-card"><div className="li-title">Content Signal Mapping</div><div className="li-desc">Every service page gets a target keyword, optimization benchmark, and word count target. No more guessing.</div></div>
            <div className="li-card"><div className="li-title">Schema &amp; Structured Data</div><div className="li-desc">LocalBusiness, FAQ, and Service schema that tells Google and AI crawlers exactly what you do and where.</div></div>
            <div className="li-card"><div className="li-title">Conversational Query Targets</div><div className="li-desc">The exact questions buyers type into ChatGPT and Perplexity &mdash; mapped into your content architecture.</div></div>
          </div>
        </div>
        <div className="layer l2">
          <div className="layer-letter r">C</div>
          <span className="layer-eye r">Layer 2</span>
          <div className="layer-title">Channels &mdash; Where You Show Up</div>
          <div className="layer-body">
            Five channels, executed in parallel. The compounding effect is real: a well-optimized GBP feeds
            Maps and AI Overviews simultaneously. A high-authority guest post builds domain rating and earns
            LLM citations at the same time. Every dollar of work pulls double and triple duty.
          </div>
          <div className="ch-list">
            {channels.map((ch, i) => (
              <div className="ch-li" key={i} style={i === 4 ? { gridColumn: "1/-1" } : undefined}>
                <div className="ch-li-num">{i + 1}</div>
                <div>
                  <div className="ch-li-title">{CHANNEL_LABELS[i]}</div>
                  <div className="ch-li-desc">{ch.strategyNote}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="layer">
          <div className="layer-letter">A</div>
          <span className="layer-eye">Layer 3</span>
          <div className="layer-title">Authority &mdash; Why the Machines Trust You</div>
          <div className="layer-body">
            Unlike ad spend, authority compounds permanently. Every link, citation, and brand mention keeps
            working long after it&rsquo;s placed. We build three distinct authority currencies &mdash; each
            targeting a different layer of the discovery ecosystem.
          </div>
          <div className="layer-items">
            <div className="li-card"><div className="li-title">High-DR Link Acquisition</div><div className="li-desc">Editorially-placed backlinks from relevant industry and local publications. The #1 Google result has 3.8&times; more backlinks than positions 2&ndash;10.</div></div>
            <div className="li-card"><div className="li-title">AI Citation Content</div><div className="li-desc">&ldquo;Best [service] in [market]&rdquo; articles on real indexed sites. Designed so LLMs cite you when buyers ask for recommendations.</div></div>
            <div className="li-card"><div className="li-title">Presence Signal Network</div><div className="li-desc">70 directory citations/year, GBP optimization, and industry-specific directories. The &ldquo;does this business exist&rdquo; layer AI models check before recommending a brand.</div></div>
            <div className="li-card"><div className="li-title">Review Authority Strategy</div><div className="li-desc">Review volume and recency across major platforms feed both Maps pack rankings and AI platform trust signals.</div></div>
          </div>
        </div>
      </div>

      {data.caseStudies && data.caseStudies.length > 0 && (
        <>
          <span className="sec-label-lt" style={{ marginTop: 28 }}>Comparable Clients &mdash; What This Produces</span>
          <div className="cases">
            {data.caseStudies.map((cs, i) => {
              const CardTag = cs.url ? "a" : "div";
              const linkProps = cs.url ? { href: cs.url, target: "_blank", rel: "noreferrer" } : {};
              return (
                <CardTag className={`case-c${cs.url ? " case-c-link" : ""}`} key={i} {...linkProps}>
                  <div className="case-ind">{cs.industryLabel}</div>
                  <div className="case-num">{cs.statNumber}</div>
                  <div className="case-lbl">{cs.statLabel}</div>
                  <div className="case-co">{cs.companyNote}</div>
                </CardTag>
              );
            })}
          </div>
          <div style={{ fontSize: 11, color: "var(--text2-lt)", marginTop: 4 }}>Full case studies at firestarterseo.com/case-studies</div>
        </>
      )}
    </div>
  );
}
