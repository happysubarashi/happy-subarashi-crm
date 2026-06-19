import { getCustomerById, getCustomerOrders } from "@/lib/queries/customers";
import { getLeadProducts } from "@/lib/queries/leads";
import { PageHeader } from "@/components/layout/page-header";
import { LeadInfoCard } from "@/components/lead-detail/lead-info-card";
import { OrderCard } from "@/components/repeat-orders/order-card";
import { Card, EmptyState } from "@/components/ui/elements";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Package, Plus, History } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [customer, orders, products] = await Promise.all([
    getCustomerById(id),
    getCustomerOrders(id),
    getLeadProducts(id),
  ]);

  if (!customer) notFound();

  const lifetimeValue = orders.reduce((sum, o) => sum + o.total_amount, 0);

  return (
    <div>
      <PageHeader
        title={customer.full_name}
        backHref="/customers"
        actions={
          <Link href={`/leads/${customer.id}`}>
            <Button variant="outline" size="sm">
              <History className="h-4 w-4" /> Riwayat Lead
            </Button>
          </Link>
        }
      />

      <div className="px-4 lg:px-8 grid lg:grid-cols-[380px_1fr] gap-4 items-start">
        <LeadInfoCard lead={customer} products={products} />

        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-brand-purple-400 uppercase tracking-wide">
                  Lifetime Value
                </p>
                <p className="font-display text-2xl font-bold text-brand-purple-900 mt-1">
                  {formatCurrency(lifetimeValue)}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">{orders.length} order</p>
              </div>
              <Link href="/repeat-orders/new">
                <Button size="sm">
                  <Plus className="h-4 w-4" /> Order Baru
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-display font-semibold text-brand-purple-900 mb-4">
              Riwayat Order
            </h3>
            {orders.length === 0 ? (
              <EmptyState
                icon={Package}
                title="Belum ada order"
                description="Order pertama customer ini akan muncul di sini."
              />
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
