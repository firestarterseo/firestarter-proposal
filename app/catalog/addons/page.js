import SignOutButton from "../../../components/SignOutButton";
import AddonsManager from "../../../components/catalog/AddonsManager";

export default function AddonsCatalogPage() {
  return (
    <div className="page">
      <div className="brand-bar">
        <span className="wordmark">FIRESTARTER</span>
        <span className="brand-tagline">Proposals</span>
        <div className="spacer" />
        <nav>
          <a className="brand-link" href="/catalog">Catalog</a>
          <SignOutButton />
        </nav>
      </div>
      <h1>Add-ons &amp; one-time fees</h1>
      <p className="subtitle">Optional line items proposals can include on top of a package.</p>
      <AddonsManager />
    </div>
  );
}
