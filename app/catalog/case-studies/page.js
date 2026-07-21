import SignOutButton from "../../../components/SignOutButton";
import CaseStudiesManager from "../../../components/catalog/CaseStudiesManager";

export default function CaseStudiesCatalogPage() {
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
      <h1>Case studies</h1>
      <p className="subtitle">Reusable client results — pick up to a few to feature on any given proposal.</p>
      <CaseStudiesManager />
    </div>
  );
}
