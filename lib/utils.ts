import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  format,
  formatDistanceToNow,
  isToday,
  isPast,
  isTomorrow,
  parseISO,
} from "date-fns";

/** Merge Tailwind classes safely, resolving conflicts (last wins). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as Indonesian Rupiah currency. */
export function formatCurrency(amount: number | null | undefined, currency = "IDR") {
  if (amount === null || amount === undefined) return "-";
  if (currency === "IDR") {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
  }).format(amount);
}

/** Format an ISO date string for display, e.g. "19 Jun 2026". */
export function formatDate(iso: string | null | undefined, withTime = false) {
  if (!iso) return "-";
  const date = typeof iso === "string" ? parseISO(iso) : iso;
  return format(date, withTime ? "d MMM yyyy, HH:mm" : "d MMM yyyy");
}

/** Format a date as relative time, e.g. "2 hours ago". */
export function formatRelative(iso: string | null | undefined) {
  if (!iso) return "-";
  const date = parseISO(iso);
  return formatDistanceToNow(date, { addSuffix: true });
}

/** Friendly bucket label for a scheduled follow-up. */
export function followUpBucket(scheduledAt: string): "overdue" | "today" | "upcoming" {
  const date = parseISO(scheduledAt);
  if (isPast(date) && !isToday(date)) return "overdue";
  if (isToday(date)) return "today";
  return "upcoming";
}

export function isDateTomorrow(iso: string) {
  return isTomorrow(parseISO(iso));
}

/** Normalize an Indonesian phone number the same way the DB trigger does. */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, "");
  if (digits.length < 5) return digits;
  if (digits.startsWith("08")) return "62" + digits.slice(1);
  if (digits.startsWith("628")) return digits;
  return digits;
}

/** Build a wa.me deep link from a phone number. */
export function whatsappLink(phone: string, message?: string) {
  const normalized = normalizePhone(phone);
  const base = `https://wa.me/${normalized}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Get initials from a full name, e.g. "Siti Rahma" -> "SR". */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Generic debounce for search inputs. */
export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  delay = 300
) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
