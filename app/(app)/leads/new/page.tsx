import { LeadForm } from "@/components/leads/lead-form";
import { PageHeader } from "@/components/layout/page-header";
import { getTeamMembers } from "@/lib/queries/profiles";
import { getActiveProducts } from "@/lib/queries/leads";
import { createLeadAction } from "@/lib/actions/leads";

export default async function NewLeadPage() {
  const [teamMembers, products] = await Promise.all([
    getTeamMembers(),
    getActiveProducts(),
  ]);

  return (
    <div>
      <PageHeader title="Tambah Lead Baru" backHref="/leads" />
      <div className="px-4 lg:px-8 max-w-2xl">
        <LeadForm
          action={createLeadAction}
          teamMembers={teamMembers}
          products={products}
          submitLabel="Simpan Lead"
        />
      </div>
    </div>
  );
}
