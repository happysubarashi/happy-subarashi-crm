// ============================================================
// Supabase Database Types — Happy Subarashi CRM
// Hand-authored to match schema v1.1.0 exactly.
// If the schema changes, regenerate with:
//   npx supabase gen types typescript --project-id <ref> > types/database.types.ts
// ============================================================

export type UserRole = "owner" | "admin" | "leader" | "consultant";

export type LeadSource =
  | "meta_ads"
  | "instagram"
  | "referral"
  | "whatsapp"
  | "tiktok"
  | "website"
  | "organic"
  | "other";

export type PipelineStage =
  | "lead_baru"
  | "sudah_chat"
  | "konsultasi"
  | "edukasi_produk"
  | "menunggu_keputusan"
  | "closing_won"
  | "closing_lost";

export type ActivityType =
  | "whatsapp"
  | "call"
  | "instagram_dm"
  | "consultation"
  | "note"
  | "file_upload"
  | "stage_change"
  | "follow_up_done"
  | "email";

export type FollowupStatus = "pending" | "done" | "rescheduled" | "missed";

export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";

export interface NotificationSettings {
  email_enabled: boolean;
  daily_summary: boolean;
  followup_reminders: boolean;
  hot_lead_alerts: boolean;
  reminder_minutes_before: number;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: UserRole;
          is_active: boolean;
          managed_by: string | null;
          notification_settings: NotificationSettings;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          is_active?: boolean;
          managed_by?: string | null;
          notification_settings?: NotificationSettings;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          code: string;
          description: string | null;
          price: number;
          member_price: number | null;
          category: string | null;
          image_url: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["products"]["Row"]> & {
          name: string;
          code: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          lead_code: string;
          full_name: string;
          phone: string;
          phone_normalized: string | null;
          email: string | null;
          city: string | null;
          gender: "female" | "male" | "other" | null;
          age_range: "<20" | "20-29" | "30-39" | "40-49" | "50+" | null;
          source: LeadSource;
          source_detail: string | null;
          health_conditions: string[];
          notes: string | null;
          referral_name: string | null;
          referral_phone: string | null;
          pipeline_stage: PipelineStage;
          is_hot_lead: boolean;
          is_member: boolean;
          closing_date: string | null;
          closing_amount: number | null;
          currency: string;
          lost_reason: string | null;
          archived_at: string | null;
          archived_by: string | null;
          archive_reason: string | null;
          first_contact_at: string | null;
          last_activity_at: string | null;
          assigned_to: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          full_name: string;
          phone: string;
          email?: string | null;
          city?: string | null;
          gender?: "female" | "male" | "other" | null;
          age_range?: "<20" | "20-29" | "30-39" | "40-49" | "50+" | null;
          source?: LeadSource;
          source_detail?: string | null;
          health_conditions?: string[];
          notes?: string | null;
          referral_name?: string | null;
          referral_phone?: string | null;
          pipeline_stage?: PipelineStage;
          is_hot_lead?: boolean;
          is_member?: boolean;
          closing_date?: string | null;
          closing_amount?: number | null;
          archived_at?: string | null;
          archived_by?: string | null;
          archive_reason?: string | null;
          first_contact_at?: string | null;
          last_activity_at?: string | null;
          assigned_to?: string | null;
          created_by: string;
        };
        Update: Partial<Database["public"]["Tables"]["leads"]["Row"]>;
        Relationships: [];
      };
      lead_products: {
        Row: {
          id: string;
          lead_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: { lead_id: string; product_id: string };
        Update: Partial<Database["public"]["Tables"]["lead_products"]["Row"]>;
        Relationships: [];
      };
      activities: {
        Row: {
          id: string;
          lead_id: string;
          user_id: string;
          type: ActivityType;
          title: string;
          description: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          lead_id: string;
          user_id: string;
          type: ActivityType;
          title: string;
          description?: string | null;
          metadata?: Record<string, unknown>;
        };
        Update: Partial<Database["public"]["Tables"]["activities"]["Row"]>;
        Relationships: [];
      };
      follow_ups: {
        Row: {
          id: string;
          lead_id: string;
          assigned_to: string;
          created_by: string;
          scheduled_at: string;
          title: string;
          notes: string | null;
          status: FollowupStatus;
          completed_at: string | null;
          rescheduled_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          lead_id: string;
          assigned_to: string;
          created_by: string;
          scheduled_at: string;
          title: string;
          notes?: string | null;
          status?: FollowupStatus;
          completed_at?: string | null;
          rescheduled_to?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["follow_ups"]["Row"]>;
        Relationships: [];
      };
      repeat_orders: {
        Row: {
          id: string;
          order_code: string;
          lead_id: string | null;
          customer_name: string;
          customer_phone: string;
          order_date: string;
          total_amount: number;
          currency: string;
          status: OrderStatus;
          notes: string | null;
          next_followup_date: string | null;
          assigned_to: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          lead_id?: string | null;
          customer_name: string;
          customer_phone: string;
          order_date?: string;
          status?: OrderStatus;
          notes?: string | null;
          next_followup_date?: string | null;
          assigned_to: string;
          created_by: string;
        };
        Update: Partial<Database["public"]["Tables"]["repeat_orders"]["Row"]>;
        Relationships: [];
      };
      repeat_order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          quantity: number;
          unit_price: number;
          subtotal: number;
          created_at: string;
        };
        Insert: {
          order_id: string;
          product_id: string;
          product_name: string;
          quantity: number;
          unit_price: number;
        };
        Update: Partial<
          Database["public"]["Tables"]["repeat_order_items"]["Row"]
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      lead_source: LeadSource;
      pipeline_stage: PipelineStage;
      activity_type: ActivityType;
      followup_status: FollowupStatus;
      order_status: OrderStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}

// ── Convenience row aliases ─────────────────────────────────
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type Activity = Database["public"]["Tables"]["activities"]["Row"];
export type FollowUp = Database["public"]["Tables"]["follow_ups"]["Row"];
export type RepeatOrder =
  Database["public"]["Tables"]["repeat_orders"]["Row"];
export type RepeatOrderItem =
  Database["public"]["Tables"]["repeat_order_items"]["Row"];

// ── Joined / composite types used in the UI ─────────────────
export type LeadWithAssignee = Lead & {
  assignee: Pick<Profile, "id" | "full_name" | "avatar_url"> | null;
};

export type ActivityWithUser = Activity & {
  user: Pick<Profile, "id" | "full_name" | "avatar_url">;
};

export type RepeatOrderWithItems = RepeatOrder & {
  items: RepeatOrderItem[];
};

export type FollowUpWithLead = FollowUp & {
  lead: Pick<Lead, "id" | "lead_code" | "full_name" | "phone" | "pipeline_stage">;
};
