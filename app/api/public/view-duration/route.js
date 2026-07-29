import { NextResponse } from "next/server";
import { createAdminClient } from "../../../../lib/supabase/admin";

// PUBLIC route — fire-and-forget beacon from ViewDurationTracker.js, no
// Supabase Auth session. Bounded loosely (not a real reading session, just a
// guard against clock-drift/garbage payloads) and only ever set once per
// event row via the `is duration_seconds null` guard, so a stray duplicate
// beacon can't clobber the real total with a smaller number.
const MAX_DURATION_SECONDS = 6 * 60 * 60;

export async function POST(request) {
  let body;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { eventId, durationSeconds } = body || {};
  const seconds = Math.round(Number(durationSeconds));
  const isValidId = typeof eventId === "string" && /^[0-9a-f-]{36}$/i.test(eventId);

  if (!isValidId || !Number.isFinite(seconds) || seconds <= 0 || seconds > MAX_DURATION_SECONDS) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const supabase = createAdminClient();
  await supabase
    .from("proposal_events")
    .update({ duration_seconds: seconds })
    .eq("id", eventId)
    .eq("event_type", "viewed")
    .is("duration_seconds", null);

  return NextResponse.json({ ok: true });
}
