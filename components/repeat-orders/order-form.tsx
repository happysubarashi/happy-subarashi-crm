"use client";

import { useActionState, useMemo, useState } from "react";
import { createRepeatOrderAction } from "@/lib/actions/repeat-orders";
import { Input, Label, Textarea, FieldError } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { REORDER_REMINDER_OPTIONS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import type { Product, Profile, LeadWithAssignee } from "@/types/database.types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface LineItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export function RepeatOrderForm({
  products,
  teamMembers,
  currentUserId,
  recentLeads,
}: {
  products: Product[];
  teamMembers: Profile[];
  currentUserId: string;
  recentLeads: Pick<LeadWithAssignee, "id" | "full_name" | "phone">[];
}) {
  const [state, formAction, isPending] = useActionState(createRepeatOrderAction, {
    error: null,
  });
  const [items, setItems] = useState<LineItem[]>([]);
  const [reminderDays, setReminderDays] = useState(30);
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0),
    [items]
  );

  function addItem(product: Product) {
    if (items.some((i) => i.product_id === product.id)) return;
    setItems((prev) => [
      ...prev,
      {
        product_id: product.id,
        product_name: product.name,
        quantity: 1,
        unit_price: product.price,
      },
    ]);
  }

  function updateItem(index: number, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function selectLead(leadId: string) {
    setSelectedLeadId(leadId);
    const lead = recentLeads.find((l) => l.id === leadId);
    if (lead) {
      setCustomerName(lead.full_name);
      setCustomerPhone(lead.phone);
    }
  }

  return (
    <form action={formAction} className="space-y-5 pb-8">
      <input type="hidden" name="lead_id" value={selectedLeadId} />
      <input type="hidden" name="items_json" value={JSON.stringify(items)} />

      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-brand-purple-400 uppercase tracking-wide">
          Pelanggan
        </h3>
        {recentLeads.length > 0 && (
          <div>
            <Label htmlFor="lead_select">Pilih dari Lead (opsional)</Label>
            <Select
              id="lead_select"
              value={selectedLeadId}
              onChange={(e) => selectLead(e.target.value)}
            >
              <option value="">— Input manual —</option>
              {recentLeads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.full_name} ({l.phone})
                </option>
              ))}
            </Select>
          </div>
        )}
        <div>
          <Label htmlFor="customer_name">Nama Pelanggan *</Label>
          <Input
            id="customer_name"
            name="customer_name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="customer_phone">No. WhatsApp *</Label>
          <Input
            id="customer_phone"
            name="customer_phone"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
          />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-brand-purple-400 uppercase tracking-wide">
          Produk
        </h3>
        <div className="flex flex-wrap gap-2">
          {products.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => addItem(p)}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-brand-purple-100 text-brand-purple-600 flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> {p.name}
            </button>
          ))}
        </div>

        {items.length > 0 && (
          <div className="space-y-2 mt-2">
            {items.map((item, idx) => (
              <div
                key={item.product_id}
                className="flex items-center gap-2 bg-brand-purple-50/50 rounded-xl p-2.5"
              >
                <span className="text-sm font-medium text-zinc-700 flex-1 truncate">
                  {item.product_name}
                </span>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(idx, { quantity: Number(e.target.value) || 1 })
                  }
                  className="w-14 h-8 text-center text-sm rounded-lg border border-brand-purple-100"
                />
                <input
                  type="number"
                  min={0}
                  value={item.unit_price}
                  onChange={(e) =>
                    updateItem(idx, { unit_price: Number(e.target.value) || 0 })
                  }
                  className="w-24 h-8 text-sm rounded-lg border border-brand-purple-100 px-2"
                />
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="h-8 w-8 flex items-center justify-center text-red-400 flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <div className="flex justify-between px-2.5 pt-1">
              <span className="text-sm font-medium text-zinc-500">Total</span>
              <span className="font-display font-semibold text-brand-purple-800">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-brand-purple-400 uppercase tracking-wide">
          Reminder Re-order
        </h3>
        <input type="hidden" name="reminder_days" value={reminderDays} />
        <div className="flex gap-2">
          {REORDER_REMINDER_OPTIONS.map((opt) => (
            <button
              key={opt.days}
              type="button"
              onClick={() => setReminderDays(opt.days)}
              className={cn(
                "flex-1 h-10 rounded-xl text-sm font-medium border transition-colors",
                reminderDays === opt.days
                  ? "bg-brand-purple-500 text-white border-brand-purple-500"
                  : "bg-white text-zinc-500 border-brand-purple-100"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="order_date">Tanggal Order</Label>
            <Input
              id="order_date"
              name="order_date"
              type="date"
              defaultValue={format(new Date(), "yyyy-MM-dd")}
            />
          </div>
          <div>
            <Label htmlFor="assigned_to">Ditugaskan Ke</Label>
            <Select id="assigned_to" name="assigned_to" defaultValue={currentUserId}>
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Catatan</Label>
          <Textarea id="notes" name="notes" placeholder="Catatan order..." />
        </div>
      </section>

      <FieldError>{state.error ?? undefined}</FieldError>

      <Button type="submit" size="lg" className="w-full" loading={isPending}>
        Simpan Order
      </Button>
    </form>
  );
}
