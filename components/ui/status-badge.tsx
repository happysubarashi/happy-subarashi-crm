import { Badge } from "@/components/ui/elements";
import {
  STAGE_BADGE_CLASS,
  STAGE_LABEL,
  HEALTH_CONDITION_LABEL,
} from "@/lib/constants";
import type { PipelineStage } from "@/types/database.types";
import { Flame } from "lucide-react";

export function StatusBadge({ stage }: { stage: PipelineStage }) {
  return (
    <Badge className={STAGE_BADGE_CLASS[stage]}>{STAGE_LABEL[stage]}</Badge>
  );
}

export function HotLeadBadge() {
  return (
    <Badge className="bg-gradient-to-r from-orange-100 to-red-100 text-red-600 gap-1">
      <Flame className="h-3 w-3 fill-red-500 text-red-500" />
      Hot
    </Badge>
  );
}

export function TagPill({ value }: { value: string }) {
  return (
    <Badge className="bg-brand-purple-50 text-brand-purple-600 border border-brand-purple-100">
      {HEALTH_CONDITION_LABEL[value] ?? value}
    </Badge>
  );
}
