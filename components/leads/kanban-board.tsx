"use client";

import { useOptimistic, useTransition, useState } from "react";
import { KanbanCard } from "@/components/leads/kanban-card";
import { moveLeadKanbanAction } from "@/lib/actions/leads";
import { KANBAN_LABEL, type KanbanColumn } from "@/lib/constants";
import type { LeadWithAssignee } from "@/types/database.types";
import type { KanbanBuckets } from "@/lib/queries/leads";
import { cn } from "@/lib/utils";

const COLUMNS: { key: KanbanColumn; dot: string }[] = [
  { key: "new_lead", dot: "bg-brand-pink-400" },
  { key: "contacted", dot: "bg-sky-400" },
  { key: "follow_up", dot: "bg-amber-400" },
  { key: "closing", dot: "bg-violet-400" },
  { key: "customer", dot: "bg-emerald-400" },
];

export function KanbanBoard({ buckets }: { buckets: KanbanBuckets }) {
  const [isPending, startTransition] = useTransition();
  const [dragLeadId, setDragLeadId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<KanbanColumn | null>(null);

  const [optimisticBuckets, applyMove] = useOptimistic(
    buckets,
    (state, { leadId, column }: { leadId: string; column: KanbanColumn }) => {
      let movedLead: LeadWithAssignee | undefined;
      const next: KanbanBuckets = {
        new_lead: state.new_lead.filter((l) => {
          if (l.id === leadId) movedLead = l;
          return l.id !== leadId;
        }),
        contacted: state.contacted.filter((l) => {
          if (l.id === leadId) movedLead = l;
          return l.id !== leadId;
        }),
        follow_up: state.follow_up.filter((l) => {
          if (l.id === leadId) movedLead = l;
          return l.id !== leadId;
        }),
        closing: state.closing.filter((l) => {
          if (l.id === leadId) movedLead = l;
          return l.id !== leadId;
        }),
        customer: state.customer.filter((l) => {
          if (l.id === leadId) movedLead = l;
          return l.id !== leadId;
        }),
      };
      if (movedLead) next[column] = [movedLead, ...next[column]];
      return next;
    }
  );

  function handleMove(leadId: string, column: KanbanColumn) {
    startTransition(async () => {
      applyMove({ leadId, column });
      await moveLeadKanbanAction(leadId, column);
    });
  }

  return (
    <div className="flex gap-3 overflow-x-auto px-4 lg:px-8 pb-6 -mx-1 snap-x">
      {COLUMNS.map((col) => {
        const leads = optimisticBuckets[col.key];
        return (
          <div
            key={col.key}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverCol(col.key);
            }}
            onDragLeave={() => setDragOverCol(null)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOverCol(null);
              if (dragLeadId) handleMove(dragLeadId, col.key);
              setDragLeadId(null);
            }}
            className={cn(
              "flex-shrink-0 w-[270px] snap-start rounded-2xl p-2.5 transition-colors",
              dragOverCol === col.key ? "bg-brand-pink-50" : "bg-brand-purple-50/40"
            )}
          >
            <div className="flex items-center gap-2 px-1.5 py-1.5 mb-2">
              <span className={cn("h-2 w-2 rounded-full", col.dot)} />
              <h3 className="text-sm font-semibold text-brand-purple-900">
                {KANBAN_LABEL[col.key]}
              </h3>
              <span className="ml-auto text-xs font-medium text-zinc-400 bg-white px-2 py-0.5 rounded-full">
                {leads.length}
              </span>
            </div>

            <div className="space-y-2 min-h-[60px]">
              {leads.map((lead) => (
                <KanbanCard
                  key={lead.id}
                  lead={lead}
                  column={col.key}
                  onMove={handleMove}
                  onDragStart={(e, leadId) => {
                    setDragLeadId(leadId);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                />
              ))}
              {leads.length === 0 && (
                <p className="text-center text-xs text-zinc-300 py-6">Kosong</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
