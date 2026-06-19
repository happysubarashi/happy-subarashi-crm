"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface FollowUpFormState {
  error: string | null;
}

export async function createFollowUpAction(
  leadId: string,
  _prev: FollowUpFormState,
  formData: FormData
): Promise<FollowUpFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesi habis, silakan login kembali." };

  const title = String(formData.get("title") || "").trim();
  const date = String(formData.get("date") || "");
  const time = String(formData.get("time") || "09:00");
  const notes = (formData.get("notes") as string) || null;
  const assignedTo = (formData.get("assigned_to") as string) || user.id;

  if (!title || !date) {
    return { error: "Judul dan tanggal follow up wajib diisi." };
  }

  const scheduledAt = new Date(`${date}T${time}:00`).toISOString();

  const { error } = await supabase.from("follow_ups").insert({
    lead_id: leadId,
    assigned_to: assignedTo,
    created_by: user.id,
    scheduled_at: scheduledAt,
    title,
    notes,
  });

  if (error) return { error: "Gagal menjadwalkan follow up. " + error.message };

  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/follow-ups");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function completeFollowUpAction(followUpId: string, leadId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("follow_ups")
    .update({ status: "done", completed_at: new Date().toISOString() })
    .eq("id", followUpId);

  if (error) throw error;

  await supabase.from("activities").insert({
    lead_id: leadId,
    user_id: user.id,
    type: "follow_up_done",
    title: "Follow up selesai",
    metadata: { follow_up_id: followUpId },
  });

  revalidatePath("/follow-ups");
  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/dashboard");
}

export async function rescheduleFollowUpAction(
  followUpId: string,
  leadId: string,
  newDate: string,
  newTime: string
) {
  const supabase = await createClient();
  const scheduledAt = new Date(`${newDate}T${newTime}:00`).toISOString();

  const { error } = await supabase
    .from("follow_ups")
    .update({
      scheduled_at: scheduledAt,
      status: "pending",
      rescheduled_to: scheduledAt,
    })
    .eq("id", followUpId);

  if (error) throw error;

  revalidatePath("/follow-ups");
  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/dashboard");
}
