import { Card } from "@/components/ui/elements";
import { STAGE_LABEL, STAGE_BADGE_CLASS } from "@/lib/constants";
import type { StageCount } from "@/lib/queries/dashboard";
import Link from "next/link";

export function PipelineOverview({ data }: { data: StageCount[] }) {
  const total = data.reduce((sum, s) => sum + s.count, 0) || 1;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-brand-purple-900">
          Leads by Stage
        </h3>
        <Link
          href="/pipeline"
          className="text-xs font-medium text-brand-pink-600"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="space-y-3">
        {data.map((item) => {
          const dotColor = STAGE_BADGE_CLASS[item.stage].split(" ")[1]; // text-* class reused as dot color hint
          return (
            <Link
              key={item.stage}
              href={`/pipeline`}
              className="flex items-center gap-3 group"
            >
              <span className="text-xs text-zinc-500 w-32 flex-shrink-0 truncate">
                {STAGE_LABEL[item.stage]}
              </span>
              <div className="flex-1 h-2 bg-brand-purple-50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-purple-400 to-brand-pink-400 rounded-full transition-all"
                  style={{ width: `${(item.count / total) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-brand-purple-800 w-6 text-right flex-shrink-0">
                {item.count}
              </span>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
