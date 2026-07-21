import SignOutButton from "../../components/SignOutButton";

export default function CatalogHomePage() {
  return (
    <div className="page">
      <div className="brand-bar">
        <span className="wordmark">FIRESTARTER</span>
        <span className="brand-tagline">Proposals</span>
        <div className="spacer" />
        <nav>
          <a className="brand-link" href="/">Dashboard</a>
          <SignOutButton />
        </nav>
      </div>
      <h1>Catalog</h1>
      <p className="subtitle">
        Shared pricing and content that every proposal is built from. Editing something here
        doesn't change proposals that already picked it — each proposal keeps its own snapshot
        from the moment it was added.
      </p>
      <div className="cards">
        <a className="card" href="/catalog/packages" style={{ flex: "1 1 220px" }}>
          <div className="num">Packages</div>
          <div className="label">Investment tiers (e.g. Visibility, Dominance)</div>
        </a>
        <a className="card" href="/catalog/addons" style={{ flex: "1 1 220px" }}>
          <div className="num">Add-ons &amp; fees</div>
          <div className="label">Optional line items and one-time fees</div>
        </a>
        <a className="card" href="/catalog/case-studies" style={{ flex: "1 1 220px" }}>
          <div className="num">Case studies</div>
          <div className="label">Reusable client results to feature in proposals</div>
        </a>
      </div>
    </div>
  );
}
