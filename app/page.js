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
    .select("id, client_company_name, status, created_at, sent_at, first_viewed_at, accepted_at, declined_at")
    .order("created_at", { ascending: false });

  const rows = proposals || [];
  const sentCount = rows.filter((p) => p.sent_at).length;
  const viewedCount = rows.filter((p) => p.first_viewed_at).length;
  const acceptedCount = rows.filter((p) => p.status === "accepted").length;
  const winRate = sentCount ? Math.round((acceptedCount / sentCount) * 100) : null;

  return (
    <div className="page page-wide">
      <div className="brand-bar">
        <img src="/firestarter-logo.png" alt="Firestarter SEO" className="brand-logo" />
        <span className="brand-tagline">Proposals</span>
        <div className="spacer" />
        <nav>
          <a className="btn-primary inline" href="/proposals/new">+ New Proposal</a>
          <a className="brand-link" href="/catalog">Catalog</a>
          <a className="brand-link" href="/playbook">Playbook</a>
          <SignOutButton />
        </nav>
      </div>
      <h1>Proposals</h1>
      <p className="subtitle">Every proposal your team has created, sent, or closed.</p>
      <div className="cards">
        <div className="card" style={{ flex: "1 1 160px" }}>
          <div className="num">{sentCount}</div>
          <div className="label">Sent</div>
        </div>
        <div className="card" style={{ flex: "1 1 160px" }}>
          <div className="num">{viewedCount}</div>
          <div className="label">Viewed by client</div>
        </div>
        <div className="card" style={{ flex: "1 1 160px" }}>
          <div className="num">{acceptedCount}</div>
          <div className="label">Signed</div>
        </div>
        <div className="card" style={{ flex: "1 1 160px" }}>
          <div className="num">{winRate === null ? "—" : `${winRate}%`}</div>
          <div className="label">Win rate</div>
        </div>
      </div>
      <ProposalsTable proposals={rows} />
    </div>
  );
}
