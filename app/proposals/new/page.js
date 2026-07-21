import SignOutButton from "../../../components/SignOutButton";
import ProposalForm from "../../../components/ProposalForm";

export default function NewProposalPage() {
  return (
    <div className="page page-wide">
      <div className="brand-bar">
        <img src="/firestarter-logo.webp" alt="Firestarter SEO" className="brand-logo" />
        <span className="brand-tagline">Proposals</span>
        <div className="spacer" />
        <nav>
          <a className="brand-link" href="/">Dashboard</a>
          <SignOutButton />
        </nav>
      </div>
      <h1>New proposal</h1>
      <p className="subtitle">Fill in the client-specific numbers and text — everything else in the document is standard Firestarter methodology.</p>
      <ProposalForm />
    </div>
  );
}
