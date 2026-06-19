"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3.5 h-11 rounded-xl text-sm font-medium transition-colors",
        isActive
          ? "bg-brand-purple-500 text-white shadow-soft"
          : "text-brand-purple-700 hover:bg-brand-purple-50"
      )}
    >
      {children}
    </Link>
  );
}
