"use client";

import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useTransition } from "react";

export function SignOutButton({
  variant = "outline",
  className,
}: {
  variant?: "outline" | "ghost";
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant={variant}
      loading={isPending}
      className={className}
      onClick={() => startTransition(() => signOutAction())}
    >
      <LogOut className="h-3.5 w-3.5" />
      Keluar
    </Button>
  );
}
