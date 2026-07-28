import { createClient } from "../lib/supabase/server";
import SignOutButton from "../components/SignOutButton";
import ProposalsTable from "../components/ProposalsTable";

// Without this, Next.js's App Router caches the fetch() call Supabase-js
// issues under the hood, so the dashboard would keep re-serving the DB
// snapshot from the very first request instead of reflecting new proposals
// or status changes.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: proposals } = await supabase
    .from("proposals")
    .select("id, client_company_name, status, created_at, sent_at, accepted_at")
    .order("created_at", { ascending: false });

  return (
    <div className="page page-wide">
      <div className="brand-bar">
        <img src="/firestarter-logo.png" alt="Firestarter SEO" className="brand-logo" />
        <span className="brand-tagline">Proposals</span>
        <div className="spacer" />
        <nav>
          <a className="btn-primary inline" href="/proposals/new">+ New Proposal</a>
          <a className="brand-link" href="/catalog">Catalog</a>
          <SignOutButton />
        </nav>
      </div>
      <h1>Proposals</h1>
      <p className="subtitle">Every proposal your team has created, sent, or closed.</p>
      <ProposalsTable proposals={proposals || []} />
    </div>
  );
}
