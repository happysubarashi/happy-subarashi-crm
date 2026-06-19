"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ActivityType } from "@/types/database.types";
import { ACTIVITY_TYPE_LABEL } from "@/lib/constants";

export interface ActivityFormState {
  error: string | null;
}

export async function addActivityAction(
  leadId: string,
  _prev: ActivityFormState,
  formData: FormData
): Promise<ActivityFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesi habis, silakan login kembali." };

  const type = (formData.get("type") as ActivityType) || "note";
  const description = String(formData.get("description") || "").trim();

  if (!description) {
    return { error: "Catatan tidak boleh kosong." };
  }

  const { error } = await supabase.from("activities").insert({
    lead_id: leadId,
    user_id: user.id,
    type,
    title: ACTIVITY_TYPE_LABEL[type] ?? "Catatan",
    description,
  });

  if (error) return { error: "Gagal menyimpan catatan. " + error.message };

  revalidatePath(`/leads/${leadId}`);
  return { error: null };
}

export async function uploadFileAction(
  leadId: string,
  _prev: ActivityFormState,
  formData: FormData
): Promise<ActivityFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesi habis, silakan login kembali." };

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { error: "Pilih file terlebih dahulu." };
  }

  if (file.size > 10 * 1024 * 1024) {
    return { error: "Ukuran file maksimal 10MB." };
  }

  const ext = file.name.split(".").pop();
  const path = `${leadId}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("lead-files")
    .upload(path, file, { contentType: file.type });

  if (uploadError) {
    return { error: "Gagal mengunggah file. " + uploadError.message };
  }

  const {
    data: signedUrlData,
    error: signedUrlError,
  } = await supabase.storage
    .from("lead-files")
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 10); // 10-year signed URL

  if (signedUrlError || !signedUrlData) {
    return { error: "Gagal membuat tautan file. " + (signedUrlError?.message ?? "") };
  }

  const { error } = await supabase.from("activities").insert({
    lead_id: leadId,
    user_id: user.id,
    type: "file_upload",
    title: "File diunggah",
    description: file.name,
    metadata: {
      file_url: signedUrlData.signedUrl,
      file_path: path,
      file_name: file.name,
      file_type: file.type,
      size_bytes: file.size,
    },
  });

  if (error) return { error: "Gagal menyimpan riwayat file. " + error.message };

  revalidatePath(`/leads/${leadId}`);
  return { error: null };
}
