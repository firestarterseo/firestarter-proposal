import { NextResponse } from "next/server";
import { createClient } from "../../../../../lib/supabase/server";
import { generateShareToken } from "../../../../../lib/tokens";
import { sendProposalEmail } from "../../../../../lib/email";
import { ALLOWED_TRANSITIONS } from "../../../../../lib/proposalStatus";

// Authenticated route (staff only, via the normal cookie-based server client —
// RLS already scopes this to logged-in users, so there's no reason to reach
// for the admin/service-role client here). Needs a Route Handler rather than
// a Server Action because it calls out to Resend with a secret API key.
export async function POST(request, { params }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { data: proposal, error: fetchErr } = await supabase
    .from("proposals")
    .select("*")
    .eq("id", params.id)
    .single();
  if (fetchErr || !proposal) {
    return NextResponse.json({ error: "Proposal not found." }, { status: 404 });
  }
  if (!ALLOWED_TRANSITIONS.send.includes(proposal.status)) {
    return NextResponse.json({ error: `Can't send a proposal that's already ${proposal.status}.` }, { status: 409 });
  }

  const shareToken = proposal.share_token || generateShareToken();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
  const shareUrl = `${appUrl}/view/${shareToken}`;

  const result = await sendProposalEmail({ ...proposal, share_token: shareToken }, shareUrl);
  if (!result.sent) {
    return NextResponse.json({ error: result.reason }, { status: 400 });
  }

  const { error: updateErr } = await supabase
    .from("proposals")
    .update({ share_token: shareToken, status: "sent", sent_at: new Date().toISOString() })
    .eq("id", proposal.id);
  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  await supabase.from("proposal_events").insert({ proposal_id: proposal.id, event_type: "sent" });

  return NextResponse.json({ ok: true, shareUrl });
}
