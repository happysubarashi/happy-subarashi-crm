import { createClient } from "@/lib/supabase/server";
import type { RepeatOrderWithItems } from "@/types/database.types";
import { addDays, format } from "date-fns";

export interface GroupedRepeatOrders {
  overdue: RepeatOrderWithItems[];
  dueSoon: RepeatOrderWithItems[]; // within next 7 days
  upcoming: RepeatOrderWithItems[]; // within next 30/60/90 days
  all: RepeatOrderWithItems[];
}

const ORDER_SELECT = `*, items:repeat_order_items(*)`;

export async function getGroupedRepeatOrders(): Promise<GroupedRepeatOrders> {
  const supabase = await createClient();
  const today = format(new Date(), "yyyy-MM-dd");
  const in7Days = format(addDays(new Date(), 7), "yyyy-MM-dd");

  const { data, error } = await supabase
    .from("repeat_orders")
    .select(ORDER_SELECT)
    .eq("status", "confirmed")
    .not("next_followup_date", "is", null)
    .order("next_followup_date", { ascending: true });

  if (error) throw error;
  const all = (data ?? []) as unknown as RepeatOrderWithItems[];

  return {
    overdue: all.filter((o) => o.next_followup_date! < today),
    dueSoon: all.filter(
      (o) => o.next_followup_date! >= today && o.next_followup_date! <= in7Days
    ),
    upcoming: all.filter((o) => o.next_followup_date! > in7Days),
    all,
  };
}

export async function getAllRepeatOrders(): Promise<RepeatOrderWithItems[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("repeat_orders")
    .select(ORDER_SELECT)
    .order("order_date", { ascending: false })
    .limit(100);

  if (error) throw error;
  return (data ?? []) as unknown as RepeatOrderWithItems[];
}
