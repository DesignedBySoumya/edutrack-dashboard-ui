
import { HeaderCalendar } from "@/components/dashboard/HeaderCalendar";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { SubjectList } from "@/components/dashboard/SubjectList";
import { AddSubjectButton } from "@/components/dashboard/AddSubjectButton";
import { ResponsiveInsights } from "@/components/dashboard/ResponsiveInsights";
import { StreakHeatmap } from "@/components/dashboard/StreakHeatmap";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-[#0e0e10] text-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center py-6 px-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">UPSC Study Dashboard</h1>
          <p className="text-gray-400 text-sm sm:text-base">Transform your preparation with data-driven insights</p>
        </div>

        {/* Header Calendar - Responsive day view */}
        <HeaderCalendar />
        
        {/* Stats Overview */}
        <StatsOverview />
        
        {/* Subject List */}
        <SubjectList />
        
        {/* Add Subject Button */}
        <AddSubjectButton />
        
        {/* Responsive Insights */}
        <ResponsiveInsights />
        
        {/* Streak Heatmap */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <StreakHeatmap />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
