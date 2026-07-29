import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import { mapProposalRowToDocumentData } from "../../../lib/proposalMapping";
import { groupProposalEvents, summarizeVisits, describeEngagement, describeEventGroup, formatRelativeTime } from "../../../lib/proposalEvents";
import SignOutButton from "../../../components/SignOutButton";
import ProposalDocument from "../../../components/proposal/ProposalDocument";
import SendProposalButton from "../../../components/SendProposalButton";
import Disclosure from "../../../components/Disclosure";

// See app/view/[token]/page.js for why this is needed — Next.js otherwise
// caches the Supabase fetch() and this page would keep showing stale status.
export const dynamic = "force-dynamic";

function fmtDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default async function ProposalDetailPage({ params }) {
  const supabase = createClient();
  const { data: proposal } = await supabase.from("proposals").select("*").eq("id", params.id).single();
  if (!proposal) notFound();

  const [{ data: packageRows }, { data: addonRows }, { data: caseStudyRows }, { data: events }] = await Promise.all([
    supabase.from("proposal_packages").select("*").eq("proposal_id", proposal.id).order("sort_order"),
    supabase.from("proposal_addons").select("*").eq("proposal_id", proposal.id).order("sort_order"),
    proposal.selected_case_study_ids?.length
      ? supabase.from("case_studies").select("*").in("id", proposal.selected_case_study_ids)
      : Promise.resolve({ data: [] }),
    supabase.from("proposal_events").select("*").eq("proposal_id", proposal.id).order("created_at", { ascending: false }),
  ]);

  const previewData = mapProposalRowToDocumentData(proposal, {
    packages: packageRows || [],
    addons: addonRows || [],
    caseStudies: caseStudyRows || [],
  });

  const shareUrl = proposal.share_token
    ? `${process.env.NEXT_PUBLIC_APP_URL || ""}/view/${proposal.share_token}`
    : null;

  const eventGroups = groupProposalEvents(events || []);
  const { visitCount, firstVisit, lastActivity, avgDurationSeconds } = summarizeVisits(eventGroups);
  const engagementSummary = describeEngagement({
    visitCount, firstVisit, lastActivity, avgDurationSeconds,
    contactName: proposal.client_contact_name,
  });

  return (
    <div className="page page-wide">
      <div className="brand-bar">
        <img src="/firestarter-logo.png" alt="Firestarter SEO" className="brand-logo" />
        <span className="brand-tagline">Proposals</span>
        <div className="spacer" />
        <nav>
          <a className="brand-link" href="/">Dashboard</a>
          <SignOutButton />
        </nav>
      </div>

      <div className="detail-head">
        <div>
          <h2>{proposal.client_company_name}</h2>
          <div className="detail-sub">
            <span className={`status-pill ${proposal.status}`}>{proposal.status}</span>
            {"  "}Created {fmtDate(proposal.created_at)}
          </div>
          {proposal.sent_at && <div className="detail-sub">Sent {fmtDate(proposal.sent_at)}</div>}
          {proposal.first_viewed_at && <div className="detail-sub">First viewed {fmtDate(proposal.first_viewed_at)}</div>}
          {proposal.accepted_at && <div className="detail-sub">Accepted {fmtDate(proposal.accepted_at)}</div>}
          {proposal.declined_at && <div className="detail-sub">Declined {fmtDate(proposal.declined_at)}</div>}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a className="btn-secondary" href={`/proposals/${proposal.id}/edit`} style={{ display: "inline-block", textDecoration: "none" }}>Edit</a>
          <SendProposalButton proposalId={proposal.id} status={proposal.status} clientEmail={proposal.client_email} />
        </div>
      </div>

      {shareUrl && (
        <div className="soft-card" style={{ padding: "16px 20px", marginBottom: 20, fontSize: 13 }}>
          Client link: <a href={shareUrl} target="_blank" rel="noreferrer" style={{ color: "var(--orange)", textDecoration: "underline" }}>{shareUrl}</a>
        </div>
      )}

      {proposal.status === "sent" && (
        <div className="soft-card" style={{ padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, borderLeft: "3px solid var(--orange)" }}>
          <span style={{ fontSize: 13.5, fontWeight: 600 }}>
            {(proposal.client_contact_name || "The client")} hasn&rsquo;t viewed the proposal yet.
          </span>
          <SendProposalButton proposalId={proposal.id} status={proposal.status} clientEmail={proposal.client_email} label="Send Reminder" />
        </div>
      )}

      {proposal.status === "accepted" && (
        <div className="soft-card" style={{ padding: "16px 20px", marginBottom: 20, borderLeft: "3px solid var(--success)", fontSize: 13.5, fontWeight: 600 }}>
          Congrats — {proposal.client_company_name} signed the deal.
        </div>
      )}

      {eventGroups.length > 0 && (
        <div className="soft-card" style={{ padding: "16px 20px", marginBottom: 20 }}>
          <div className="section-label">Activity</div>
          {engagementSummary && (
            <p style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px" }}>{engagementSummary}</p>
          )}
          <Disclosure label={`Full activity (${eventGroups.length})`} defaultOpen={false}>
            <ul className="audit-list">
              {eventGroups.map((g, i) => (
                <li className="audit-item" key={i}>
                  <span>{describeEventGroup(g, { contactName: proposal.client_contact_name })}</span>
                  <span className="audit-meta">{formatRelativeTime(g.lastAt)}</span>
                </li>
              ))}
            </ul>
          </Disclosure>
        </div>
      )}

      <div className="preview-pane">
        <ProposalDocument data={previewData} />
      </div>
    </div>
  );
}
