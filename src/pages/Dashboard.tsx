
import { PerformanceInsights } from "@/components/dashboard/PerformanceInsights";
import { WeeklyProgress } from "@/components/dashboard/WeeklyProgress";
import { FlashcardStats } from "@/components/dashboard/FlashcardStats";
import { PomodoroStats } from "@/components/dashboard/PomodoroStats";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from "recharts";
import { Sword, Timer, TrendingUp, Zap, Play } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { supabase } from "@/lib/supabaseClient";
import { DashboardStats } from '@/lib/dashboardService';

interface Exam {
  id: number;
  name: string;
}

const DashboardPage = () => {
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [loadingExam, setLoadingExam] = useState(true);

  const { stats, loading, error, refreshing } = useDashboard(selectedExam?.id || null);

  // Load initial exam selection
  useEffect(() => {
    const loadInitialExam = async () => {
      try {
        const savedExamId = localStorage.getItem('selectedExamId');
        if (savedExamId) {
          const { data: examData, error } = await supabase
            .from('exams')
            .select('id, name')
            .eq('id', parseInt(savedExamId))
            .single();

          if (!error && examData) {
            setSelectedExam({ id: examData.id, name: examData.name });
          }
        }
      } catch (error) {
        console.error('Error loading initial exam:', error);
      } finally {
        setLoadingExam(false);
      }
    };

    loadInitialExam();
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8">
        {/* Dynamic Header */}
        <div className="text-center mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {loadingExam ? 'Loading...' : selectedExam ? `${selectedExam.name} Dashboard` : 'Study Dashboard'}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">Transform your preparation with data-driven insights</p>
          {error && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
              Error: {error}
            </div>
          )}
          {refreshing && false && (
            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg text-blue-300 text-sm">
              Updating data...
            </div>
          )}
        </div>

        <div className="relative min-h-[320px]">
          <div className={`absolute inset-0 transition-opacity duration-500 ${loading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}> 
            <div className="bg-[#1a1a1d] rounded-xl p-4 sm:p-6 w-full h-full flex flex-col justify-center">
              <div className="animate-shimmer h-8 w-2/3 mb-6 rounded-lg bg-muted" />
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="animate-shimmer h-16 w-32 rounded-xl bg-muted" />
                <div className="animate-shimmer h-16 w-32 rounded-xl bg-muted" />
                <div className="animate-shimmer h-16 w-32 rounded-xl bg-muted" />
              </div>
              <div className="animate-shimmer h-32 w-full rounded-xl bg-muted" />
            </div>
          </div>
          <div className={`transition-opacity duration-500 ${loading ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}> 
            {stats ? (
              <PerformanceInsights stats={stats} />
            ) : (
              <div className="bg-[#1a1a1d] rounded-xl p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Performance Insights</h2>
                <div className="text-center text-gray-400 py-8">
                  No data available
                </div>
              </div>
            )}
          </div>
        </div>
        {loading ? (
          <div className="bg-[#1a1a1d] rounded-xl p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 sm:gap-4">
                  <button className="px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 text-gray-400">Week</button>
                  <button className="px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 text-gray-400">Month</button>
                  <button className="px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 text-gray-400">Year</button>
                </div>
              </div>
            </div>
            <div className="text-center text-gray-400 py-8">
              Loading...
            </div>
          </div>
        ) : stats ? (
          <WeeklyProgress stats={stats} />
        ) : (
          <div className="bg-[#1a1a1d] rounded-xl p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 sm:gap-4">
                  <button className="px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 text-gray-400">Week</button>
                  <button className="px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 text-gray-400">Month</button>
                  <button className="px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 text-gray-400">Year</button>
                </div>
              </div>
            </div>
            <div className="text-center text-gray-400 py-8">
              No data available
            </div>
          </div>
        )}
        {/* --- Added Components Below --- */}
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <>
              <div className="bg-[#181B23] rounded-2xl shadow p-6 font-inter text-white">
                <div className="text-center text-gray-400 py-8">Loading...</div>
              </div>
              <div className="bg-[#181B23] rounded-2xl shadow p-6 font-inter text-white">
                <div className="text-center text-gray-400 py-8">Loading...</div>
              </div>
            </>
          ) : stats ? (
            <>
              <FlashcardStats stats={stats} />
              <PomodoroStats stats={stats} />
            </>
          ) : (
            <>
              <div className="bg-[#181B23] rounded-2xl shadow p-6 font-inter text-white">
                <div className="text-center text-gray-400 py-8">No data available</div>
              </div>
              <div className="bg-[#181B23] rounded-2xl shadow p-6 font-inter text-white">
                <div className="text-center text-gray-400 py-8">No data available</div>
              </div>
            </>
          )}
        </div>
        {/* Full-width MockStats card below */}
        <div className="mt-6">
          {loading ? (
            <div className="bg-[#181B23] rounded-2xl shadow p-6 font-inter text-white flex flex-col gap-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sword className="h-6 w-6 text-gray-300" />
                  <h2 className="text-xl font-bold text-white">Mock Test Analytics</h2>
                </div>
              </div>
              <div className="text-center text-gray-400 py-8">
                Loading...
              </div>
            </div>
          ) : stats ? (
            <MockStats stats={stats} />
          ) : (
            <div className="bg-[#181B23] rounded-2xl shadow p-6 font-inter text-white flex flex-col gap-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sword className="h-6 w-6 text-gray-300" />
                  <h2 className="text-xl font-bold text-white">Mock Test Analytics</h2>
                </div>
              </div>
              <div className="text-center text-gray-400 py-8">
                No data available
              </div>
            </div>
          )}
        </div>
        {/* Performance Summary */}
      </div>
    </div>
  );
};

// Custom Tooltip for Score Trend
const ScoreTrendTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.18) 0%, rgba(30,41,59,0.85) 100%)',
          color: '#fff',
          borderRadius: 12,
          padding: 14,
          border: '1px solid rgba(59,130,246,0.25)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 8px 0 rgba(59,130,246,0.10)',
        }}
      >
        <div style={{ fontWeight: 500 }}>{label}</div>
        <div>
          <span style={{ color: '#a1a1aa' }}>Score: </span>
          <span style={{ color: '#3B82F6', fontWeight: 700 }}>{payload[0].value}%</span>
        </div>
      </div>
    );
  }
  return null;
};

const MockStats = ({ stats }: { stats: DashboardStats }) => {
  const mockSpeedData = stats.mockSpeedData;
  const mockTrend = stats.mockTrend;
  const mockStats = stats.mockStats;
  const recentMocks = stats.recentMocks;

  return (
  <div className="bg-[#181B23] rounded-2xl shadow p-6 font-inter text-white flex flex-col gap-6">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Sword className="h-6 w-6 text-gray-300" />
        <h2 className="text-xl font-bold text-white">Mock Test Analytics</h2>
      </div>
    </div>
    {/* Key Metrics */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-100">{mockStats.totalMocks}</div>
        <div className="text-xs text-gray-400">Mocks Taken</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-100">{mockStats.avgScore}%</div>
        <div className="text-xs text-gray-400">Avg. Score</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-100">{mockStats.currentStreak}</div>
        <div className="text-xs text-gray-400">Current Streak</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-100">{mockStats.bestStreak}</div>
        <div className="text-xs text-gray-400">Best Streak</div>
      </div>
    </div>
    {/* Score Trend */}
    <div>
      <h4 className="font-medium mb-2 flex items-center gap-2 text-gray-200"><TrendingUp className="h-4 w-4 text-gray-300" /> Score Trend (Last 7 Days)</h4>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockTrend}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="day" className="text-xs text-gray-400" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
            <YAxis className="text-xs text-gray-400" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
            <Tooltip content={<ScoreTrendTooltip />} cursor={{ fill: '#181B23', opacity: 0.7 }} />
            <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
    {/* Speed Analysis */}
    <div>
      <h4 className="font-medium mb-2 flex items-center gap-2 text-gray-200"><Timer className="h-4 w-4 text-gray-300" /> Speed Analysis</h4>
      <div className="bg-[#181B23] rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockSpeedData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="category" className="text-xs text-gray-400" tick={{ fill: '#a1a1aa', fontSize: 12 }} hide />
              <YAxis className="text-xs text-gray-400" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
              <Tooltip
                content={({ active, payload, label }) =>
                  active && payload && payload.length ? (
                    <div
                      style={{
                        background: 'linear-gradient(135deg, rgba(59,130,246,0.18) 0%, rgba(30,41,59,0.85) 100%)',
                        color: '#fff',
                        borderRadius: 12,
                        padding: 14,
                        border: '1px solid rgba(59,130,246,0.25)',
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 2px 8px 0 rgba(59,130,246,0.10)',
                      }}
                    >
                      <div style={{ fontWeight: 500 }}>{label}</div>
                      <div>
                        <span style={{ color: '#a1a1aa' }}>Count: </span>
                        <span style={{ color: payload[0].payload.color, fontWeight: 700 }}>{payload[0].value}</span>
                      </div>
                    </div>
                  ) : null
                }
                 cursor={{ fill: '#181B23', opacity: 0.7 }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}
                {
                  ...mockSpeedData.reduce((acc, item, idx) => {
                    acc[`fill${idx}`] = item.color;
                    return acc;
                  }, {})
                }
                >
                {mockSpeedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2 flex flex-col justify-center">
          {mockSpeedData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-200">{item.category}</span>
              </div>
              <div className="text-right">
                <span className="font-medium text-gray-100">{item.count}</span>
                <span className="text-xs text-gray-400 ml-1">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    {/* Recent Mocks */}
    <div>
      <h4 className="font-medium mb-2 flex items-center gap-2 text-gray-200"><Zap className="h-4 w-4 text-yellow-400" /> Recent Mock Results</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recentMocks.map((mock, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-4 shadow flex flex-col items-center"
          >
            <div className="font-bold text-lg text-white">{mock.score}%</div>
            <div className="text-xs text-blue-300">{mock.name}</div>
            <div className="text-xs text-gray-300">{mock.date}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default DashboardPage;
