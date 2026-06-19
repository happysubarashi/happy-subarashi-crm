import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  page,
  pageSize,
  total,
  basePath,
  searchParams,
}: {
  page: number;
  pageSize: number;
  total: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  function hrefFor(p: number) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v && k !== "page") params.set(k, v);
    });
    params.set("page", String(p));
    return `${basePath}?${params.toString()}`;
  }

  return (
    <div className="flex items-center justify-center gap-3 py-6">
      <Link
        href={hrefFor(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={`h-9 w-9 rounded-xl border border-brand-purple-100 flex items-center justify-center ${
          page <= 1 ? "pointer-events-none opacity-40" : "bg-white text-brand-purple-600"
        }`}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>
      <span className="text-sm text-zinc-500">
        Halaman {page} dari {totalPages}
      </span>
      <Link
        href={hrefFor(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className={`h-9 w-9 rounded-xl border border-brand-purple-100 flex items-center justify-center ${
          page >= totalPages ? "pointer-events-none opacity-40" : "bg-white text-brand-purple-600"
        }`}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
