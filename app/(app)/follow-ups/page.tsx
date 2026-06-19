import { getGroupedFollowUps } from "@/lib/queries/follow-ups";
import { PageHeader } from "@/components/layout/page-header";
import { FollowUpSection } from "@/components/follow-ups/follow-up-section";
import { AlertTriangle, CalendarCheck2, CalendarDays } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FollowUpsPage() {
  const { overdue, today, upcoming } = await getGroupedFollowUps();

  return (
    <div>
      <PageHeader
        title="Follow Up"
        subtitle="Jangan sampai ada lead yang terlewat"
      />

      <div className="px-4 lg:px-8">
        {overdue.length > 0 && (
          <FollowUpSection
            title="Terlewat"
            followUps={overdue}
            emptyIcon={AlertTriangle}
            emptyText="Tidak ada yang terlewat"
            tone="danger"
          />
        )}

        <FollowUpSection
          title="Hari Ini"
          followUps={today}
          emptyIcon={CalendarCheck2}
          emptyText="Tidak ada follow up hari ini 🎉"
        />

        <FollowUpSection
          title="Akan Datang"
          followUps={upcoming}
          emptyIcon={CalendarDays}
          emptyText="Belum ada jadwal follow up berikutnya"
        />
      </div>
    </div>
  );
}
