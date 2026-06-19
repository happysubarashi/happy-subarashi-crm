import { Card, EmptyState, Avatar } from "@/components/ui/elements";
import type { FollowUpWithLead } from "@/types/database.types";
import { format, parseISO } from "date-fns";
import { CalendarCheck2 } from "lucide-react";
import Link from "next/link";

export function FollowUpTodayWidget({
  followUps,
}: {
  followUps: FollowUpWithLead[];
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-brand-purple-900">
          Follow Up Hari Ini
        </h3>
        <Link href="/follow-ups" className="text-xs font-medium text-brand-pink-600">
          Lihat Semua
        </Link>
      </div>

      {followUps.length === 0 ? (
        <EmptyState
          icon={CalendarCheck2}
          title="Tidak ada follow up"
          description="Semua follow up hari ini sudah selesai 🎉"
        />
      ) : (
        <div className="space-y-1">
          {followUps.map((fu) => (
            <Link
              key={fu.id}
              href={`/leads/${fu.lead_id}`}
              className="flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-xl hover:bg-brand-purple-50/60 transition-colors"
            >
              <Avatar name={fu.lead.full_name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-800 truncate">
                  {fu.lead.full_name}
                </p>
                <p className="text-xs text-zinc-500 truncate">{fu.title}</p>
              </div>
              <span className="text-xs font-semibold text-brand-purple-600 flex-shrink-0">
                {format(parseISO(fu.scheduled_at), "HH:mm")}
              </span>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
