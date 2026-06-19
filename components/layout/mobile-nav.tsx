"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  RotateCcw,
  Settings,
  Plus,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "__fab__", label: "", icon: Plus },
  { href: "/follow-ups", label: "Follow Up", icon: CalendarClock },
  { href: "/settings", label: "Lainnya", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-brand-purple-50 pb-safe">
      <div className="flex items-center justify-around px-2 pt-2">
        {NAV_ITEMS.map((item) => {
          if (item.href === "__fab__") {
            return (
              <Link
                key="fab"
                href="/leads/new"
                aria-label="Tambah Lead"
                className="flex flex-col items-center justify-center -mt-6"
              >
                <span className="h-[52px] w-[52px] rounded-full bg-gradient-to-br from-brand-pink-500 to-brand-purple-500 flex items-center justify-center shadow-card">
                  <Plus className="h-6 w-6 text-white" strokeWidth={2.5} />
                </span>
              </Link>
            );
          }

          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 rounded-xl min-w-[56px]",
                isActive ? "text-brand-purple-600" : "text-zinc-400"
              )}
            >
              <item.icon
                className="h-5 w-5"
                strokeWidth={isActive ? 2.4 : 2}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
