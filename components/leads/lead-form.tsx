"use client";

import { useActionState, useState } from "react";
import { Input, Label, Textarea, FieldError } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  LEAD_SOURCES,
  HEALTH_CONDITIONS,
  AGE_RANGES,
} from "@/lib/constants";
import type { Lead, Profile, Product } from "@/types/database.types";
import { Flame } from "lucide-react";
import type { LeadFormState } from "@/lib/actions/leads";

interface LeadFormProps {
  action: (state: LeadFormState, formData: FormData) => Promise<LeadFormState>;
  lead?: Lead;
  selectedProductIds?: string[];
  teamMembers: Profile[];
  products: Product[];
  submitLabel: string;
}

export function LeadForm({
  action,
  lead,
  selectedProductIds = [],
  teamMembers,
  products,
  submitLabel,
}: LeadFormProps) {
  const [state, formAction, isPending] = useActionState(action, { error: null });
  const [source, setSource] = useState(lead?.source ?? "other");
  const [conditions, setConditions] = useState<string[]>(
    lead?.health_conditions ?? []
  );
  const [productIds, setProductIds] = useState<string[]>(selectedProductIds);

  function toggleCondition(value: string) {
    setConditions((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  }

  function toggleProduct(value: string) {
    setProductIds((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  }

  return (
    <form action={formAction} className="space-y-5 pb-8">
      {/* Contact Info */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-brand-purple-400 uppercase tracking-wide">
          Informasi Kontak
        </h3>
        <div>
          <Label htmlFor="full_name">Nama Lengkap *</Label>
          <Input
            id="full_name"
            name="full_name"
            defaultValue={lead?.full_name}
            placeholder="cth. Siti Rahma"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="phone">No. WhatsApp *</Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={lead?.phone}
              placeholder="08xxxxxxxxxx"
              required
            />
          </div>
          <div>
            <Label htmlFor="city">Kota</Label>
            <Input id="city" name="city" defaultValue={lead?.city ?? ""} placeholder="Bandung" />
          </div>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={lead?.email ?? ""} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="gender">Jenis Kelamin</Label>
            <Select id="gender" name="gender" defaultValue={lead?.gender ?? ""}>
              <option value="">Pilih</option>
              <option value="female">Perempuan</option>
              <option value="male">Laki-laki</option>
              <option value="other">Lainnya</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="age_range">Usia</Label>
            <Select id="age_range" name="age_range" defaultValue={lead?.age_range ?? ""}>
              <option value="">Pilih</option>
              {AGE_RANGES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </section>

      {/* Lead Source */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-brand-purple-400 uppercase tracking-wide">
          Sumber Lead
        </h3>
        <div>
          <Label htmlFor="source">Sumber</Label>
          <Select
            id="source"
            name="source"
            value={source}
            onChange={(e) => setSource(e.target.value as typeof source)}
          >
            {LEAD_SOURCES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="source_detail">Detail Sumber (opsional)</Label>
          <Input
            id="source_detail"
            name="source_detail"
            defaultValue={lead?.source_detail ?? ""}
            placeholder="cth. Campaign Juni 2026 - Diabetes"
          />
        </div>

        {source === "referral" && (
          <div className="grid grid-cols-2 gap-3 bg-brand-pink-50/60 p-3 rounded-xl">
            <div>
              <Label htmlFor="referral_name">Nama Pereferensi</Label>
              <Input
                id="referral_name"
                name="referral_name"
                defaultValue={lead?.referral_name ?? ""}
              />
            </div>
            <div>
              <Label htmlFor="referral_phone">No. WA Pereferensi</Label>
              <Input
                id="referral_phone"
                name="referral_phone"
                defaultValue={lead?.referral_phone ?? ""}
              />
            </div>
          </div>
        )}
      </section>

      {/* Health Conditions */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-brand-purple-400 uppercase tracking-wide">
          Kondisi Kesehatan
        </h3>
        <div className="flex flex-wrap gap-2">
          {HEALTH_CONDITIONS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => toggleCondition(c.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                conditions.includes(c.value)
                  ? "bg-brand-purple-500 text-white border-brand-purple-500"
                  : "bg-white text-zinc-500 border-brand-purple-100"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        {conditions.map((c) => (
          <input key={c} type="hidden" name="health_conditions" value={c} />
        ))}
      </section>

      {/* Products Interested */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-brand-purple-400 uppercase tracking-wide">
          Produk Diminati
        </h3>
        <div className="flex flex-wrap gap-2">
          {products.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => toggleProduct(p.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                productIds.includes(p.id)
                  ? "bg-brand-pink-500 text-white border-brand-pink-500"
                  : "bg-white text-zinc-500 border-brand-purple-100"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
        {productIds.map((p) => (
          <input key={p} type="hidden" name="product_ids" value={p} />
        ))}
      </section>

      {/* Assignment */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-brand-purple-400 uppercase tracking-wide">
          Penugasan
        </h3>
        <div>
          <Label htmlFor="assigned_to">Ditugaskan Ke</Label>
          <Select id="assigned_to" name="assigned_to" defaultValue={lead?.assigned_to ?? ""}>
            {teamMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.full_name}
              </option>
            ))}
          </Select>
        </div>

        <label className="flex items-center gap-2.5 bg-orange-50 px-3.5 py-3 rounded-xl cursor-pointer">
          <input
            type="checkbox"
            name="is_hot_lead"
            defaultChecked={lead?.is_hot_lead}
            className="h-4 w-4 rounded accent-orange-500"
          />
          <Flame className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-medium text-orange-700">
            Tandai sebagai Hot Lead
          </span>
        </label>
      </section>

      {/* Notes */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-brand-purple-400 uppercase tracking-wide">
          Catatan
        </h3>
        <Textarea
          name="notes"
          defaultValue={lead?.notes ?? ""}
          placeholder="Catatan tambahan tentang lead ini..."
        />
      </section>

      <FieldError>{state.error ?? undefined}</FieldError>

      <Button type="submit" size="lg" className="w-full" loading={isPending}>
        {submitLabel}
      </Button>
    </form>
  );
}
