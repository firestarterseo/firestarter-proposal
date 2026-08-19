// Fixed "Who Is Firestarter? / Our Story" agency-credibility intro that opens
// every real SOW/PPC-only/Website example proposal Kyle shared, verbatim.
// Full SEO (and SEO+PPC) proposals skip this — they establish credibility
// their own way (landscape stats, DR comparison, case studies) — see
// lib/proposalTypes.js usesAgencyIntro.

export default function AgencyIntroSection() {
  return (
    <div className="sec">
      <span className="eye">Who Is Firestarter?</span>
      <h2 className="h2">Our<br /><em>Story</em></h2>
      <p className="intro">
        Firestarter SEO is a search engine optimization company located in Denver, Colorado. We have been in
        operation since 2009, and we have seen great success over the years. We have created effective and
        exciting SEO strategies, which have resulted in top search engine rankings, millions of visits, and
        tens of thousands of conversions for clients across the world.
      </p>
      <span className="sec-label">Happy Clients</span>
      <p className="intro" style={{ marginBottom: 0 }}>
        Since our inception in 2009, we have had the privilege to serve clients in countless industries
        throughout the world.
      </p>
    </div>
  );
}
