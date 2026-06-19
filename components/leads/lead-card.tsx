import Link from "next/link";
import { Avatar } from "@/components/ui/elements";
import { StatusBadge, HotLeadBadge, TagPill } from "@/components/ui/status-badge";
import { formatRelative } from "@/lib/utils";
import type { LeadWithAssignee } from "@/types/database.types";
import { MapPin } from "lucide-react";

export function LeadCard({ lead }: { lead: LeadWithAssignee }) {
  return (
    <Link
      href={`/leads/${lead.id}`}
      className="block bg-white rounded-2xl border border-brand-purple-50 shadow-soft p-4 hover:shadow-card transition-shadow active:scale-[0.99]"
    >
      <div className="flex items-start gap-3">
        <Avatar name={lead.full_name} url={lead.assignee?.avatar_url} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="font-medium text-zinc-800 truncate">{lead.full_name}</p>
            {lead.is_hot_lead && <HotLeadBadge />}
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
            <span>{lead.lead_code}</span>
            {lead.city && (
              <span className="flex items-center gap-0.5">
                <MapPin className="h-3 w-3" /> {lead.city}
              </span>
            )}
          </div>

          {lead.health_conditions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {lead.health_conditions.slice(0, 3).map((c) => (
                <TagPill key={c} value={c} />
              ))}
              {lead.health_conditions.length > 3 && (
                <span className="text-xs text-zinc-400 self-center">
                  +{lead.health_conditions.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-3">
            <StatusBadge stage={lead.pipeline_stage} />
            <span className="text-xs text-zinc-400">
              {formatRelative(lead.last_activity_at ?? lead.created_at)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
