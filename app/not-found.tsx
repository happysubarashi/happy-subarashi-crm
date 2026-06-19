import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-canvas">
      <div className="h-14 w-14 rounded-2xl bg-brand-pink-50 flex items-center justify-center mb-4">
        <Heart className="h-6 w-6 text-brand-pink-400" />
      </div>
      <p className="font-display text-xl font-semibold text-brand-purple-900">
        Halaman tidak ditemukan
      </p>
      <p className="text-sm text-zinc-500 mt-1">
        Halaman yang Anda cari tidak tersedia.
      </p>
      <Link href="/dashboard" className="mt-5">
        <Button>Kembali ke Dashboard</Button>
      </Link>
    </div>
  );
}
