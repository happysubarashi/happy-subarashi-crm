"use client";

import { useState, useTransition } from "react";
import { updateNotificationSettingsAction } from "@/lib/actions/profiles";
import type { NotificationSettings } from "@/types/database.types";
import { cn } from "@/lib/utils";

const LABELS: { key: keyof NotificationSettings; label: string; description: string }[] = [
  { key: "daily_summary", label: "Ringkasan Harian", description: "Ringkasan lead & follow up tiap pagi" },
  { key: "followup_reminders", label: "Pengingat Follow Up", description: "Notifikasi follow up yang akan jatuh tempo" },
  { key: "hot_lead_alerts", label: "Notifikasi Hot Lead", description: "Saat ada lead baru ditandai hot" },
  { key: "email_enabled", label: "Notifikasi Email", description: "Terima notifikasi lewat email" },
];

export function NotificationToggles({
  settings,
}: {
  settings: NotificationSettings;
}) {
  const [state, setState] = useState(settings);
  const [isPending, startTransition] = useTransition();

  function toggle(key: keyof NotificationSettings) {
    const next = { ...state, [key]: !state[key] };
    setState(next);
    startTransition(() => updateNotificationSettingsAction(next));
  }

  return (
    <div className="space-y-1">
      {LABELS.map((item) => (
        <div
          key={item.key}
          className="flex items-center justify-between py-3 border-b border-brand-purple-50 last:border-0"
        >
          <div className="min-w-0 pr-3">
            <p className="text-sm font-medium text-zinc-800">{item.label}</p>
            <p className="text-xs text-zinc-400 mt-0.5">{item.description}</p>
          </div>
          <button
            disabled={isPending}
            onClick={() => toggle(item.key)}
            className={cn(
              "h-6 w-11 rounded-full flex-shrink-0 relative transition-colors",
              state[item.key] ? "bg-brand-purple-500" : "bg-zinc-200"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                state[item.key] ? "translate-x-[22px]" : "translate-x-0.5"
              )}
            />
          </button>
        </div>
      ))}
    </div>
  );
}
