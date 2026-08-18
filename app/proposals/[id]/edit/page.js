import { notFound } from "next/navigation";
import { createClient } from "../../../../lib/supabase/server";
import SignOutButton from "../../../../components/SignOutButton";
import ProposalForm from "../../../../components/ProposalForm";

// See app/view/[token]/page.js for why this is needed.
export const dynamic = "force-dynamic";

export default async function EditProposalPage({ params }) {
  const supabase = createClient();
  const { data: proposal } = await supabase.from("proposals").select("*").eq("id", params.id).single();
  if (!proposal) notFound();

  const { data: packageRows } = await supabase.from("proposal_packages").select("package_id, is_recommended").eq("proposal_id", proposal.id);
  const { data: addonRows } = await supabase.from("proposal_addons").select("addon_id, name, price_amount").eq("proposal_id", proposal.id);

  const initialPackageIds = (packageRows || []).map((r) => r.package_id).filter(Boolean);
  const initialRecommendedPackageId = (packageRows || []).find((r) => r.is_recommended)?.package_id || "";
  const initialAddonIds = (addonRows || []).map((r) => r.addon_id).filter(Boolean);

  return (
    <div className="page page-wide">
      <div className="brand-bar">
        <img src="/firestarter-logo.png" alt="Firestarter SEO" className="brand-logo" />
        <span className="brand-tagline">Proposals</span>
        <div className="spacer" />
        <nav>
          <a className="brand-link" href={`/proposals/${proposal.id}`}>Back to proposal</a>
          <SignOutButton />
        </nav>
      </div>
      <h1>Edit proposal</h1>
      <p className="subtitle">{proposal.client_company_name}</p>
      <ProposalForm
        initialProposal={proposal}
        initialPackageIds={initialPackageIds}
        initialRecommendedPackageId={initialRecommendedPackageId}
        initialAddonIds={initialAddonIds}
        initialAddonRows={addonRows || []}
      />
    </div>
  );
}
