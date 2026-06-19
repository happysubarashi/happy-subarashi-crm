import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";
import { Loader2, type LucideIcon } from "lucide-react";
import type { HTMLAttributes } from "react";

// ── Card ──────────────────────────────────────────────────
export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-brand-purple-50 shadow-soft",
        className
      )}
      {...props}
    />
  );
}

// ── Badge ─────────────────────────────────────────────────
export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap",
        className
      )}
    >
      {children}
    </span>
  );
}

// ── Avatar ────────────────────────────────────────────────
export function Avatar({
  name,
  url,
  size = "md",
}: {
  name: string;
  url?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass = {
    sm: "h-7 w-7 text-[10px]",
    md: "h-9 w-9 text-xs",
    lg: "h-14 w-14 text-base",
  }[size];

  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={url}
        alt={name}
        className={cn(sizeClass, "rounded-full object-cover")}
      />
    );
  }

  return (
    <div
      className={cn(
        sizeClass,
        "rounded-full bg-gradient-to-br from-brand-purple-400 to-brand-pink-400 text-white flex items-center justify-center font-semibold flex-shrink-0"
      )}
    >
      {getInitials(name)}
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────
export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2 className={cn("h-5 w-5 animate-spin text-brand-purple-400", className)} />
  );
}

export function FullPageSpinner() {
  return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="h-14 w-14 rounded-2xl bg-brand-pink-50 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-brand-pink-400" />
      </div>
      <p className="font-display text-lg text-brand-purple-900 font-medium">
        {title}
      </p>
      {description && (
        <p className="text-sm text-zinc-500 mt-1 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
