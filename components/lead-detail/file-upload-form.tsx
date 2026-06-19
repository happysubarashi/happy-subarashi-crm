"use client";

import { useActionState, useRef } from "react";
import { uploadFileAction } from "@/lib/actions/activities";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/input";
import { Paperclip, Upload } from "lucide-react";

export function FileUploadForm({ leadId }: { leadId: string }) {
  const boundAction = uploadFileAction.bind(null, leadId);
  const [state, formAction, isPending] = useActionState(boundAction, { error: null });
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-brand-purple-200 rounded-2xl py-8 cursor-pointer hover:bg-brand-purple-50/40 transition-colors">
        <Upload className="h-6 w-6 text-brand-purple-300" />
        <span className="text-sm text-brand-purple-500 font-medium">
          Ketuk untuk pilih file
        </span>
        <span className="text-xs text-zinc-400">Foto, PDF, hasil lab — maks 10MB</span>
        <input
          type="file"
          name="file"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) {
              e.target.form?.requestSubmit();
            }
          }}
        />
      </label>
      <FieldError>{state.error ?? undefined}</FieldError>
      {isPending && (
        <p className="text-xs text-brand-purple-500 flex items-center gap-1.5">
          <Paperclip className="h-3 w-3" /> Mengunggah file...
        </p>
      )}
    </form>
  );
}
