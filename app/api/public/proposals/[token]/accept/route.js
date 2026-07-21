import { NextResponse } from "next/server";
import { createAdminClient } from "../../../../../../lib/supabase/admin";
import { ALLOWED_TRANSITIONS } from "../../../../../../lib/proposalStatus";

// PUBLIC route — no Supabase Auth session exists here at all. Security comes
// entirely from the share_token (256-bit, see lib/tokens.js) plus this being
// a POST-only conditional state transition, never a GET (email link-scanners
// like Defender Safe Links crawl every URL in an inbound email before a human
// opens it, so a GET-based accept would get triggered by the scanner itself).
export async function POST(request, { params }) {
  const body = await request.json().catch(() => ({}));
  const signerName = (body.signerName || "").trim();
  if (!signerName) {
    return NextResponse.json({ error: "A name is required to accept." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  const userAgent = request.headers.get("user-agent") || null;

  // Atomic conditional update — closes the double-submit / two-tab race:
  // this can only ever succeed once, from whichever request gets there first.
  const { data, error } = await supabase
    .from("proposals")
    .update({ status: "accepted", accepted_at: new Date().toISOString() })
    .eq("share_token", params.token)
    .in("status", ALLOWED_TRANSITIONS.accept)
    .select()
    .single();

  if (error || !data) {
    const { data: current } = await supabase.from("proposals").select("status").eq("share_token", params.token).single();
    if (!current) return NextResponse.json({ error: "Proposal not found." }, { status: 404 });
    return NextResponse.json({ error: `This proposal is already ${current.status}.`, status: current.status }, { status: 409 });
  }

  await supabase.from("proposal_events").insert({
    proposal_id: data.id, event_type: "accepted", actor_name: signerName, ip_address: ip, user_agent: userAgent,
  });

  return NextResponse.json({ ok: true });
}
