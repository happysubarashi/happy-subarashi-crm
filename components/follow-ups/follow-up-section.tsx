import { FollowUpItem } from "@/components/follow-ups/follow-up-item";
import { EmptyState } from "@/components/ui/elements";
import type { FollowUpWithLead } from "@/types/database.types";
import type { LucideIcon } from "lucide-react";

export function FollowUpSection({
  title,
  followUps,
  emptyIcon,
  emptyText,
  tone = "default",
}: {
  title: string;
  followUps: FollowUpWithLead[];
  emptyIcon: LucideIcon;
  emptyText: string;
  tone?: "default" | "danger";
}) {
  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h2
          className={`font-display font-semibold ${
            tone === "danger" ? "text-red-600" : "text-brand-purple-900"
          }`}
        >
          {title}
        </h2>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            tone === "danger"
              ? "bg-red-100 text-red-600"
              : "bg-brand-purple-100 text-brand-purple-600"
          }`}
        >
          {followUps.length}
        </span>
      </div>

      {followUps.length === 0 ? (
        <div className="bg-white rounded-2xl border border-brand-purple-50 shadow-soft">
          <EmptyState icon={emptyIcon} title={emptyText} />
        </div>
      ) : (
        <div className="space-y-3">
          {followUps.map((fu) => (
            <FollowUpItem key={fu.id} followUp={fu} />
          ))}
        </div>
      )}
    </section>
  );
}
