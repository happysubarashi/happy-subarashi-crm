"use client";

import { useActionState, useState } from "react";
import { createFollowUpAction } from "@/lib/actions/follow-ups";
import { Input, Label, Textarea, FieldError } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { CalendarPlus } from "lucide-react";
import type { Profile } from "@/types/database.types";
import { format, addDays } from "date-fns";

const QUICK_PRESETS = [
  { label: "Besok", days: 1 },
  { label: "3 Hari", days: 3 },
  { label: "1 Minggu", days: 7 },
];

export function ScheduleFollowUpForm({
  leadId,
  teamMembers,
  currentUserId,
}: {
  leadId: string;
  teamMembers: Profile[];
  currentUserId: string;
}) {
  const [open, setOpen] = useState(false);
  const boundAction = createFollowUpAction.bind(null, leadId);
  const [state, formAction, isPending] = useActionState(boundAction, { error: null });
  const [date, setDate] = useState(format(addDays(new Date(), 1), "yyyy-MM-dd"));

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        <CalendarPlus className="h-4 w-4" /> Jadwalkan Follow Up
      </Button>

      <Sheet open={open} onClose={() => setOpen(false)} title="Jadwalkan Follow Up">
        <form
          action={async (formData) => {
            await formAction(formData);
            setOpen(false);
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="title">Judul Follow Up *</Label>
            <Input
              id="title"
              name="title"
              placeholder="cth. Tanya hasil konsultasi"
              required
            />
          </div>

          <div className="flex gap-1.5">
            {QUICK_PRESETS.map((p) => (
              <button
                key={p.days}
                type="button"
                onClick={() => setDate(format(addDays(new Date(), p.days), "yyyy-MM-dd"))}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-brand-purple-50 text-brand-purple-600"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="date">Tanggal *</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Waktu</Label>
              <Input id="time" name="time" type="time" defaultValue="09:00" />
            </div>
          </div>

          <div>
            <Label htmlFor="assigned_to">Ditugaskan Ke</Label>
            <Select id="assigned_to" name="assigned_to" defaultValue={currentUserId}>
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Catatan</Label>
            <Textarea id="notes" name="notes" placeholder="Hal yang perlu dibahas..." />
          </div>

          <FieldError>{state.error ?? undefined}</FieldError>

          <Button type="submit" className="w-full" size="lg" loading={isPending}>
            Jadwalkan
          </Button>
        </form>
      </Sheet>
    </>
  );
}
