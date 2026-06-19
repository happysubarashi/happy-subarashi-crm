import { getAllTeamMembers, getCurrentProfile, isManager } from "@/lib/queries/profiles";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/elements";
import { TeamMemberRow } from "@/components/settings/team-member-row";
import { InviteMemberForm } from "@/components/settings/invite-member-form";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TeamManagementPage() {
  const profile = await getCurrentProfile();
  if (!isManager(profile.role)) {
    redirect("/settings");
  }

  const members = await getAllTeamMembers();
  const leaders = members.filter((m) => m.role === "leader");

  return (
    <div>
      <PageHeader
        title="Manajemen Tim"
        subtitle={`${members.length} anggota`}
        backHref="/settings"
        actions={<InviteMemberForm />}
      />

      <div className="px-4 lg:px-8 max-w-2xl pb-8">
        <Card className="p-5">
          {members.map((member) => (
            <TeamMemberRow
              key={member.id}
              member={member}
              leaders={leaders}
              isSelf={member.id === profile.id}
              canEdit={isManager(profile.role)}
            />
          ))}
        </Card>

        <p className="text-xs text-zinc-400 mt-4 px-1">
          Hanya Owner dan Admin yang dapat mengubah role, leader, dan status aktif
          anggota tim. Anggota baru menerima email undangan untuk mengatur password
          mereka sendiri.
        </p>
      </div>
    </div>
  );
}
