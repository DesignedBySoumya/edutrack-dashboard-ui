
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { DashboardStats } from "@/lib/dashboardService";

interface PerformanceInsightsProps {
  stats: DashboardStats;
}

export const PerformanceInsights = ({ stats }: PerformanceInsightsProps) => {
  const performanceData = [
    { title: "Last 10 Days Avg", value: stats.last10DaysAvg, subtitle: "Per day", color: "text-blue-400" },
    { title: "Today's Study", value: stats.todayStudy, subtitle: "Current session", color: "text-green-400" },
    { title: "Focus Score", value: `${stats.focusScore}%`, subtitle: "Great! Keep distractions low", color: "text-green-400" },
    { title: "Consistency", value: `${stats.consistency}%`, subtitle: "14/15 days", color: "text-green-400" },
    { title: "Mocks Done", value: stats.mocksDone.toString(), subtitle: "This month", color: "text-yellow-400" },
    { title: "Current Streak", value: `${stats.currentStreak} days`, subtitle: "Keep it up! 🔥", color: "text-orange-400" }
  ];
  
  const subjectData = stats.subjectData;
  const totalSubjectHours = subjectData.reduce((sum, s) => sum + s.hours, 0);
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="tooltip">
          <p className="font-medium">{data.name}</p>
          <p className="text-blue-300">{data.value}h ({((data.value / totalSubjectHours) * 100).toFixed(1)}%)</p>
        </div>
      );
    } 
    return null;
  };

  return (
    <div className="bg-[#1a1a1d] rounded-xl p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Performance Insights</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {performanceData.map((item, i) => (
              <div key={i} className="bg-[#0e0e10] rounded-lg p-4 transition-transform duration-200 hover:-translate-y-1">
                <div className="text-sm text-gray-400 mb-2">{item.title}</div>
                <div className={`text-xl sm:text-2xl font-bold ${item.color} mb-1`}>{item.value}</div>
                <div className="text-xs text-gray-500">{item.subtitle}</div>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-4 border border-blue-500/30">
            <div className="text-sm text-blue-300 mb-1">📍 Next Best Action</div>
            <div className="text-lg font-semibold text-white">
              {stats.subjectData.length > 0 
                ? `Study ${stats.subjectData[0].name} for 2 hrs today`
                : 'Start your first study session today'
              }
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg p-4 border border-green-500/30">
            <div className="text-sm text-green-300 mb-1">📈 Predicted Progress</div>
            <div className="text-lg font-semibold text-white">
              {stats.consistency > 70 
                ? `At this pace: 320/500 by Prelims`
                : 'Increase consistency to improve progress'
              }
            </div>
          </div>
        </div>
        <div className="bg-[#0e0e10] rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Subject Breakdown</h3>
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={subjectData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="hours">
                  {subjectData.map((e, i) => (<Cell key={`cell-${i}`} fill={e.color} />))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {subjectData.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></div>
                  <span className="text-gray-300">{s.name}</span>
                </div>
                <div className="text-white font-medium">{s.hours}h ({((s.hours / totalSubjectHours) * 100).toFixed(0)}%)</div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="text-xs text-yellow-400 mb-2">⚠️ Attention Needed</div>
            <div className="text-sm text-gray-300">
              {stats.subjectData.length === 0 
                ? 'Add subjects to start tracking your progress'
                : stats.consistency < 50
                ? 'Low consistency detected. Try to study daily.'
                : stats.focusScore < 70
                ? 'Focus score is low. Minimize distractions during study.'
                : 'Keep up the good work!'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
