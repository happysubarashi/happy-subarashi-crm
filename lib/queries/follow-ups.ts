import { createClient } from "@/lib/supabase/server";
import type { FollowUpWithLead } from "@/types/database.types";
import { startOfDay, endOfDay } from "date-fns";

export interface GroupedFollowUps {
  overdue: FollowUpWithLead[];
  today: FollowUpWithLead[];
  upcoming: FollowUpWithLead[];
}

const FOLLOW_UP_SELECT = `
  *,
  lead:leads!follow_ups_lead_id_fkey ( id, lead_code, full_name, phone, pipeline_stage )
`;

export async function getGroupedFollowUps(): Promise<GroupedFollowUps> {
  const supabase = await createClient();
  const now = new Date();
  const todayStart = startOfDay(now).toISOString();
  const todayEnd = endOfDay(now).toISOString();

  const [overdueRes, todayRes, upcomingRes] = await Promise.all([
    supabase
      .from("follow_ups")
      .select(FOLLOW_UP_SELECT)
      .eq("status", "pending")
      .lt("scheduled_at", todayStart)
      .order("scheduled_at", { ascending: true }),

    supabase
      .from("follow_ups")
      .select(FOLLOW_UP_SELECT)
      .eq("status", "pending")
      .gte("scheduled_at", todayStart)
      .lte("scheduled_at", todayEnd)
      .order("scheduled_at", { ascending: true }),

    supabase
      .from("follow_ups")
      .select(FOLLOW_UP_SELECT)
      .eq("status", "pending")
      .gt("scheduled_at", todayEnd)
      .order("scheduled_at", { ascending: true })
      .limit(50),
  ]);

  if (overdueRes.error) throw overdueRes.error;
  if (todayRes.error) throw todayRes.error;
  if (upcomingRes.error) throw upcomingRes.error;

  return {
    overdue: (overdueRes.data ?? []) as unknown as FollowUpWithLead[],
    today: (todayRes.data ?? []) as unknown as FollowUpWithLead[],
    upcoming: (upcomingRes.data ?? []) as unknown as FollowUpWithLead[],
  };
}

export async function getLeadFollowUpsPending(leadId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("follow_ups")
    .select("*")
    .eq("lead_id", leadId)
    .eq("status", "pending")
    .order("scheduled_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getTodayFollowUpsPreview(limit = 5): Promise<FollowUpWithLead[]> {
  const supabase = await createClient();
  const now = new Date();
  const { data, error } = await supabase
    .from("follow_ups")
    .select(FOLLOW_UP_SELECT)
    .eq("status", "pending")
    .lte("scheduled_at", endOfDay(now).toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as FollowUpWithLead[];
}
