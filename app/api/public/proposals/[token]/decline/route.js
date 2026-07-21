import { NextResponse } from "next/server";
import { createAdminClient } from "../../../../../../lib/supabase/admin";
import { ALLOWED_TRANSITIONS } from "../../../../../../lib/proposalStatus";

// PUBLIC route — see accept/route.js for the security model (token + POST-only
// conditional update, no Supabase Auth session).
export async function POST(request, { params }) {
  const supabase = createAdminClient();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  const userAgent = request.headers.get("user-agent") || null;

  const { data, error } = await supabase
    .from("proposals")
    .update({ status: "declined", declined_at: new Date().toISOString() })
    .eq("share_token", params.token)
    .in("status", ALLOWED_TRANSITIONS.decline)
    .select()
    .single();

  if (error || !data) {
    const { data: current } = await supabase.from("proposals").select("status").eq("share_token", params.token).single();
    if (!current) return NextResponse.json({ error: "Proposal not found." }, { status: 404 });
    return NextResponse.json({ error: `This proposal is already ${current.status}.`, status: current.status }, { status: 409 });
  }

  await supabase.from("proposal_events").insert({
    proposal_id: data.id, event_type: "declined", ip_address: ip, user_agent: userAgent,
  });

  return NextResponse.json({ ok: true });
}
