import { createClient } from "../lib/supabase/server";
import { buildMonthlyTrend } from "../lib/proposalTrends";
import SignOutButton from "../components/SignOutButton";
import ProposalsTable from "../components/ProposalsTable";
import ProposalMetrics from "../components/dashboard/ProposalMetrics";
import LatestActivityFeed from "../components/dashboard/LatestActivityFeed";

// Without this, Next.js's App Router caches the fetch() call Supabase-js
// issues under the hood, so the dashboard would keep re-serving the DB
// snapshot from the very first request instead of reflecting new proposals
// or status changes.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();
  const [{ data: proposals }, { data: recentEvents }] = await Promise.all([
    supabase
      .from("proposals")
      .select("id, client_company_name, status, created_at, sent_at, first_viewed_at, accepted_at, declined_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("proposal_events")
      .select("id, event_type, actor_name, duration_seconds, created_at, proposals(client_company_name, client_contact_name)")
      .order("created_at", { ascending: false })
      .limit(15),
  ]);

  const rows = proposals || [];
  const createdCount = rows.length;
  const sentCount = rows.filter((p) => p.sent_at).length;
  const viewedCount = rows.filter((p) => p.first_viewed_at).length;
  const wonCount = rows.filter((p) => p.status === "accepted").length;
  const lostCount = rows.filter((p) => p.status === "declined").length;
  const closeRate = (wonCount + lostCount) > 0 ? Math.round((wonCount / (wonCount + lostCount)) * 100) : null;
  const { months, series } = buildMonthlyTrend(rows, new Date());

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
      <ProposalMetrics
        createdCount={createdCount}
        sentCount={sentCount}
        viewedCount={viewedCount}
        wonCount={wonCount}
        lostCount={lostCount}
        closeRate={closeRate}
        months={months}
        series={series}
      />
      <LatestActivityFeed events={recentEvents || []} />
      <ProposalsTable proposals={rows} />
    </div>
  );
}
