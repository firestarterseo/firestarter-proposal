import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import { mapProposalRowToDocumentData } from "../../../lib/proposalMapping";
import SignOutButton from "../../../components/SignOutButton";
import ProposalDocument from "../../../components/proposal/ProposalDocument";
import SendProposalButton from "../../../components/SendProposalButton";

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

      {events && events.length > 0 && (
        <div className="soft-card" style={{ padding: "16px 20px", marginBottom: 20 }}>
          <div className="section-label">Audit trail</div>
          <ul className="audit-list">
            {events.map((ev) => (
              <li className="audit-item" key={ev.id}>
                <span>
                  <span className="audit-event">{ev.event_type}</span>
                  {ev.actor_name ? ` — ${ev.actor_name}` : ""}
                </span>
                <span className="audit-meta">{fmtDate(ev.created_at)}{ev.ip_address ? ` · ${ev.ip_address}` : ""}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="preview-pane">
        <ProposalDocument data={previewData} />
      </div>
    </div>
  );
}
