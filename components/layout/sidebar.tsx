import Link from "next/link";
import { Avatar } from "@/components/ui/elements";
import { ROLE_LABEL, ROLE_BADGE_CLASS } from "@/lib/constants";
import { Badge } from "@/components/ui/elements";
import type { Profile } from "@/types/database.types";
import {
  LayoutDashboard,
  Users,
  Kanban,
  CalendarClock,
  RotateCcw,
  Settings,
  Heart,
} from "lucide-react";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { NavLink } from "@/components/layout/nav-link";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/pipeline", label: "Pipeline", icon: Kanban },
  { href: "/customers", label: "Customers", icon: Heart },
  { href: "/follow-ups", label: "Follow Up", icon: CalendarClock },
  { href: "/repeat-orders", label: "Repeat Order", icon: RotateCcw },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ profile }: { profile: Profile }) {
  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-white border-r border-brand-purple-50 flex-shrink-0">
      <div className="px-6 pt-7 pb-5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-brand-purple-500 flex items-center justify-center rotate-3">
            <Heart className="h-4.5 w-4.5 text-white fill-white" />
          </div>
          <div>
            <p className="font-display font-bold text-brand-purple-900 leading-tight">
              Happy
            </p>
            <p className="font-display italic text-xs text-brand-purple-500 -mt-0.5">
              subarashi
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} href={item.href}>
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-5">
        <div className="rounded-2xl bg-gradient-to-br from-brand-purple-50 to-brand-pink-50 p-3.5">
          <div className="flex items-center gap-2.5 mb-2">
            <Avatar name={profile.full_name} url={profile.avatar_url} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-brand-purple-900 truncate">
                {profile.full_name}
              </p>
              <Badge className={ROLE_BADGE_CLASS[profile.role] + " mt-0.5"}>
                {ROLE_LABEL[profile.role]}
              </Badge>
            </div>
          </div>
          <SignOutButton variant="ghost" className="w-full justify-center text-xs h-8" />
        </div>
      </div>
    </aside>
  );
}
