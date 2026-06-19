"use client";

import { useTransition } from "react";
import { completeFollowUpAction } from "@/lib/actions/follow-ups";
import { formatDate } from "@/lib/utils";
import { Check, Clock } from "lucide-react";
import type { FollowUp } from "@/types/database.types";

export function LeadFollowUpList({ followUps }: { followUps: FollowUp[] }) {
  const [isPending, startTransition] = useTransition();

  if (followUps.length === 0) return null;

  return (
    <div className="space-y-2">
      {followUps.map((fu) => (
        <div
          key={fu.id}
          className="flex items-center gap-3 bg-amber-50/70 rounded-xl px-3.5 py-3"
        >
          <Clock className="h-4 w-4 text-amber-500 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-amber-900 truncate">{fu.title}</p>
            <p className="text-xs text-amber-600">{formatDate(fu.scheduled_at, true)}</p>
          </div>
          <button
            disabled={isPending}
            onClick={() =>
              startTransition(() => completeFollowUpAction(fu.id, fu.lead_id))
            }
            className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-emerald-500 flex-shrink-0 shadow-sm"
            aria-label="Tandai selesai"
          >
            <Check className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
