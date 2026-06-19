import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function PageHeader({
  title,
  subtitle,
  backHref,
  actions,
  className,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 px-4 lg:px-8 pt-5 lg:pt-8 pb-4",
        className
      )}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {backHref && (
            <Link
              href={backHref}
              className="hidden lg:flex h-8 w-8 rounded-full hover:bg-brand-purple-50 items-center justify-center text-brand-purple-500 flex-shrink-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
          )}
          <h1 className="font-display text-xl lg:text-2xl font-semibold text-brand-purple-900 truncate">
            {title}
          </h1>
        </div>
        {subtitle && (
          <p className="text-sm text-zinc-500 mt-0.5 lg:ml-10">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex-shrink-0 flex items-center gap-2">{actions}</div>}
    </div>
  );
}
