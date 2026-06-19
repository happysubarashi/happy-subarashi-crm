import { createClient } from "@/lib/supabase/server";
import type { ActivityWithUser } from "@/types/database.types";

export async function getLeadActivities(leadId: string): Promise<ActivityWithUser[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activities")
    .select(`*, user:profiles!activities_user_id_fkey ( id, full_name, avatar_url )`)
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as ActivityWithUser[];
}
