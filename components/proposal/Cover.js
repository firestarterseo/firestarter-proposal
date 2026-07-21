const TRUST_PILLS = ["4.9★ Clutch", "Top SEO Agency — UpCity", "Est. 2009", "10,000+ first-page rankings", "150+ active campaigns"];
const AGENCY_PHONE = "303-909-6698";
const AGENCY_SITE = "firestarterseo.com";

export default function Cover({ data }) {
  const heroWords = (data.clientCompanyName || "").split(" ");

  return (
    <div className="cover">
      <span className="cover-eye">Search Visibility Proposal &middot; {data.clientCompanyName}</span>
      <h1>
        {heroWords.map((word, i) => (
          <span key={i}>
            {word.toLowerCase() === (data.heroEmphasisWord || "").toLowerCase() ? <em>{word}</em> : word}
            {i < heroWords.length - 1 && <br />}
          </span>
        ))}
      </h1>
      <div className="cover-sub">{data.subtitle}</div>
      <div className="cover-grid">
        <div className="cover-cell"><label>Prepared by</label><span>{data.preparedBy} &mdash; Firestarter SEO</span></div>
        <div className="cover-cell"><label>Prepared for</label><span>{data.clientContactName} &mdash; {data.clientCompanyName}</span></div>
        <div className="cover-cell"><label>Services</label><span>{data.servicesSummary}</span></div>
        <div className="cover-cell"><label>Contact</label><span>{AGENCY_PHONE} &middot; {AGENCY_SITE}</span></div>
      </div>
      <div className="trust-row">
        {TRUST_PILLS.map((pill) => (
          <span className="tpill" key={pill}>{pill}</span>
        ))}
      </div>
    </div>
  );
}
