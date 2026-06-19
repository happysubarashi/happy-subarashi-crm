"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { NotificationSettings } from "@/types/database.types";

export interface ProfileFormState {
  error: string | null;
  success?: boolean;
}

export async function updateProfileAction(
  _prev: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesi habis, silakan login kembali." };

  const fullName = String(formData.get("full_name") || "").trim();
  const phone = (formData.get("phone") as string) || null;

  if (!fullName) return { error: "Nama wajib diisi." };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, phone })
    .eq("id", user.id);

  if (error) return { error: "Gagal menyimpan profil. " + error.message };

  revalidatePath("/settings");
  revalidatePath("/", "layout");
  return { error: null, success: true };
}

export async function uploadAvatarAction(formData: FormData): Promise<ProfileFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesi habis, silakan login kembali." };

  const file = formData.get("avatar") as File | null;
  if (!file || file.size === 0) return { error: "Pilih foto terlebih dahulu." };
  if (file.size > 3 * 1024 * 1024) return { error: "Ukuran foto maksimal 3MB." };

  const ext = file.name.split(".").pop();
  const path = `${user.id}/avatar-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { contentType: file.type, upsert: true });

  if (uploadError) return { error: "Gagal mengunggah foto. " + uploadError.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(path);

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", user.id);

  if (error) return { error: "Gagal menyimpan foto profil. " + error.message };

  revalidatePath("/settings");
  revalidatePath("/", "layout");
  return { error: null, success: true };
}

export async function updateNotificationSettingsAction(
  settings: NotificationSettings
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profiles")
    .update({ notification_settings: settings })
    .eq("id", user.id);

  if (error) throw error;
  revalidatePath("/settings");
}

export async function changePasswordAction(
  _prev: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createClient();
  const newPassword = String(formData.get("new_password") || "");
  const confirmPassword = String(formData.get("confirm_password") || "");

  if (newPassword.length < 8) {
    return { error: "Password minimal 8 karakter." };
  }
  if (newPassword !== confirmPassword) {
    return { error: "Konfirmasi password tidak cocok." };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: "Gagal mengubah password. " + error.message };

  return { error: null, success: true };
}
