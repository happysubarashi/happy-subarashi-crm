import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

/**
 * Server-side Supabase client.
 * Use inside Server Components, Server Actions, and Route Handlers.
 *
 * Next.js 15 makes `cookies()` async, so this factory must be awaited
 * at the call site: `const supabase = await createClient()`.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — middleware refreshes the
            // session instead, so this can be safely ignored.
          }
        },
      },
    }
  );
}

/**
 * Admin client using the service role key — bypasses RLS entirely.
 * SERVER ONLY. Never import this in a Client Component.
 * Used for: inviting new team members (Settings → Team Management).
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
