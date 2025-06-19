
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";

export const ResponsiveInsights = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const subjectData = [
    { name: "Indian Polity", hours: 45, color: "#3B82F6" },
    { name: "Modern History", hours: 32, color: "#10B981" },
    { name: "Geography", hours: 28, color: "#F59E0B" },
    { name: "Current Affairs", hours: 25, color: "#EF4444" }
  ];

  const weeklyData = [
    { day: "Mon", hours: 3.5 },
    { day: "Tue", hours: 2.2 },
    { day: "Wed", hours: 4.1 },
    { day: "Thu", hours: 1.8 },
    { day: "Fri", hours: 3.7 },
    { day: "Sat", hours: 0.5 },
    { day: "Sun", hours: 2.3 }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-white shadow-xl">
          <p className="font-medium">{data.name || data.payload?.name}</p>
          <p className="text-blue-300">{data.value}h</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-[#1a1a1d] rounded-xl p-4 lg:p-6">
        <h2 className="text-xl lg:text-2xl font-bold mb-6 text-white">Performance Insights</h2>
        
        {/* Mobile Tabs */}
        <div className="flex lg:hidden mb-6 bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-400'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'breakdown' ? 'bg-blue-600 text-white' : 'text-gray-400'
            }`}
          >
            Breakdown
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'weekly' ? 'bg-blue-600 text-white' : 'text-gray-400'
            }`}
          >
            Weekly
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Cards - Always visible on desktop, conditional on mobile */}
          <div className={`lg:col-span-2 ${activeTab !== 'overview' ? 'hidden lg:block' : ''}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#0e0e10] rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Today's Study</div>
                <div className="text-2xl font-bold text-green-400 mb-1">3h 12m</div>
                <div className="text-xs text-gray-500">Current session</div>
              </div>
              <div className="bg-[#0e0e10] rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Focus Score</div>
                <div className="text-2xl font-bold text-green-400 mb-1">87%</div>
                <div className="text-xs text-gray-500">Great progress!</div>
              </div>
              <div className="bg-[#0e0e10] rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Current Streak</div>
                <div className="text-2xl font-bold text-orange-400 mb-1">7 days</div>
                <div className="text-xs text-gray-500">Keep it up! 🔥</div>
              </div>
            </div>
          </div>

          {/* Subject Breakdown Chart */}
          <div className={`bg-[#0e0e10] rounded-lg p-4 ${activeTab !== 'breakdown' && activeTab !== 'overview' ? 'hidden lg:block' : ''} ${activeTab === 'breakdown' ? 'lg:col-span-3' : ''}`}>
            <h3 className="text-lg font-semibold mb-4 text-white">Subject Breakdown</h3>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={activeTab === 'breakdown' ? 60 : 40}
                    outerRadius={activeTab === 'breakdown' ? 90 : 70}
                    paddingAngle={2}
                    dataKey="hours"
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {subjectData.map((subject, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }}></div>
                    <span className="text-gray-300">{subject.name}</span>
                  </div>
                  <div className="text-white font-medium">{subject.hours}h</div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Progress Chart */}
          <div className={`lg:col-span-3 bg-[#0e0e10] rounded-lg p-4 ${activeTab !== 'weekly' && activeTab !== 'overview' ? 'hidden lg:block' : ''}`}>
            <h3 className="text-lg font-semibold mb-4 text-white">Weekly Progress</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#a1a1aa', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#a1a1aa', fontSize: 12 }}
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
        </div>
      </div>
    </div>
  );
};
