import { getLeadById, getLeadProducts } from "@/lib/queries/leads";
import { getLeadActivities } from "@/lib/queries/activities";
import { getLeadFollowUpsPending } from "@/lib/queries/follow-ups";
import { getTeamMembers, getCurrentProfile } from "@/lib/queries/profiles";
import { PageHeader } from "@/components/layout/page-header";
import { LeadInfoCard } from "@/components/lead-detail/lead-info-card";
import { StageSelector } from "@/components/lead-detail/stage-selector";
import { HotLeadToggle } from "@/components/lead-detail/hot-lead-toggle";
import { ArchiveLeadButton } from "@/components/lead-detail/archive-lead-button";
import { ActivityTimeline } from "@/components/lead-detail/activity-timeline";
import { AddActivityForm } from "@/components/lead-detail/add-activity-form";
import { FileUploadForm } from "@/components/lead-detail/file-upload-form";
import { ScheduleFollowUpForm } from "@/components/lead-detail/schedule-follow-up-form";
import { LeadFollowUpList } from "@/components/lead-detail/lead-follow-up-list";
import { Tabs } from "@/components/ui/tabs";
import { Card } from "@/components/ui/elements";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [lead, products, activities, pendingFollowUps, teamMembers, me] =
    await Promise.all([
      getLeadById(id),
      getLeadProducts(id),
      getLeadActivities(id),
      getLeadFollowUpsPending(id),
      getTeamMembers(),
      getCurrentProfile(),
    ]);

  if (!lead) notFound();

  return (
    <div>
      <PageHeader
        title={lead.full_name}
        backHref="/leads"
        actions={
          <div className="flex items-center gap-2">
            <HotLeadToggle leadId={lead.id} isHot={lead.is_hot_lead} />
            <Link href={`/leads/${lead.id}/edit`}>
              <Button variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <ArchiveLeadButton leadId={lead.id} />
          </div>
        }
      />

      <div className="px-4 lg:px-8 grid lg:grid-cols-[380px_1fr] gap-4 items-start">
        <LeadInfoCard lead={lead} products={products} />

        <div className="space-y-4">
          <Card className="p-5">
            <StageSelector leadId={lead.id} currentStage={lead.pipeline_stage} />
          </Card>

          {pendingFollowUps.length > 0 && (
            <Card className="p-5">
              <p className="text-xs font-semibold text-brand-purple-400 uppercase tracking-wide mb-3">
                Follow Up Terjadwal
              </p>
              <LeadFollowUpList followUps={pendingFollowUps} />
            </Card>
          )}

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-brand-purple-900">
                Aktivitas
              </h3>
              <ScheduleFollowUpForm
                leadId={lead.id}
                teamMembers={teamMembers}
                currentUserId={me.id}
              />
            </div>

            <Tabs
              tabs={[
                {
                  key: "timeline",
                  label: "Riwayat",
                  content: <ActivityTimeline activities={activities} />,
                },
                {
                  key: "note",
                  label: "Catatan Baru",
                  content: <AddActivityForm leadId={lead.id} />,
                },
                {
                  key: "file",
                  label: "File",
                  content: <FileUploadForm leadId={lead.id} />,
                },
              ]}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
