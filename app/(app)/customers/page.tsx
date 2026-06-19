import { getCustomers } from "@/lib/queries/customers";
import { PageHeader } from "@/components/layout/page-header";
import { CustomerCard } from "@/components/customers/customer-card";
import { Pagination } from "@/components/leads/pagination";
import { EmptyState } from "@/components/ui/elements";
import { Input } from "@/components/ui/input";
import { Search, Heart } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function CustomersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? "1") || 1;
  const pageSize = 20;

  const { customers, total } = await getCustomers({
    search: params.search,
    page,
    pageSize,
  });

  return (
    <div>
      <PageHeader title="Customers" subtitle={`${total} pelanggan aktif`} />

      <div className="px-4 lg:px-8 pb-3">
        <form>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-purple-300" />
            <Input
              name="search"
              defaultValue={params.search}
              placeholder="Cari nama, nomor, atau kode..."
              className="pl-10"
            />
          </div>
        </form>
      </div>

      <div className="px-4 lg:px-8">
        {customers.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Belum ada customer"
            description="Customer akan muncul di sini setelah lead closing dan menjadi member."
          />
        ) : (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-3">
            {customers.map((c) => (
              <CustomerCard key={c.id} customer={c} />
            ))}
          </div>
        )}

        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          basePath="/customers"
          searchParams={params}
        />
      </div>
    </div>
  );
}
