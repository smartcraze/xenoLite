import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Row: Copilot and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-[250px] lg:col-span-2 rounded-lg" />
        <Skeleton className="h-[250px] rounded-lg" />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-[120px] rounded-lg" />
        ))}
      </div>

      {/* Middle Row: Funnel and Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-[350px] lg:col-span-2 rounded-lg" />
        <Skeleton className="h-[350px] rounded-lg" />
      </div>

      {/* Bottom Table */}
      <Skeleton className="h-[300px] w-full rounded-lg" />
    </div>
  );
}
