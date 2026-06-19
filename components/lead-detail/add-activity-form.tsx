"use client";

import { useActionState, useState } from "react";
import { addActivityAction } from "@/lib/actions/activities";
import { Textarea, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ActivityType } from "@/types/database.types";
import { MessageCircle, Phone, Stethoscope, StickyNote } from "lucide-react";

const QUICK_TYPES: { value: ActivityType; label: string; icon: typeof StickyNote }[] = [
  { value: "note", label: "Catatan", icon: StickyNote },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { value: "call", label: "Telepon", icon: Phone },
  { value: "consultation", label: "Konsultasi", icon: Stethoscope },
];

export function AddActivityForm({ leadId }: { leadId: string }) {
  const boundAction = addActivityAction.bind(null, leadId);
  const [state, formAction, isPending] = useActionState(boundAction, { error: null });
  const [type, setType] = useState<ActivityType>("note");

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="type" value={type} />
      <div className="flex gap-1.5 flex-wrap">
        {QUICK_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setType(t.value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
              type === t.value
                ? "bg-brand-purple-500 text-white border-brand-purple-500"
                : "bg-white text-zinc-500 border-brand-purple-100"
            )}
          >
            <t.icon className="h-3 w-3" />
            {t.label}
          </button>
        ))}
      </div>
      <Textarea
        name="description"
        placeholder="Tulis catatan aktivitas..."
        required
      />
      <FieldError>{state.error ?? undefined}</FieldError>
      <Button type="submit" size="sm" loading={isPending}>
        Simpan Catatan
      </Button>
    </form>
  );
}
