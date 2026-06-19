import { getCurrentProfile } from "@/lib/queries/profiles";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { MobileHeader } from "@/components/layout/mobile-header";
import { ServiceWorkerRegister } from "@/components/layout/service-worker-register";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  return (
    <div className="lg:flex min-h-screen bg-canvas">
      <ServiceWorkerRegister />
      <Sidebar profile={profile} />
      <div className="flex-1 min-w-0">
        <MobileHeader profile={profile} />
        <main className="pb-24 lg:pb-8">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
