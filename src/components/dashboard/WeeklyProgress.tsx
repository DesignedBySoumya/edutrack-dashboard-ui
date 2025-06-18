
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useState } from "react";

export const WeeklyProgress = () => {
  const [activeTab, setActiveTab] = useState('week');

  // --- Data for each tab ---
  const weeklyData = [
    { day: "Mon", hours: 3.5, sessions: 3, date: "Mar 16" },
    { day: "Tue", hours: 2.2, sessions: 2, date: "Mar 17" },
    { day: "Wed", hours: 4.1, sessions: 4, date: "Mar 18" },
    { day: "Thu", hours: 1.8, sessions: 2, date: "Mar 19" },
    { day: "Fri", hours: 3.7, sessions: 3, date: "Mar 20" },
    { day: "Sat", hours: 0.5, sessions: 1, date: "Mar 21" },
    { day: "Sun", hours: 2.3, sessions: 2, date: "Mar 22" }
  ];

  const monthlyData = Array.from({ length: 30 }, (_, i) => ({
    day: `${i + 1}`,
    hours: Math.floor(Math.random() * 6) + 0.5,
    sessions: Math.floor(Math.random() * 4) + 1,
    date: `Mar ${i + 1}`
  }));

  const yearlyData = [
    { month: 'Jan', hours: 40 }, { month: 'Feb', hours: 32 },
    { month: 'Mar', hours: 45 }, { month: 'Apr', hours: 38 },
    { month: 'May', hours: 42 }, { month: 'Jun', hours: 35 },
    { month: 'Jul', hours: 48 }, { month: 'Aug', hours: 41 },
    { month: 'Sep', hours: 39 }, { month: 'Oct', hours: 44 },
    { month: 'Nov', hours: 46 }, { month: 'Dec', hours: 55 }
  ];

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

  const tabs = [
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' }
  ];

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
