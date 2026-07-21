import SignOutButton from "../../../components/SignOutButton";
import PackagesManager from "../../../components/catalog/PackagesManager";

export default function PackagesCatalogPage() {
  return (
    <div className="page">
      <div className="brand-bar">
        <img src="/firestarter-logo.webp" alt="Firestarter SEO" className="brand-logo" />
        <span className="brand-tagline">Proposals</span>
        <div className="spacer" />
        <nav>
          <a className="brand-link" href="/catalog">Catalog</a>
          <SignOutButton />
        </nav>
      </div>
      <h1>Packages</h1>
      <p className="subtitle">Investment tiers proposals can offer, e.g. Visibility ($2,000/mo) and Dominance ($4,000/mo).</p>
      <PackagesManager />
    </div>
  );
}
