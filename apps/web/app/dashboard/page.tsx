import { Suspense } from "react";
import { AiCopilot } from "@/components/features/dashboard/ai-copilot";
import { AiRecommendations } from "@/components/features/dashboard/ai-recommendations";
import { LiveActivity } from "@/components/features/dashboard/live-activity";
import { PerformanceFunnel } from "@/components/features/dashboard/performance-funnel";
import { RecentCampaigns } from "@/components/features/dashboard/recent-campaigns";
import { StatCards } from "@/components/features/dashboard/stat-cards";
import { api } from "@/lib/api";
import DashboardLoading from "./loading";

export default async function DashboardPage() {
  // Fetch real data from the backend
  let statsData = null;
  try {
    statsData = await api.getDashboardStats();
  } catch (err) {
    console.error("Failed to fetch dashboard stats", err);
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
      <Suspense fallback={<DashboardLoading />}>
        {/* Top Row: Copilot and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AiCopilot />
          </div>
          <AiRecommendations />
        </div>

        {/* Stats Row */}
        <StatCards data={statsData} />

        {/* Middle Row: Funnel and Live Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PerformanceFunnel data={statsData} />
          </div>
          <LiveActivity />
        </div>

        {/* Bottom Table */}
        <RecentCampaigns data={statsData?.recentCampaigns} />
      </Suspense>
    </div>
  );
}
