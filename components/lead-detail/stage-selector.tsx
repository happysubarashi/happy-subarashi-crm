"use client";

import { useState, useTransition } from "react";
import { PIPELINE_STAGES, STAGE_BADGE_CLASS } from "@/lib/constants";
import { updateLeadStageAction } from "@/lib/actions/leads";
import { cn } from "@/lib/utils";
import { Sheet } from "@/components/ui/sheet";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { PipelineStage } from "@/types/database.types";

export function StageSelector({
  leadId,
  currentStage,
}: {
  leadId: string;
  currentStage: PipelineStage;
}) {
  const [isPending, startTransition] = useTransition();
  const [pendingStage, setPendingStage] = useState<PipelineStage | null>(null);
  const [closingAmount, setClosingAmount] = useState("");
  const [lostReason, setLostReason] = useState("");

  function selectStage(stage: PipelineStage) {
    if (stage === currentStage) return;
    if (stage === "closing_won" || stage === "closing_lost") {
      setPendingStage(stage);
      return;
    }
    startTransition(() => updateLeadStageAction(leadId, stage));
  }

  function confirmSpecial() {
    if (!pendingStage) return;
    startTransition(() =>
      updateLeadStageAction(leadId, pendingStage, {
        closingAmount: closingAmount ? Number(closingAmount) : undefined,
        lostReason: lostReason || undefined,
      }).then(() => setPendingStage(null))
    );
  }

  return (
    <div>
      <p className="text-xs font-semibold text-brand-purple-400 uppercase tracking-wide mb-2">
        Update Status
      </p>
      <div className="flex flex-wrap gap-2">
        {PIPELINE_STAGES.map((s) => (
          <button
            key={s.value}
            disabled={isPending}
            onClick={() => selectStage(s.value)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
              currentStage === s.value
                ? STAGE_BADGE_CLASS[s.value] + " border-transparent ring-2 ring-offset-1 ring-brand-pink-200"
                : "bg-white text-zinc-500 border-brand-purple-100"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <Sheet
        open={!!pendingStage}
        onClose={() => setPendingStage(null)}
        title={pendingStage === "closing_won" ? "🎉 Closing!" : "Tidak Lanjut"}
      >
        {pendingStage === "closing_won" ? (
          <div className="space-y-4">
            <p className="text-sm text-zinc-500">
              Selamat! Catat nilai closing untuk laporan penjualan.
            </p>
            <div>
              <Label htmlFor="closing_amount">Nilai Closing (Rp)</Label>
              <Input
                id="closing_amount"
                type="number"
                placeholder="1500000"
                value={closingAmount}
                onChange={(e) => setClosingAmount(e.target.value)}
              />
            </div>
            <Button className="w-full" size="lg" loading={isPending} onClick={confirmSpecial}>
              Simpan Closing
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-zinc-500">
              Catat alasan agar tim bisa belajar untuk follow up berikutnya.
            </p>
            <div>
              <Label htmlFor="lost_reason">Alasan</Label>
              <Textarea
                id="lost_reason"
                placeholder="cth. Belum ada budget, sudah pakai produk lain..."
                value={lostReason}
                onChange={(e) => setLostReason(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="w-full"
              size="lg"
              loading={isPending}
              onClick={confirmSpecial}
            >
              Simpan
            </Button>
          </div>
        )}
      </Sheet>
    </div>
  );
}
