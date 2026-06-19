import type {
  PipelineStage,
  LeadSource,
  ActivityType,
  FollowupStatus,
  OrderStatus,
  UserRole,
} from "@/types/database.types";

export const PIPELINE_STAGES: { value: PipelineStage; label: string }[] = [
  { value: "lead_baru", label: "Lead Baru" },
  { value: "sudah_chat", label: "Sudah Chat" },
  { value: "konsultasi", label: "Konsultasi" },
  { value: "edukasi_produk", label: "Edukasi Produk" },
  { value: "menunggu_keputusan", label: "Menunggu Keputusan" },
  { value: "closing_won", label: "Closing" },
  { value: "closing_lost", label: "Tidak Lanjut" },
];

export const STAGE_LABEL: Record<PipelineStage, string> = Object.fromEntries(
  PIPELINE_STAGES.map((s) => [s.value, s.label])
) as Record<PipelineStage, string>;

/** Tailwind classes for each pipeline stage badge. */
export const STAGE_BADGE_CLASS: Record<PipelineStage, string> = {
  lead_baru: "bg-brand-pink-100 text-brand-pink-700",
  sudah_chat: "bg-sky-100 text-sky-700",
  konsultasi: "bg-amber-100 text-amber-700",
  edukasi_produk: "bg-violet-100 text-violet-700",
  menunggu_keputusan: "bg-orange-100 text-orange-700",
  closing_won: "bg-emerald-100 text-emerald-700",
  closing_lost: "bg-zinc-200 text-zinc-600",
};

export const ACTIVE_PIPELINE_STAGES: PipelineStage[] = [
  "lead_baru",
  "sudah_chat",
  "konsultasi",
  "edukasi_produk",
  "menunggu_keputusan",
];

export const LEAD_SOURCES: { value: LeadSource; label: string }[] = [
  { value: "meta_ads", label: "Meta Ads" },
  { value: "instagram", label: "Instagram" },
  { value: "referral", label: "Referral" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "tiktok", label: "TikTok" },
  { value: "website", label: "Website" },
  { value: "organic", label: "Organik" },
  { value: "other", label: "Lainnya" },
];

export const SOURCE_LABEL: Record<LeadSource, string> = Object.fromEntries(
  LEAD_SOURCES.map((s) => [s.value, s.label])
) as Record<LeadSource, string>;

export const HEALTH_CONDITIONS = [
  { value: "gagal_ginjal", label: "Gagal Ginjal" },
  { value: "stroke", label: "Stroke" },
  { value: "diabetes", label: "Diabetes" },
  { value: "autoimun", label: "Autoimun" },
  { value: "hipertensi", label: "Hipertensi" },
  { value: "gerd", label: "GERD" },
  { value: "kanker", label: "Kanker" },
  { value: "kolesterol", label: "Kolesterol" },
  { value: "asam_urat", label: "Asam Urat" },
];

export const HEALTH_CONDITION_LABEL: Record<string, string> = Object.fromEntries(
  HEALTH_CONDITIONS.map((h) => [h.value, h.label])
);

export const ACTIVITY_TYPE_LABEL: Record<ActivityType, string> = {
  whatsapp: "WhatsApp",
  call: "Telepon",
  instagram_dm: "DM Instagram",
  consultation: "Konsultasi",
  note: "Catatan",
  file_upload: "File",
  stage_change: "Perubahan Status",
  follow_up_done: "Follow Up Selesai",
  email: "Email",
};

export const FOLLOWUP_STATUS_LABEL: Record<FollowupStatus, string> = {
  pending: "Pending",
  done: "Selesai",
  rescheduled: "Dijadwal Ulang",
  missed: "Terlewat",
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Dikonfirmasi",
  delivered: "Terkirim",
  cancelled: "Dibatalkan",
};

export const ORDER_STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-sky-100 text-sky-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-zinc-200 text-zinc-600",
};

export const ROLE_LABEL: Record<UserRole, string> = {
  owner: "Owner",
  admin: "Admin",
  leader: "Leader",
  consultant: "Consultant",
};

export const ROLE_BADGE_CLASS: Record<UserRole, string> = {
  owner: "bg-brand-purple-700 text-white",
  admin: "bg-brand-purple-500 text-white",
  leader: "bg-brand-pink-200 text-brand-pink-800",
  consultant: "bg-zinc-100 text-zinc-600",
};

export const REORDER_REMINDER_OPTIONS = [
  { days: 30, label: "30 Hari" },
  { days: 60, label: "60 Hari" },
  { days: 90, label: "90 Hari" },
];

export type KanbanColumn = "new_lead" | "contacted" | "follow_up" | "closing" | "customer";

export const KANBAN_LABEL: Record<KanbanColumn, string> = {
  new_lead: "New Lead",
  contacted: "Contacted",
  follow_up: "Follow Up",
  closing: "Closing",
  customer: "Customer",
};

export const AGE_RANGES = ["<20", "20-29", "30-39", "40-49", "50+"] as const;
