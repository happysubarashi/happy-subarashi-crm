"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { isManager } from "@/lib/queries/profiles";
import { revalidatePath } from "next/cache";
import type { UserRole } from "@/types/database.types";

export interface TeamFormState {
  error: string | null;
  success?: boolean;
}

async function assertManager() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !isManager(profile.role)) {
    throw new Error("Hanya Owner atau Admin yang bisa mengelola tim.");
  }
}

export async function inviteTeamMemberAction(
  _prev: TeamFormState,
  formData: FormData
): Promise<TeamFormState> {
  try {
    await assertManager();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const email = String(formData.get("email") || "").trim();
  const fullName = String(formData.get("full_name") || "").trim();
  const role = (formData.get("role") as UserRole) || "consultant";

  if (!email || !fullName) {
    return { error: "Nama dan email wajib diisi." };
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      error:
        "SUPABASE_SERVICE_ROLE_KEY belum diatur di server. Tambahkan anggota tim secara manual lewat Supabase Auth dashboard untuk saat ini.",
    };
  }

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName },
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
  });

  if (error || !data?.user) {
    return { error: "Gagal mengundang anggota. " + (error?.message ?? "") };
  }

  // The handle_new_user() trigger already created a profile row with default role.
  // Update it with the chosen role.
  await admin.from("profiles").update({ role }).eq("id", data.user.id);

  revalidatePath("/settings/team");
  return { error: null, success: true };
}

export async function updateMemberRoleAction(memberId: string, role: UserRole) {
  await assertManager();
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ role }).eq("id", memberId);
  if (error) throw error;
  revalidatePath("/settings/team");
}

export async function updateMemberManagerAction(
  memberId: string,
  managedBy: string | null
) {
  await assertManager();
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ managed_by: managedBy })
    .eq("id", memberId);
  if (error) throw error;
  revalidatePath("/settings/team");
}

export async function toggleMemberActiveAction(memberId: string, isActive: boolean) {
  await assertManager();
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ is_active: isActive })
    .eq("id", memberId);
  if (error) throw error;
  revalidatePath("/settings/team");
}
