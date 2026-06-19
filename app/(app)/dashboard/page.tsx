import { getDashboardStats, getPipelineOverview } from "@/lib/queries/dashboard";
import { getTodayFollowUpsPreview } from "@/lib/queries/follow-ups";
import { getCurrentProfile } from "@/lib/queries/profiles";
import { StatCard } from "@/components/dashboard/stat-card";
import { PipelineOverview } from "@/components/dashboard/pipeline-overview";
import { FollowUpTodayWidget } from "@/components/dashboard/follow-up-today-widget";
import {
  Users,
  CalendarRange,
  CalendarClock,
  Flame,
  Trophy,
  RotateCcw,
  Sparkles,
  Heart,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [profile, stats, pipeline, followUpsToday] = await Promise.all([
    getCurrentProfile(),
    getDashboardStats(),
    getPipelineOverview(),
    getTodayFollowUpsPreview(5),
  ]);

  const firstName = profile.full_name.split(" ")[0];

  return (
    <div className="px-4 lg:px-8 pt-2 lg:pt-8 pb-6">
      <div className="hidden lg:block mb-6">
        <h1 className="font-display text-2xl font-semibold text-brand-purple-900">
          Selamat datang kembali, {firstName}! 💜
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Begini ringkasan bisnis Happy Subarashi hari ini.
        </p>
      </div>
      <div className="lg:hidden mb-4 pt-3">
        <h1 className="font-display text-xl font-semibold text-brand-purple-900">
          Hai, {firstName} 💜
        </h1>
        <p className="text-sm text-zinc-500">Ringkasan hari ini</p>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard
          label="Total Lead"
          value={stats.totalLeads}
          icon={Users}
          href="/leads"
          tone="purple"
        />
        <StatCard
          label="Total Customer"
          value={stats.totalCustomers}
          icon={Heart}
          href="/customers"
          tone="pink"
        />
        <StatCard
          label="Lead Hari Ini"
          value={stats.leadsToday}
          icon={Users}
          href="/leads"
          tone="pink"
        />
        <StatCard
          label="Lead Bulan Ini"
          value={stats.leadsThisMonth}
          icon={CalendarRange}
          href="/leads"
          tone="purple"
        />
        <StatCard
          label="Follow Up Hari Ini"
          value={stats.followUpsToday}
          icon={CalendarClock}
          href="/follow-ups"
          tone="amber"
        />
        <StatCard
          label="Hot Lead"
          value={stats.hotLeads}
          icon={Flame}
          href="/leads?hot=1"
          tone="pink"
        />
        <StatCard
          label="Closing Bulan Ini"
          value={stats.closingThisMonth}
          icon={Trophy}
          href="/leads?stage=closing_won"
          tone="emerald"
        />
        <StatCard
          label="Repeat Order Jatuh Tempo"
          value={stats.repeatOrdersDue}
          icon={RotateCcw}
          href="/repeat-orders"
          tone="purple"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <FollowUpTodayWidget followUps={followUpsToday} />
        <PipelineOverview data={pipeline} />
      </div>
    </div>
  );
}
