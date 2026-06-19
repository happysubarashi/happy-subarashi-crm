import { Card, Avatar } from "@/components/ui/elements";
import { TagPill } from "@/components/ui/status-badge";
import { SOURCE_LABEL } from "@/lib/constants";
import { formatDate, whatsappLink } from "@/lib/utils";
import type { LeadWithAssignee, Product } from "@/types/database.types";
import { Phone, Mail, MapPin, MessageCircle, Users2, Calendar } from "lucide-react";
import Link from "next/link";

export function LeadInfoCard({
  lead,
  products,
}: {
  lead: LeadWithAssignee;
  products: Product[];
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start gap-3 mb-4">
        <Avatar name={lead.full_name} size="lg" />
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg font-semibold text-brand-purple-900">
            {lead.full_name}
          </h2>
          <p className="text-xs text-zinc-400">{lead.lead_code}</p>
          {lead.assignee && (
            <p className="text-xs text-brand-purple-500 mt-1">
              Ditugaskan ke {lead.assignee.full_name}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <Link
          href={whatsappLink(lead.phone, `Halo ${lead.full_name.split(" ")[0]}, `)}
          target="_blank"
          className="flex items-center justify-center gap-2 h-10 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-medium"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </Link>
        <a
          href={`tel:${lead.phone}`}
          className="flex items-center justify-center gap-2 h-10 rounded-xl bg-brand-purple-50 text-brand-purple-600 text-sm font-medium"
        >
          <Phone className="h-4 w-4" /> Telepon
        </a>
      </div>

      <dl className="space-y-2.5 text-sm">
        <div className="flex items-center gap-2.5 text-zinc-600">
          <Phone className="h-4 w-4 text-brand-purple-300 flex-shrink-0" />
          <span>{lead.phone}</span>
        </div>
        {lead.email && (
          <div className="flex items-center gap-2.5 text-zinc-600">
            <Mail className="h-4 w-4 text-brand-purple-300 flex-shrink-0" />
            <span className="truncate">{lead.email}</span>
          </div>
        )}
        {lead.city && (
          <div className="flex items-center gap-2.5 text-zinc-600">
            <MapPin className="h-4 w-4 text-brand-purple-300 flex-shrink-0" />
            <span>{lead.city}</span>
          </div>
        )}
        <div className="flex items-center gap-2.5 text-zinc-600">
          <Users2 className="h-4 w-4 text-brand-purple-300 flex-shrink-0" />
          <span>
            Sumber: {SOURCE_LABEL[lead.source]}
            {lead.source_detail ? ` — ${lead.source_detail}` : ""}
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-zinc-600">
          <Calendar className="h-4 w-4 text-brand-purple-300 flex-shrink-0" />
          <span>Dibuat {formatDate(lead.created_at)}</span>
        </div>
      </dl>

      {lead.referral_name && (
        <div className="mt-3 bg-brand-pink-50 rounded-xl p-3 text-sm">
          <p className="text-brand-pink-700 font-medium">
            Direferensikan oleh {lead.referral_name}
          </p>
          {lead.referral_phone && (
            <p className="text-brand-pink-500 text-xs mt-0.5">{lead.referral_phone}</p>
          )}
        </div>
      )}

      {lead.health_conditions.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-brand-purple-400 uppercase tracking-wide mb-2">
            Kondisi Kesehatan
          </p>
          <div className="flex flex-wrap gap-1.5">
            {lead.health_conditions.map((c) => (
              <TagPill key={c} value={c} />
            ))}
          </div>
        </div>
      )}

      {products.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-brand-purple-400 uppercase tracking-wide mb-2">
            Produk Diminati
          </p>
          <div className="flex flex-wrap gap-1.5">
            {products.map((p) => (
              <span
                key={p.id}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-brand-purple-50 text-brand-purple-600"
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {lead.notes && (
        <div className="mt-4 pt-4 border-t border-brand-purple-50">
          <p className="text-xs font-semibold text-brand-purple-400 uppercase tracking-wide mb-1.5">
            Catatan
          </p>
          <p className="text-sm text-zinc-600 whitespace-pre-line">{lead.notes}</p>
        </div>
      )}
    </Card>
  );
}
