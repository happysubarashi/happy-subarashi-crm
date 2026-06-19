import { createClient } from "@/lib/supabase/server";
import { ACTIVE_PIPELINE_STAGES } from "@/lib/constants";
import type { PipelineStage } from "@/types/database.types";
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";

export interface DashboardStats {
  totalLeads: number;
  totalCustomers: number;
  leadsToday: number;
  leadsThisMonth: number;
  followUpsToday: number;
  hotLeads: number;
  closingThisMonth: number;
  repeatOrdersDue: number;
  businessProspects: number;
}

export interface StageCount {
  stage: PipelineStage;
  count: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();
  const now = new Date();
  const todayStart = startOfDay(now).toISOString();
  const todayEnd = endOfDay(now).toISOString();
  const monthStart = startOfMonth(now).toISOString();
  const monthEnd = endOfMonth(now).toISOString();
  const todayDateOnly = startOfDay(now).toISOString().slice(0, 10);

  const [
    totalLeads,
    totalCustomers,
    leadsToday,
    leadsThisMonth,
    followUpsToday,
    hotLeads,
    closingThisMonth,
    repeatOrdersDue,
    businessProspects,
  ] = await Promise.all([
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .is("archived_at", null),

    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .is("archived_at", null)
      .eq("is_member", true),

    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .is("archived_at", null)
      .gte("created_at", todayStart)
      .lte("created_at", todayEnd),

    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .is("archived_at", null)
      .gte("created_at", monthStart)
      .lte("created_at", monthEnd),

    supabase
      .from("follow_ups")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending")
      .gte("scheduled_at", todayStart)
      .lte("scheduled_at", todayEnd),

    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .is("archived_at", null)
      .eq("is_hot_lead", true)
      .in("pipeline_stage", ACTIVE_PIPELINE_STAGES),

    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .is("archived_at", null)
      .eq("pipeline_stage", "closing_won")
      .gte("closing_date", monthStart.slice(0, 10))
      .lte("closing_date", monthEnd.slice(0, 10)),

    supabase
      .from("repeat_orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "confirmed")
      .lte("next_followup_date", todayDateOnly),

    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .is("archived_at", null)
      .eq("is_member", true),
  ]);

  return {
    totalLeads: totalLeads.count ?? 0,
    totalCustomers: totalCustomers.count ?? 0,
    leadsToday: leadsToday.count ?? 0,
    leadsThisMonth: leadsThisMonth.count ?? 0,
    followUpsToday: followUpsToday.count ?? 0,
    hotLeads: hotLeads.count ?? 0,
    closingThisMonth: closingThisMonth.count ?? 0,
    repeatOrdersDue: repeatOrdersDue.count ?? 0,
    businessProspects: businessProspects.count ?? 0,
  };
}

export async function getPipelineOverview(): Promise<StageCount[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("pipeline_stage")
    .is("archived_at", null);

  if (error) throw error;

  const counts = new Map<PipelineStage, number>();
  for (const row of data ?? []) {
    const stage = row.pipeline_stage as PipelineStage;
    counts.set(stage, (counts.get(stage) ?? 0) + 1);
  }

  return ACTIVE_PIPELINE_STAGES.map((stage) => ({
    stage,
    count: counts.get(stage) ?? 0,
  }));
}
