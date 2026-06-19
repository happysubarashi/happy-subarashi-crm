import { createClient } from "@/lib/supabase/server";
import type { LeadWithAssignee, RepeatOrderWithItems } from "@/types/database.types";

const LEAD_SELECT = `
  *,
  assignee:profiles!leads_assigned_to_fkey ( id, full_name, avatar_url )
`;

export interface CustomerListResult {
  customers: LeadWithAssignee[];
  total: number;
}

export async function getCustomers(params: {
  search?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<CustomerListResult> {
  const supabase = await createClient();
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("leads")
    .select(LEAD_SELECT, { count: "exact" })
    .eq("is_member", true)
    .is("archived_at", null);

  if (params.search) {
    const term = params.search.trim();
    query = query.or(`full_name.ilike.%${term}%,phone.ilike.%${term}%,lead_code.ilike.%${term}%`);
  }

  query = query.order("closing_date", { ascending: false, nullsFirst: false }).range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    customers: (data ?? []) as unknown as LeadWithAssignee[],
    total: count ?? 0,
  };
}

export async function getCustomerById(id: string): Promise<LeadWithAssignee | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select(LEAD_SELECT)
    .eq("id", id)
    .eq("is_member", true)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as LeadWithAssignee | null;
}

export async function getCustomerOrders(leadId: string): Promise<RepeatOrderWithItems[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("repeat_orders")
    .select(`*, items:repeat_order_items(*)`)
    .eq("lead_id", leadId)
    .order("order_date", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as RepeatOrderWithItems[];
}

export async function getCustomerStats() {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("is_member", true)
    .is("archived_at", null);

  if (error) throw error;
  return { total: count ?? 0 };
}
