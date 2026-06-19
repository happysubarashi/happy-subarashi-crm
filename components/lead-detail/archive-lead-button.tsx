"use client";

import { useState, useTransition } from "react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea, Label } from "@/components/ui/input";
import { archiveLeadAction } from "@/lib/actions/leads";
import { Trash2 } from "lucide-react";

export function ArchiveLeadButton({ leadId }: { leadId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="h-10 w-10 rounded-xl bg-zinc-50 text-zinc-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0"
        aria-label="Hapus lead"
      >
        <Trash2 className="h-[18px] w-[18px]" />
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title="Hapus Lead?">
        <div className="space-y-4">
          <p className="text-sm text-zinc-500">
            Lead akan diarsipkan dan tidak muncul lagi di daftar. Semua data tetap
            tersimpan dan bisa dipulihkan oleh Admin jika diperlukan.
          </p>
          <div>
            <Label htmlFor="archive_reason">Alasan (opsional)</Label>
            <Textarea
              id="archive_reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="cth. Data duplikat, salah input..."
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              loading={isPending}
              onClick={() =>
                startTransition(() => archiveLeadAction(leadId, reason || undefined))
              }
            >
              Ya, Hapus
            </Button>
          </div>
        </div>
      </Sheet>
    </>
  );
}
