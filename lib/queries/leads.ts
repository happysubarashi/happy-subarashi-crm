import { createClient } from "@/lib/supabase/server";
import type { Lead, LeadWithAssignee, Product } from "@/types/database.types";
import type { PipelineStage, LeadSource } from "@/types/database.types";
import { normalizePhone } from "@/lib/utils";

export interface LeadFilters {
  search?: string;
  stage?: PipelineStage | "all";
  source?: LeadSource | "all";
  assignedTo?: string | "all";
  hotOnly?: boolean;
  memberOnly?: boolean;
  includeArchived?: boolean;
  page?: number;
  pageSize?: number;
}

export interface LeadListResult {
  leads: LeadWithAssignee[];
  total: number;
}

const LEAD_SELECT = `
  *,
  assignee:profiles!leads_assigned_to_fkey ( id, full_name, avatar_url )
`;

export async function getLeads(filters: LeadFilters = {}): Promise<LeadListResult> {
  const supabase = await createClient();
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("leads")
    .select(LEAD_SELECT, { count: "exact" });

  if (!filters.includeArchived) {
    query = query.is("archived_at", null);
  }

  if (filters.search) {
    const term = filters.search.trim();
    query = query.or(
      `full_name.ilike.%${term}%,phone.ilike.%${term}%,lead_code.ilike.%${term}%`
    );
  }

  if (filters.stage && filters.stage !== "all") {
    query = query.eq("pipeline_stage", filters.stage);
  }

  if (filters.source && filters.source !== "all") {
    query = query.eq("source", filters.source);
  }

  if (filters.assignedTo && filters.assignedTo !== "all") {
    query = query.eq("assigned_to", filters.assignedTo);
  }

  if (filters.hotOnly) {
    query = query.eq("is_hot_lead", true);
  }

  if (filters.memberOnly) {
    query = query.eq("is_member", true);
  }

  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    leads: (data ?? []) as unknown as LeadWithAssignee[],
    total: count ?? 0,
  };
}

export interface KanbanBuckets {
  new_lead: LeadWithAssignee[];
  contacted: LeadWithAssignee[];
  follow_up: LeadWithAssignee[];
  closing: LeadWithAssignee[];
  customer: LeadWithAssignee[];
}

export async function getKanbanLeads(): Promise<KanbanBuckets> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select(LEAD_SELECT)
    .is("archived_at", null)
    .order("last_activity_at", { ascending: false, nullsFirst: false });

  if (error) throw error;
  const leads = (data ?? []) as unknown as LeadWithAssignee[];

  const buckets: KanbanBuckets = {
    new_lead: [],
    contacted: [],
    follow_up: [],
    closing: [],
    customer: [],
  };

  for (const lead of leads) {
    if (lead.pipeline_stage === "closing_won" && lead.is_member) {
      buckets.customer.push(lead);
    } else if (lead.pipeline_stage === "closing_won") {
      buckets.closing.push(lead);
    } else if (lead.pipeline_stage === "lead_baru") {
      buckets.new_lead.push(lead);
    } else if (lead.pipeline_stage === "sudah_chat") {
      buckets.contacted.push(lead);
    } else if (
      ["konsultasi", "edukasi_produk", "menunggu_keputusan"].includes(
        lead.pipeline_stage
      )
    ) {
      buckets.follow_up.push(lead);
    }
    // closing_lost leads are intentionally excluded from the Kanban view
  }

  return buckets;
}

export async function getLeadById(id: string): Promise<LeadWithAssignee | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select(LEAD_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as LeadWithAssignee | null;
}

export async function getLeadProducts(leadId: string): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lead_products")
    .select("product:products(*)")
    .eq("lead_id", leadId);

  if (error) throw error;
  return ((data ?? []) as unknown as { product: Product }[]).map(
    (r) => r.product
  );
}

export async function getActiveProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function getRecentLeadsForOrder() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("id, full_name, phone")
    .is("archived_at", null)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return (data ?? []) as { id: string; full_name: string; phone: string }[];
}

/** Find leads with a matching normalized phone — used for duplicate detection. */
export async function findDuplicateLeads(phone: string, excludeId?: string) {
  const supabase = await createClient();
  const normalized = normalizePhone(phone);

  let query = supabase
    .from("leads")
    .select("id, lead_code, full_name, phone, pipeline_stage")
    .eq("phone_normalized", normalized)
    .is("archived_at", null);

  if (excludeId) query = query.neq("id", excludeId);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Pick<
    Lead,
    "id" | "lead_code" | "full_name" | "phone" | "pipeline_stage"
  >[];
}
