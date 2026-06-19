"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/lib/actions/profiles";
import { Input, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(changePasswordAction, {
    error: null,
  });

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="new_password">Password Baru</Label>
        <Input id="new_password" name="new_password" type="password" required minLength={8} />
      </div>
      <div>
        <Label htmlFor="confirm_password">Konfirmasi Password</Label>
        <Input
          id="confirm_password"
          name="confirm_password"
          type="password"
          required
          minLength={8}
        />
      </div>
      <FieldError>{state.error ?? undefined}</FieldError>
      {state.success && (
        <p className="text-sm text-emerald-600 font-medium">Password berhasil diubah ✓</p>
      )}
      <Button type="submit" variant="outline" loading={isPending}>
        Ubah Password
      </Button>
    </form>
  );
}
