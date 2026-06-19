import { LeadForm } from "@/components/leads/lead-form";
import { PageHeader } from "@/components/layout/page-header";
import { getTeamMembers } from "@/lib/queries/profiles";
import { getActiveProducts, getLeadById, getLeadProducts } from "@/lib/queries/leads";
import { updateLeadAction } from "@/lib/actions/leads";
import { notFound } from "next/navigation";

export default async function EditLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [lead, teamMembers, products, leadProducts] = await Promise.all([
    getLeadById(id),
    getTeamMembers(),
    getActiveProducts(),
    getLeadProducts(id),
  ]);

  if (!lead) notFound();

  const boundAction = updateLeadAction.bind(null, id);

  return (
    <div>
      <PageHeader title="Edit Lead" backHref={`/leads/${id}`} />
      <div className="px-4 lg:px-8 max-w-2xl">
        <LeadForm
          action={boundAction}
          lead={lead}
          selectedProductIds={leadProducts.map((p) => p.id)}
          teamMembers={teamMembers}
          products={products}
          submitLabel="Simpan Perubahan"
        />
      </div>
    </div>
  );
}
