import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
        }
      },
    },
    // See lib/supabase/admin.js — Next.js's fetch cache otherwise keeps
    // re-serving the first-ever snapshot of proposal/catalog data instead of
    // reflecting subsequent changes.
    global: { fetch: (url, options) => fetch(url, { ...options, cache: "no-store" }) },
  });
}
