"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/lib/actions/profiles";
import { Input, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types/database.types";
import { useEffect, useState } from "react";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, {
    error: null,
  });
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (state.success) {
      setSavedFlash(true);
      const t = setTimeout(() => setSavedFlash(false), 2000);
      return () => clearTimeout(t);
    }
  }, [state.success]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="full_name">Nama Lengkap</Label>
        <Input id="full_name" name="full_name" defaultValue={profile.full_name} required />
      </div>
      <div>
        <Label htmlFor="phone">No. WhatsApp</Label>
        <Input id="phone" name="phone" defaultValue={profile.phone ?? ""} />
      </div>
      <div>
        <Label>Email</Label>
        <Input value={profile.email ?? ""} disabled />
      </div>

      <FieldError>{state.error ?? undefined}</FieldError>
      {savedFlash && (
        <p className="text-sm text-emerald-600 font-medium">Tersimpan ✓</p>
      )}

      <Button type="submit" loading={isPending}>
        Simpan Profil
      </Button>
    </form>
  );
}
