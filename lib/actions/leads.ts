"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Lead, LeadSource, PipelineStage } from "@/types/database.types";
import { STAGE_LABEL, KANBAN_LABEL, type KanbanColumn } from "@/lib/constants";

export interface LeadFormState {
  error: string | null;
}

function parseHealthConditions(formData: FormData): string[] {
  return formData.getAll("health_conditions").map(String).filter(Boolean);
}

function parseProductIds(formData: FormData): string[] {
  return formData.getAll("product_ids").map(String).filter(Boolean);
}

const GENDERS = ["female", "male", "other"] as const;
function parseGender(formData: FormData): Lead["gender"] {
  const value = formData.get("gender");
  return GENDERS.includes(value as (typeof GENDERS)[number])
    ? (value as Lead["gender"])
    : null;
}

const AGE_RANGES = ["<20", "20-29", "30-39", "40-49", "50+"] as const;
function parseAgeRange(formData: FormData): Lead["age_range"] {
  const value = formData.get("age_range");
  return AGE_RANGES.includes(value as (typeof AGE_RANGES)[number])
    ? (value as Lead["age_range"])
    : null;
}

const SOURCES: LeadSource[] = [
  "meta_ads",
  "instagram",
  "referral",
  "whatsapp",
  "tiktok",
  "website",
  "organic",
  "other",
];
function parseSource(formData: FormData): LeadSource {
  const value = formData.get("source");
  return SOURCES.includes(value as LeadSource) ? (value as LeadSource) : "other";
}

export async function createLeadAction(
  _prev: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesi habis, silakan login kembali." };

  const fullName = String(formData.get("full_name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();

  if (!fullName || !phone) {
    return { error: "Nama dan nomor WhatsApp wajib diisi." };
  }

  const payload = {
    full_name: fullName,
    phone,
    email: (formData.get("email") as string) || null,
    city: (formData.get("city") as string) || null,
    gender: parseGender(formData),
    age_range: parseAgeRange(formData),
    source: parseSource(formData),
    source_detail: (formData.get("source_detail") as string) || null,
    health_conditions: parseHealthConditions(formData),
    notes: (formData.get("notes") as string) || null,
    referral_name: (formData.get("referral_name") as string) || null,
    referral_phone: (formData.get("referral_phone") as string) || null,
    assigned_to: (formData.get("assigned_to") as string) || user.id,
    is_hot_lead: formData.get("is_hot_lead") === "on",
    created_by: user.id,
    first_contact_at: new Date().toISOString(),
    last_activity_at: new Date().toISOString(),
  };

  const { data: lead, error } = await supabase
    .from("leads")
    .insert(payload)
    .select("id")
    .single();

  if (error || !lead) {
    return { error: "Gagal menyimpan lead. " + (error?.message ?? "") };
  }

  const productIds = parseProductIds(formData);
  if (productIds.length > 0) {
    await supabase
      .from("lead_products")
      .insert(productIds.map((product_id) => ({ lead_id: lead.id, product_id })));
  }

  await supabase.from("activities").insert({
    lead_id: lead.id,
    user_id: user.id,
    type: "note",
    title: "Lead baru ditambahkan",
    description: payload.notes ?? undefined,
  });

  revalidatePath("/leads");
  revalidatePath("/dashboard");
  redirect(`/leads/${lead.id}`);
}

export async function updateLeadAction(
  leadId: string,
  _prev: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesi habis, silakan login kembali." };

  const fullName = String(formData.get("full_name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  if (!fullName || !phone) {
    return { error: "Nama dan nomor WhatsApp wajib diisi." };
  }

  const payload = {
    full_name: fullName,
    phone,
    email: (formData.get("email") as string) || null,
    city: (formData.get("city") as string) || null,
    gender: parseGender(formData),
    age_range: parseAgeRange(formData),
    source: parseSource(formData),
    source_detail: (formData.get("source_detail") as string) || null,
    health_conditions: parseHealthConditions(formData),
    notes: (formData.get("notes") as string) || null,
    referral_name: (formData.get("referral_name") as string) || null,
    referral_phone: (formData.get("referral_phone") as string) || null,
    assigned_to: (formData.get("assigned_to") as string) || null,
    is_hot_lead: formData.get("is_hot_lead") === "on",
  };

  const { error } = await supabase.from("leads").update(payload).eq("id", leadId);
  if (error) return { error: "Gagal memperbarui lead. " + error.message };

  // Sync products: delete all, re-insert selected
  const productIds = parseProductIds(formData);
  await supabase.from("lead_products").delete().eq("lead_id", leadId);
  if (productIds.length > 0) {
    await supabase
      .from("lead_products")
      .insert(productIds.map((product_id) => ({ lead_id: leadId, product_id })));
  }

  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/leads");
  redirect(`/leads/${leadId}`);
}

export async function updateLeadStageAction(
  leadId: string,
  newStage: PipelineStage,
  options?: { closingAmount?: number; lostReason?: string }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: current } = await supabase
    .from("leads")
    .select("pipeline_stage")
    .eq("id", leadId)
    .single();

  const updatePayload: Partial<Lead> = { pipeline_stage: newStage };

  if (newStage === "closing_won") {
    updatePayload.closing_date = new Date().toISOString().slice(0, 10);
    updatePayload.is_member = true;
    if (options?.closingAmount) updatePayload.closing_amount = options.closingAmount;
  }
  if (newStage === "closing_lost" && options?.lostReason) {
    updatePayload.lost_reason = options.lostReason;
  }

  const { error } = await supabase.from("leads").update(updatePayload).eq("id", leadId);
  if (error) throw error;

  await supabase.from("activities").insert({
    lead_id: leadId,
    user_id: user.id,
    type: "stage_change",
    title: `Status diubah ke ${STAGE_LABEL[newStage]}`,
    metadata: { from: current?.pipeline_stage ?? null, to: newStage },
  });

  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/leads");
  revalidatePath("/dashboard");
}

export async function toggleHotLeadAction(leadId: string, isHot: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({ is_hot_lead: isHot })
    .eq("id", leadId);
  if (error) throw error;
  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/leads");
  revalidatePath("/dashboard");
}

export async function moveLeadKanbanAction(leadId: string, column: KanbanColumn) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: current } = await supabase
    .from("leads")
    .select("pipeline_stage")
    .eq("id", leadId)
    .single();

  const updatePayload: Partial<Lead> = {};

  switch (column) {
    case "new_lead":
      updatePayload.pipeline_stage = "lead_baru";
      break;
    case "contacted":
      updatePayload.pipeline_stage = "sudah_chat";
      break;
    case "follow_up":
      updatePayload.pipeline_stage = "konsultasi";
      break;
    case "closing":
      updatePayload.pipeline_stage = "closing_won";
      updatePayload.closing_date = new Date().toISOString().slice(0, 10);
      break;
    case "customer":
      updatePayload.pipeline_stage = "closing_won";
      updatePayload.is_member = true;
      if (!current) break;
      break;
  }

  const { error } = await supabase.from("leads").update(updatePayload).eq("id", leadId);
  if (error) throw error;

  await supabase.from("activities").insert({
    lead_id: leadId,
    user_id: user.id,
    type: "stage_change",
    title: `Dipindahkan ke ${KANBAN_LABEL[column]}`,
    metadata: { from: current?.pipeline_stage ?? null, to: updatePayload.pipeline_stage },
  });

  revalidatePath("/pipeline");
  revalidatePath("/leads");
  revalidatePath("/customers");
  revalidatePath("/dashboard");
}

export async function archiveLeadAction(leadId: string, reason?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("leads")
    .update({
      archived_at: new Date().toISOString(),
      archived_by: user.id,
      archive_reason: reason ?? null,
    })
    .eq("id", leadId);

  if (error) throw error;

  revalidatePath("/leads");
  revalidatePath("/dashboard");
  redirect("/leads");
}
