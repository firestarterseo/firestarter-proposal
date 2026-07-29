import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { createAdminClient } from "../../../lib/supabase/admin";
import { mapProposalRowToDocumentData } from "../../../lib/proposalMapping";
import { ALLOWED_TRANSITIONS } from "../../../lib/proposalStatus";
import ProposalDocument from "../../../components/proposal/ProposalDocument";
import AcceptDeclineForm from "../../../components/proposal/AcceptDeclineForm";
import ViewDurationTracker from "../../../components/proposal/ViewDurationTracker";

// Next.js's App Router caches fetch() responses by default (including the
// ones @supabase/supabase-js issues under the hood) — without this, every
// request here would keep re-serving the DB snapshot from the very first
// hit, silently no-oping the viewed/accepted/declined status transitions.
export const dynamic = "force-dynamic";

// PUBLIC page — entirely unauthenticated. Looks the proposal up by its
// share_token using the service-role admin client, server-side only; the
// anon/browser Supabase client is never used here. middleware.js excludes
// /view from the auth gate entirely (see middleware.js), and next.config.js
// sets Referrer-Policy: no-referrer on this path so the token in the URL
// never leaks via the Referer header.
export default async function PublicProposalPage({ params }) {
  const supabase = createAdminClient();
  const { data: proposal } = await supabase.from("proposals").select("*").eq("share_token", params.token).single();
  if (!proposal) notFound();

  const isDecided = proposal.status === "accepted" || proposal.status === "declined";
  let viewEventId = null;
  if (!isDecided) {
    // Once accepted/declined, the client's own post-action router.refresh()
    // would otherwise immediately re-trigger this same render and log a
    // redundant "viewed" event right after the real accepted/declined one.
    const headerList = headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    const userAgent = headerList.get("user-agent") || null;
    const { data: viewEvent } = await supabase
      .from("proposal_events")
      .insert({ proposal_id: proposal.id, event_type: "viewed", ip_address: ip, user_agent: userAgent })
      .select("id")
      .single();
    viewEventId = viewEvent?.id || null;
    if (ALLOWED_TRANSITIONS.view.includes(proposal.status)) {
      await supabase
        .from("proposals")
        .update({ status: "viewed", first_viewed_at: proposal.first_viewed_at || new Date().toISOString() })
        .eq("id", proposal.id)
        .eq("status", proposal.status);
    }
  }

  const [{ data: packages }, { data: addons }, { data: caseStudies }] = await Promise.all([
    supabase.from("proposal_packages").select("*").eq("proposal_id", proposal.id).order("sort_order"),
    supabase.from("proposal_addons").select("*").eq("proposal_id", proposal.id).order("sort_order"),
    proposal.selected_case_study_ids?.length
      ? supabase.from("case_studies").select("*").in("id", proposal.selected_case_study_ids)
      : Promise.resolve({ data: [] }),
  ]);

  const data = mapProposalRowToDocumentData(proposal, { packages: packages || [], addons: addons || [], caseStudies: caseStudies || [] });

  return (
    <>
      <ProposalDocument
        data={data}
        afterNextSteps={
          !isDecided ? (
            <AcceptDeclineForm token={params.token} />
          ) : (
            <div className="accept-block">
              <div className={`accept-status${proposal.status === "declined" ? " declined" : ""}`}>
                {proposal.status === "accepted" ? "Accepted — thank you!" : "Declined"}
              </div>
            </div>
          )
        }
      />
      <ViewDurationTracker eventId={viewEventId} />
    </>
  );
}
