"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addDays, format } from "date-fns";

export interface OrderFormState {
  error: string | null;
}

interface LineItemInput {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export async function createRepeatOrderAction(
  _prev: OrderFormState,
  formData: FormData
): Promise<OrderFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesi habis, silakan login kembali." };

  const customerName = String(formData.get("customer_name") || "").trim();
  const customerPhone = String(formData.get("customer_phone") || "").trim();
  const leadId = (formData.get("lead_id") as string) || null;
  const orderDate = String(formData.get("order_date") || format(new Date(), "yyyy-MM-dd"));
  const reminderDays = Number(formData.get("reminder_days") || 30);
  const assignedTo = (formData.get("assigned_to") as string) || user.id;
  const notes = (formData.get("notes") as string) || null;

  const itemsRaw = formData.get("items_json");
  let items: LineItemInput[] = [];
  try {
    items = JSON.parse(String(itemsRaw || "[]"));
  } catch {
    items = [];
  }

  if (!customerName || !customerPhone) {
    return { error: "Nama dan nomor pelanggan wajib diisi." };
  }
  if (items.length === 0) {
    return { error: "Tambahkan minimal 1 produk." };
  }

  const nextFollowupDate = format(
    addDays(new Date(orderDate), reminderDays),
    "yyyy-MM-dd"
  );

  const { data: order, error } = await supabase
    .from("repeat_orders")
    .insert({
      lead_id: leadId,
      customer_name: customerName,
      customer_phone: customerPhone,
      order_date: orderDate,
      next_followup_date: nextFollowupDate,
      assigned_to: assignedTo,
      created_by: user.id,
      notes,
    })
    .select("id")
    .single();

  if (error || !order) {
    return { error: "Gagal menyimpan order. " + (error?.message ?? "") };
  }

  const { error: itemsError } = await supabase.from("repeat_order_items").insert(
    items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }))
  );

  if (itemsError) {
    return { error: "Gagal menyimpan item produk. " + itemsError.message };
  }

  // Log activity on the linked lead, if any
  if (leadId) {
    await supabase.from("activities").insert({
      lead_id: leadId,
      user_id: user.id,
      type: "note",
      title: "Repeat order dibuat",
      description: `Order ${order.id} — reminder ${reminderDays} hari`,
    });
  }

  revalidatePath("/repeat-orders");
  revalidatePath("/dashboard");
  redirect("/repeat-orders");
}

export async function updateOrderReminderAction(orderId: string, days: number) {
  const supabase = await createClient();
  const nextFollowupDate = format(addDays(new Date(), days), "yyyy-MM-dd");

  const { error } = await supabase
    .from("repeat_orders")
    .update({ next_followup_date: nextFollowupDate })
    .eq("id", orderId);

  if (error) throw error;

  revalidatePath("/repeat-orders");
  revalidatePath("/dashboard");
}

export async function markOrderDeliveredAction(orderId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("repeat_orders")
    .update({ status: "delivered" })
    .eq("id", orderId);

  if (error) throw error;
  revalidatePath("/repeat-orders");
}
