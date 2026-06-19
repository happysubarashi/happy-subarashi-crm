import { getCurrentProfile, isManager } from "@/lib/queries/profiles";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/elements";
import { AvatarUploader } from "@/components/settings/avatar-uploader";
import { ProfileForm } from "@/components/settings/profile-form";
import { NotificationToggles } from "@/components/settings/notification-toggles";
import { ChangePasswordForm } from "@/components/settings/password-form";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { ROLE_LABEL, ROLE_BADGE_CLASS } from "@/lib/constants";
import { Badge } from "@/components/ui/elements";
import { Users2, ChevronRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const profile = await getCurrentProfile();

  return (
    <div>
      <PageHeader title="Settings" subtitle="Kelola akun dan preferensi Anda" />

      <div className="px-4 lg:px-8 max-w-xl space-y-4 pb-8">
        <Card className="p-5">
          <div className="flex items-center gap-4 mb-5">
            <AvatarUploader name={profile.full_name} url={profile.avatar_url} />
            <div>
              <p className="font-display font-semibold text-brand-purple-900">
                {profile.full_name}
              </p>
              <Badge className={ROLE_BADGE_CLASS[profile.role] + " mt-1"}>
                {ROLE_LABEL[profile.role]}
              </Badge>
            </div>
          </div>
          <ProfileForm profile={profile} />
        </Card>

        {isManager(profile.role) && (
          <Link href="/settings/team">
            <Card className="p-4 flex items-center justify-between hover:shadow-card transition-shadow">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-brand-pink-50 flex items-center justify-center">
                  <Users2 className="h-5 w-5 text-brand-pink-500" />
                </div>
                <div>
                  <p className="font-medium text-zinc-800">Manajemen Tim</p>
                  <p className="text-xs text-zinc-400">Kelola anggota tim & role</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-zinc-300" />
            </Card>
          </Link>
        )}

        <Card className="p-5">
          <h3 className="font-display font-semibold text-brand-purple-900 mb-1">
            Notifikasi
          </h3>
          <NotificationToggles settings={profile.notification_settings} />
        </Card>

        <Card className="p-5">
          <h3 className="font-display font-semibold text-brand-purple-900 mb-4">
            Keamanan
          </h3>
          <ChangePasswordForm />
        </Card>

        <div className="pt-2 pb-4">
          <SignOutButton className="w-full justify-center" />
        </div>
      </div>
    </div>
  );
}
