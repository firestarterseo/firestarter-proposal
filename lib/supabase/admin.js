import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";

// Bypasses RLS entirely. Only import this from server-side code that needs
// to act on behalf of the app itself, never a logged-in user — currently
// just the public /view/[token] flow, where there is no Supabase Auth session
// to authorize the request. Every other read/write in the app should go
// through the browser or cookie-based server client instead, so RLS stays
// the actual authorization boundary.
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it in Vercel -> Project -> Settings -> Environment Variables."
    );
  }
  return createSupabaseClient(SUPABASE_URL, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    // Next.js's App Router patches the global fetch to cache GET responses
    // by default, including ones supabase-js issues internally — this admin
    // client only ever runs inside request-scoped reads of live, frequently-
    // mutated proposal state (view/accept/decline), so every call here must
    // always hit the DB fresh. `export const dynamic = "force-dynamic"` on
    // the calling route is not sufficient by itself to guarantee this.
    global: { fetch: (url, options) => fetch(url, { ...options, cache: "no-store" }) },
  });
}
