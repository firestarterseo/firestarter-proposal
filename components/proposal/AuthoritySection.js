// Authority tier copy is fixed agency-wide content. The pull-quote ("why
// this matters for [client]") and the Monthly Deliverables list are the two
// per-proposal parts — deliverables come from whichever package is
// recommended (or the only one, if just one is selected), so this section
// never shows numbers that don't match what's actually being sold.

export default function AuthoritySection({ data }) {
  const packages = data.packages || [];
  const recommendedPackage = packages.find((p) => p.isRecommended) || packages[0];
  const monthlyDeliverables = recommendedPackage?.monthlyDeliverables || [];

  return (
    <div className="sec-mid">
      <span className="eye">04 &mdash; Authority Building</span>
      <h2 className="h2">The Asset That Keeps<br /><em>Working After You Pay for It</em></h2>
      <p className="intro">
        Every dollar of ad spend disappears the moment you stop paying. Authority doesn&rsquo;t. Six months
        of consistent link and citation building creates a compounding asset that makes every future dollar
        more effective.
      </p>
      <div className="auth-tiers">
        <div className="at-card">
          <div className="at-num">01</div>
          <div className="at-title">High-DR Link Acquisition</div>
          <div className="at-desc">Editorially-placed links from high domain-rating sites in relevant industry and local publications. Vetted broker network &mdash; every placement reviewed for topical relevance before going live.</div>
          <div className="at-tags"><span className="at-tag">DA 30+ placements</span><span className="at-tag">DA 40+ placements</span><span className="at-tag">DA 50+ premium</span><span className="at-tag">6/month included</span></div>
        </div>
        <div className="at-card">
          <div className="at-num">02</div>
          <div className="at-title">AI Citation Content</div>
          <div className="at-desc">Articles on real indexed publications structured as &ldquo;Best [Service] Companies in [Market]&rdquo; with your brand named and linked. LLMs pull from this content &mdash; not a traditional guest post, but brand placement in the content layer AI models cite.</div>
          <div className="at-tags"><span className="at-tag">Listicle placements</span><span className="at-tag">Comparison articles</span><span className="at-tag">AI-indexed domains</span><span className="at-tag">Conversational Q&amp;A</span></div>
        </div>
        <div className="at-card">
          <div className="at-num">03</div>
          <div className="at-title">Presence Signal Network</div>
          <div className="at-desc">NAP citation consistency across 70+ directories per year. GBP optimization with photo cadence, service area updates, and Q&amp;A management across the industry's major directories.</div>
          <div className="at-tags"><span className="at-tag">70 citations/year</span><span className="at-tag">GBP management</span><span className="at-tag">Review strategy</span></div>
        </div>
      </div>
      {data.authorityPullQuote && (
        <div className="pq" dangerouslySetInnerHTML={{ __html: data.authorityPullQuote }} />
      )}
      {monthlyDeliverables.length > 0 && (
        <>
          <span className="sec-label" style={{ marginTop: 32 }}>Monthly Deliverables &mdash; What You Actually Get</span>
          <div className="deliverables">
            {monthlyDeliverables.map((d, i) => (
              <div className="del-item" key={i}>
                <div className="del-check">&#10003;</div>
                <div className="del-text"><strong>{d.title}</strong>{d.description}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
