"use client";

import { useActionState, useState } from "react";
import { inviteTeamMemberAction } from "@/lib/actions/team";
import { Sheet } from "@/components/ui/sheet";
import { Input, Label, FieldError } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ROLE_LABEL } from "@/lib/constants";
import { UserPlus } from "lucide-react";
import type { UserRole } from "@/types/database.types";

export function InviteMemberForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(inviteTeamMemberAction, {
    error: null,
  });

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <UserPlus className="h-4 w-4" /> Undang
      </Button>

      <Sheet open={open} onClose={() => setOpen(false)} title="Undang Anggota Tim">
        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="full_name">Nama Lengkap *</Label>
            <Input id="full_name" name="full_name" required />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Select id="role" name="role" defaultValue="consultant">
              {(Object.keys(ROLE_LABEL) as UserRole[])
                .filter((r) => r !== "owner")
                .map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABEL[r]}
                  </option>
                ))}
            </Select>
          </div>
          <FieldError>{state.error ?? undefined}</FieldError>
          {state.success && (
            <p className="text-sm text-emerald-600 font-medium">
              Undangan terkirim ✓
            </p>
          )}
          <Button type="submit" className="w-full" size="lg" loading={isPending}>
            Kirim Undangan
          </Button>
        </form>
      </Sheet>
    </>
  );
}
