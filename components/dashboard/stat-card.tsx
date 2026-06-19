import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export function StatCard({
  label,
  value,
  icon: Icon,
  href,
  tone = "purple",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  href?: string;
  tone?: "purple" | "pink" | "amber" | "emerald";
}) {
  const toneClass = {
    purple: "bg-brand-purple-50 text-brand-purple-600",
    pink: "bg-brand-pink-50 text-brand-pink-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
  }[tone];

  const content = (
    <div className="bg-white rounded-2xl border border-brand-purple-50 shadow-soft p-4 h-full flex flex-col justify-between active:scale-[0.98] transition-transform">
      <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center mb-3", toneClass)}>
        <Icon className="h-[18px] w-[18px]" />
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-brand-purple-900 leading-none">
          {value}
        </p>
        <p className="text-xs text-zinc-500 mt-1.5">{label}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    );
  }
  return content;
}
