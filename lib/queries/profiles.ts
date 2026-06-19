import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database.types";
import { redirect } from "next/navigation";
import { cache } from "react";

/**
 * Get the current authenticated user's profile.
 * Cached per-request via React's `cache()` so multiple Server Components
 * calling this in the same request tree only hit the DB once.
 */
export const getCurrentProfile = cache(async (): Promise<Profile> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !data) redirect("/login");

  return data as Profile;
});

export function isManager(role: Profile["role"]) {
  return role === "owner" || role === "admin";
}

/** All active team members — used in assignment dropdowns. */
export async function getTeamMembers(): Promise<Profile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_active", true)
    .order("full_name");

  if (error) throw error;
  return (data ?? []) as Profile[];
}

/** All team members including inactive — used in Settings → Team Management. */
export async function getAllTeamMembers(): Promise<Profile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Profile[];
}
