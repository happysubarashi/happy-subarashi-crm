import { ACTIVITY_TYPE_LABEL } from "@/lib/constants";
import { formatRelative } from "@/lib/utils";
import type { ActivityWithUser } from "@/types/database.types";
import { EmptyState, Avatar } from "@/components/ui/elements";
import {
  MessageCircle,
  Phone,
  Instagram,
  Stethoscope,
  StickyNote,
  Paperclip,
  ArrowRightLeft,
  CalendarCheck,
  Mail,
  History,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  whatsapp: MessageCircle,
  call: Phone,
  instagram_dm: Instagram,
  consultation: Stethoscope,
  note: StickyNote,
  file_upload: Paperclip,
  stage_change: ArrowRightLeft,
  follow_up_done: CalendarCheck,
  email: Mail,
};

const ICON_COLOR: Record<string, string> = {
  whatsapp: "bg-emerald-50 text-emerald-500",
  call: "bg-sky-50 text-sky-500",
  instagram_dm: "bg-pink-50 text-pink-500",
  consultation: "bg-violet-50 text-violet-500",
  note: "bg-zinc-100 text-zinc-500",
  file_upload: "bg-amber-50 text-amber-500",
  stage_change: "bg-brand-purple-50 text-brand-purple-500",
  follow_up_done: "bg-emerald-50 text-emerald-500",
  email: "bg-sky-50 text-sky-500",
};

export function ActivityTimeline({ activities }: { activities: ActivityWithUser[] }) {
  if (activities.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="Belum ada aktivitas"
        description="Catatan, follow up, dan perubahan status akan muncul di sini."
      />
    );
  }

  return (
    <div className="space-y-0">
      {activities.map((activity, idx) => {
        const Icon = ICON_MAP[activity.type] ?? StickyNote;
        const isLast = idx === activities.length - 1;

        return (
          <div key={activity.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${ICON_COLOR[activity.type]}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              {!isLast && <div className="w-px flex-1 bg-brand-purple-50 my-1" />}
            </div>
            <div className="pb-5 min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-zinc-800">{activity.title}</p>
                <span className="text-xs text-zinc-400 flex-shrink-0">
                  {formatRelative(activity.created_at)}
                </span>
              </div>
              {activity.description && (
                <p className="text-sm text-zinc-500 mt-0.5 whitespace-pre-line">
                  {activity.description}
                </p>
              )}
              {activity.type === "file_upload" &&
                typeof activity.metadata?.file_url === "string" && (
                  <a
                    href={activity.metadata.file_url as string}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 mt-1.5 text-xs font-medium text-brand-purple-600 bg-brand-purple-50 px-2.5 py-1 rounded-full"
                  >
                    <Paperclip className="h-3 w-3" />
                    Lihat File
                  </a>
                )}
              <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                <Avatar name={activity.user.full_name} size="sm" />
                {activity.user.full_name}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
