"use client";

import { Avatar } from "@/components/ui/elements";
import { HotLeadBadge } from "@/components/ui/status-badge";
import { formatRelative } from "@/lib/utils";
import type { LeadWithAssignee } from "@/types/database.types";
import type { KanbanColumn } from "@/lib/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const ORDER: KanbanColumn[] = ["new_lead", "contacted", "follow_up", "closing", "customer"];

export function KanbanCard({
  lead,
  column,
  onMove,
  onDragStart,
}: {
  lead: LeadWithAssignee;
  column: KanbanColumn;
  onMove: (leadId: string, column: KanbanColumn) => void;
  onDragStart: (e: React.DragEvent, leadId: string) => void;
}) {
  const idx = ORDER.indexOf(column);
  const prev = ORDER[idx - 1];
  const next = ORDER[idx + 1];

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, lead.id)}
      className="bg-white rounded-2xl border border-brand-purple-50 shadow-soft p-3 cursor-grab active:cursor-grabbing"
    >
      <Link href={`/leads/${lead.id}`} className="flex items-start gap-2.5">
        <Avatar name={lead.full_name} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 flex-wrap">
            <p className="text-sm font-medium text-zinc-800 truncate">{lead.full_name}</p>
            {lead.is_hot_lead && <HotLeadBadge />}
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            {formatRelative(lead.last_activity_at ?? lead.created_at)}
          </p>
        </div>
      </Link>

      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-brand-purple-50">
        <button
          disabled={!prev}
          onClick={() => prev && onMove(lead.id, prev)}
          className="h-7 w-7 rounded-lg bg-brand-purple-50 text-brand-purple-500 flex items-center justify-center disabled:opacity-0"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <span className="text-[10px] text-zinc-400">{lead.lead_code}</span>
        <button
          disabled={!next}
          onClick={() => next && onMove(lead.id, next)}
          className="h-7 w-7 rounded-lg bg-brand-purple-50 text-brand-purple-500 flex items-center justify-center disabled:opacity-0"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
