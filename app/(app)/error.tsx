"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] px-6 text-center">
      <div className="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
        <AlertTriangle className="h-6 w-6 text-red-400" />
      </div>
      <p className="font-display text-lg font-medium text-brand-purple-900">
        Ada yang tidak beres
      </p>
      <p className="text-sm text-zinc-500 mt-1 max-w-xs">
        Silakan coba lagi. Jika masalah berlanjut, hubungi admin tim Anda.
      </p>
      <Button className="mt-5" onClick={reset}>
        Coba Lagi
      </Button>
    </div>
  );
}
