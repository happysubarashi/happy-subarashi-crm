import { RepeatOrderForm } from "@/components/repeat-orders/order-form";
import { PageHeader } from "@/components/layout/page-header";
import { getActiveProducts, getRecentLeadsForOrder } from "@/lib/queries/leads";
import { getTeamMembers, getCurrentProfile } from "@/lib/queries/profiles";

export default async function NewRepeatOrderPage() {
  const [products, teamMembers, me, recentLeads] = await Promise.all([
    getActiveProducts(),
    getTeamMembers(),
    getCurrentProfile(),
    getRecentLeadsForOrder(),
  ]);

  return (
    <div>
      <PageHeader title="Repeat Order Baru" backHref="/repeat-orders" />
      <div className="px-4 lg:px-8 max-w-2xl">
        <RepeatOrderForm
          products={products}
          teamMembers={teamMembers}
          currentUserId={me.id}
          recentLeads={recentLeads}
        />
      </div>
    </div>
  );
}
