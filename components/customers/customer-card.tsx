import Link from "next/link";
import { Avatar } from "@/components/ui/elements";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { LeadWithAssignee } from "@/types/database.types";
import { MapPin, Sparkles } from "lucide-react";

export function CustomerCard({ customer }: { customer: LeadWithAssignee }) {
  return (
    <Link
      href={`/customers/${customer.id}`}
      className="block bg-white rounded-2xl border border-brand-purple-50 shadow-soft p-4 hover:shadow-card transition-shadow active:scale-[0.99]"
    >
      <div className="flex items-start gap-3">
        <Avatar name={customer.full_name} url={customer.assignee?.avatar_url} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="font-medium text-zinc-800 truncate">{customer.full_name}</p>
            <Sparkles className="h-3.5 w-3.5 text-brand-pink-400 flex-shrink-0" />
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
            <span>{customer.lead_code}</span>
            {customer.city && (
              <span className="flex items-center gap-0.5">
                <MapPin className="h-3 w-3" /> {customer.city}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between mt-2.5">
            <span className="text-xs text-zinc-400">
              Closing {formatDate(customer.closing_date)}
            </span>
            {customer.closing_amount && (
              <span className="text-sm font-display font-semibold text-brand-purple-700">
                {formatCurrency(customer.closing_amount)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
