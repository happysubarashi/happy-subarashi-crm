"use client";

import { useTransition } from "react";
import { toggleHotLeadAction } from "@/lib/actions/leads";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export function HotLeadToggle({
  leadId,
  isHot,
}: {
  leadId: string;
  isHot: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => toggleHotLeadAction(leadId, !isHot))}
      className={cn(
        "h-10 w-10 rounded-xl flex items-center justify-center transition-colors flex-shrink-0",
        isHot ? "bg-red-50 text-red-500" : "bg-zinc-50 text-zinc-300"
      )}
      aria-label="Toggle hot lead"
    >
      <Flame className={cn("h-5 w-5", isHot && "fill-red-500")} />
    </button>
  );
}
