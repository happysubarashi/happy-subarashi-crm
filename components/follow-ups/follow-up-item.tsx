"use client";

import { useState, useTransition } from "react";
import {
  completeFollowUpAction,
  rescheduleFollowUpAction,
} from "@/lib/actions/follow-ups";
import { Avatar } from "@/components/ui/elements";
import { StatusBadge } from "@/components/ui/status-badge";
import { Sheet } from "@/components/ui/sheet";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDate, whatsappLink } from "@/lib/utils";
import { Check, CalendarClock, MessageCircle } from "lucide-react";
import type { FollowUpWithLead } from "@/types/database.types";
import { format } from "date-fns";
import Link from "next/link";

export function FollowUpItem({ followUp }: { followUp: FollowUpWithLead }) {
  const [isPending, startTransition] = useTransition();
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState("09:00");

  return (
    <div className="bg-white rounded-2xl border border-brand-purple-50 shadow-soft p-4">
      <div className="flex items-start gap-3">
        <Link href={`/leads/${followUp.lead_id}`} className="flex-shrink-0">
          <Avatar name={followUp.lead.full_name} />
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={`/leads/${followUp.lead_id}`}>
            <p className="font-medium text-zinc-800 truncate">{followUp.lead.full_name}</p>
          </Link>
          <p className="text-sm text-zinc-500 mt-0.5">{followUp.title}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <StatusBadge stage={followUp.lead.pipeline_stage} />
            <span className="text-xs text-zinc-400">
              {formatDate(followUp.scheduled_at, true)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <Link
          href={whatsappLink(followUp.lead.phone)}
          target="_blank"
          className="flex-1 h-9 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-medium flex items-center justify-center gap-1.5"
        >
          <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
        </Link>
        <button
          onClick={() => setRescheduleOpen(true)}
          className="flex-1 h-9 rounded-xl bg-brand-purple-50 text-brand-purple-600 text-xs font-medium flex items-center justify-center gap-1.5"
        >
          <CalendarClock className="h-3.5 w-3.5" /> Jadwal Ulang
        </button>
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(() => completeFollowUpAction(followUp.id, followUp.lead_id))
          }
          className="flex-1 h-9 rounded-xl bg-emerald-500 text-white text-xs font-medium flex items-center justify-center gap-1.5"
        >
          <Check className="h-3.5 w-3.5" /> Selesai
        </button>
      </div>

      <Sheet
        open={rescheduleOpen}
        onClose={() => setRescheduleOpen(false)}
        title="Jadwal Ulang"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor={`date-${followUp.id}`}>Tanggal Baru</Label>
              <Input
                id={`date-${followUp.id}`}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`time-${followUp.id}`}>Waktu</Label>
              <Input
                id={`time-${followUp.id}`}
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
          <Button
            className="w-full"
            size="lg"
            loading={isPending}
            onClick={() =>
              startTransition(async () => {
                await rescheduleFollowUpAction(followUp.id, followUp.lead_id, date, time);
                setRescheduleOpen(false);
              })
            }
          >
            Simpan Jadwal Baru
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
