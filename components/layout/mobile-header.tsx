import { Avatar } from "@/components/ui/elements";
import type { Profile } from "@/types/database.types";
import { Heart } from "lucide-react";
import Link from "next/link";

export function MobileHeader({
  profile,
  title,
}: {
  profile: Profile;
  title?: string;
}) {
  return (
    <header className="lg:hidden sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-brand-purple-50 pt-safe">
      <div className="flex items-center justify-between px-4 h-14">
        {title ? (
          <h1 className="font-display font-semibold text-brand-purple-900 text-lg">
            {title}
          </h1>
        ) : (
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-brand-purple-500 flex items-center justify-center rotate-3">
              <Heart className="h-3.5 w-3.5 text-white fill-white" />
            </div>
            <span className="font-display font-bold text-brand-purple-900">
              Happy Subarashi
            </span>
          </div>
        )}
        <Link href="/settings">
          <Avatar name={profile.full_name} url={profile.avatar_url} size="sm" />
        </Link>
      </div>
    </header>
  );
}
