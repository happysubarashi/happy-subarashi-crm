import { getLeads } from "@/lib/queries/leads";
import { getTeamMembers } from "@/lib/queries/profiles";
import { LeadCard } from "@/components/leads/lead-card";
import { LeadFilters } from "@/components/leads/lead-filters";
import { Pagination } from "@/components/leads/pagination";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/elements";
import { Button } from "@/components/ui/button";
import { Users, Plus, Kanban } from "lucide-react";
import Link from "next/link";
import type { PipelineStage, LeadSource } from "@/types/database.types";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    stage?: string;
    source?: string;
    assignedTo?: string;
    hot?: string;
    member?: string;
    page?: string;
  }>;
}

export default async function LeadsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? "1") || 1;
  const pageSize = 20;

  const [{ leads, total }, teamMembers] = await Promise.all([
    getLeads({
      search: params.search,
      stage: (params.stage as PipelineStage) || "all",
      source: (params.source as LeadSource) || "all",
      assignedTo: params.assignedTo || "all",
      hotOnly: params.hot === "1",
      memberOnly: params.member === "1",
      page,
      pageSize,
    }),
    getTeamMembers(),
  ]);

  return (
    <div>
      <PageHeader
        title="Leads"
        subtitle={`${total} lead ditemukan`}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/pipeline">
              <Button variant="outline" size="sm">
                <Kanban className="h-4 w-4" /> Pipeline
              </Button>
            </Link>
            <Link href="/leads/new" className="hidden lg:block">
              <Button>
                <Plus className="h-4 w-4" /> Tambah Lead
              </Button>
            </Link>
          </div>
        }
      />

      <LeadFilters teamMembers={teamMembers} />

      <div className="px-4 lg:px-8">
        {leads.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Belum ada lead"
            description="Mulai tambahkan lead baru untuk melihatnya di sini."
            action={
              <Link href="/leads/new">
                <Button>
                  <Plus className="h-4 w-4" /> Tambah Lead Pertama
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-3">
            {leads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </div>
        )}

        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          basePath="/leads"
          searchParams={params}
        />
      </div>
    </div>
  );
}
