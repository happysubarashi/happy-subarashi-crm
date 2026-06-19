import { getGroupedRepeatOrders } from "@/lib/queries/repeat-orders";
import { PageHeader } from "@/components/layout/page-header";
import { OrderCard } from "@/components/repeat-orders/order-card";
import { EmptyState } from "@/components/ui/elements";
import { Button } from "@/components/ui/button";
import { RotateCcw, Plus, AlertTriangle, Clock, CalendarDays } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RepeatOrdersPage() {
  const { overdue, dueSoon, upcoming, all } = await getGroupedRepeatOrders();

  return (
    <div>
      <PageHeader
        title="Repeat Order"
        subtitle={`${all.length} order menunggu reminder`}
        actions={
          <Link href="/repeat-orders/new">
            <Button size="sm">
              <Plus className="h-4 w-4" /> Order Baru
            </Button>
          </Link>
        }
      />

      <div className="px-4 lg:px-8">
        {all.length === 0 ? (
          <EmptyState
            icon={RotateCcw}
            title="Belum ada repeat order"
            description="Catat order pelanggan dan atur reminder 30/60/90 hari di sini."
            action={
              <Link href="/repeat-orders/new">
                <Button>
                  <Plus className="h-4 w-4" /> Tambah Order
                </Button>
              </Link>
            }
          />
        ) : (
          <>
            {overdue.length > 0 && (
              <section className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <h2 className="font-display font-semibold text-red-600">
                    Lewat Jadwal
                  </h2>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                    {overdue.length}
                  </span>
                </div>
                <div className="grid lg:grid-cols-2 gap-3">
                  {overdue.map((o) => (
                    <OrderCard key={o.id} order={o} />
                  ))}
                </div>
              </section>
            )}

            <section className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-amber-500" />
                <h2 className="font-display font-semibold text-brand-purple-900">
                  Segera (7 Hari)
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-600">
                  {dueSoon.length}
                </span>
              </div>
              {dueSoon.length === 0 ? (
                <p className="text-sm text-zinc-400 px-1">Tidak ada reminder minggu ini</p>
              ) : (
                <div className="grid lg:grid-cols-2 gap-3">
                  {dueSoon.map((o) => (
                    <OrderCard key={o.id} order={o} />
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <CalendarDays className="h-4 w-4 text-brand-purple-400" />
                <h2 className="font-display font-semibold text-brand-purple-900">
                  Akan Datang
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-purple-100 text-brand-purple-600">
                  {upcoming.length}
                </span>
              </div>
              <div className="grid lg:grid-cols-2 gap-3">
                {upcoming.map((o) => (
                  <OrderCard key={o.id} order={o} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
