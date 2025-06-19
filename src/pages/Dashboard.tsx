
import { StreakHeatmap } from "@/components/dashboard/StreakHeatmap";
import { PerformanceInsights } from "@/components/dashboard/PerformanceInsights";
import { WeeklyProgress } from "@/components/dashboard/WeeklyProgress";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-[#0e0e10] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">UPSC Study Dashboard</h1>
          <p className="text-gray-400 text-sm sm:text-base">Transform your preparation with data-driven insights</p>
        </div>

        <StreakHeatmap />
        <PerformanceInsights />
        <WeeklyProgress />
      </div>
    </div>
  );
};

export default DashboardPage;
