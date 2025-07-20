
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useState } from "react";
import { DashboardStats } from "@/lib/dashboardService";

interface WeeklyProgressProps {
  stats: DashboardStats;
}

export const WeeklyProgress = ({ stats }: WeeklyProgressProps) => {
  const [activeTab, setActiveTab] = useState('week');

  const tabs = [
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' }
  ];

  // --- Data for each tab ---
  const weeklyData = stats.weeklyData;
  const monthlyData = stats.monthlyData;
  const yearlyData = stats.yearlyData;

  // --- Helper functions to get dynamic data based on the active tab ---
  const getCurrentData = () => {
    switch (activeTab) {
      case 'month': return monthlyData;
      case 'year': return yearlyData;
      default: return weeklyData;
    }
  };

  const currentData = getCurrentData();
  const totalHours = currentData.reduce((sum, item) => sum + item.hours, 0);
  const averageHours = totalHours / currentData.length;

  const getDateRange = () => {
    switch (activeTab) {
      case 'month': return 'March 1–30, 2025';
      case 'year': return 'January–December, 2025';
      default: return 'March 16–22, 2025';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="tooltip">
          <p className="font-medium">{activeTab === 'year' ? label : `${label}, ${data.date}`}</p>
          <p className="text-blue-300">{`${data.hours.toFixed(1)}h studied`}</p>
          {data.sessions && <p className="text-gray-300 text-sm">{`${data.sessions} sessions`}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#1a1a1d] rounded-xl p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 sm:gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h2 className="text-lg sm:text-xl font-semibold">{getDateRange()}</h2>
          <div className="text-right">
            <p className="text-2xl sm:text-3xl font-bold text-white">{totalHours.toFixed(1)}h</p>
            <p className="text-sm text-gray-400">Average: {averageHours.toFixed(1)}h/{activeTab === 'year' ? 'month' : 'day'}</p>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={currentData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <XAxis 
              dataKey={activeTab === 'year' ? 'month' : 'day'}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#a1a1aa', fontSize: 12 }}
              interval={activeTab === 'month' ? 4 : 0}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#a1a1aa', fontSize: 12 }}
              label={{ value: 'Hours', angle: -90, position: 'insideLeft', offset: 10, style: { textAnchor: 'middle', fill: '#a1a1aa' } }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
            <Bar 
              dataKey="hours" 
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
