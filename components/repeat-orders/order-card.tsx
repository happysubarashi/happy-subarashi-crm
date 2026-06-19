"use client";

import { useState, useTransition } from "react";
import { Avatar } from "@/components/ui/elements";
import { formatCurrency, formatDate, whatsappLink } from "@/lib/utils";
import { REORDER_REMINDER_OPTIONS } from "@/lib/constants";
import { updateOrderReminderAction } from "@/lib/actions/repeat-orders";
import { MessageCircle, RotateCcw, Package } from "lucide-react";
import type { RepeatOrderWithItems } from "@/types/database.types";
import Link from "next/link";

export function OrderCard({ order }: { order: RepeatOrderWithItems }) {
  const [isPending, startTransition] = useTransition();
  const [showReminders, setShowReminders] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-brand-purple-50 shadow-soft p-4">
      <div className="flex items-start gap-3">
        <Avatar name={order.customer_name} />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-zinc-800 truncate">{order.customer_name}</p>
          <p className="text-xs text-zinc-400">{order.order_code}</p>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
            <Package className="h-3 w-3" />
            {order.items.map((i) => i.product_name).join(", ")}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-display font-semibold text-brand-purple-800">
            {formatCurrency(order.total_amount)}
          </p>
          {order.next_followup_date && (
            <p className="text-xs text-zinc-400 mt-0.5">
              Reminder {formatDate(order.next_followup_date)}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <Link
          href={whatsappLink(
            order.customer_phone,
            `Halo ${order.customer_name.split(" ")[0]}, waktunya re-order nih 💜`
          )}
          target="_blank"
          className="flex-1 h-9 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-medium flex items-center justify-center gap-1.5"
        >
          <MessageCircle className="h-3.5 w-3.5" /> Hubungi
        </Link>
        <button
          onClick={() => setShowReminders((v) => !v)}
          className="flex-1 h-9 rounded-xl bg-brand-purple-50 text-brand-purple-600 text-xs font-medium flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Atur Reminder
        </button>
      </div>

      {showReminders && (
        <div className="flex gap-2 mt-2.5 pt-2.5 border-t border-brand-purple-50">
          {REORDER_REMINDER_OPTIONS.map((opt) => (
            <button
              key={opt.days}
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await updateOrderReminderAction(order.id, opt.days);
                  setShowReminders(false);
                })
              }
              className="flex-1 h-8 rounded-lg bg-brand-pink-50 text-brand-pink-600 text-xs font-medium"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
