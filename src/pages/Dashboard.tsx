
import { PerformanceInsights } from "@/components/dashboard/PerformanceInsights";
import { WeeklyProgress } from "@/components/dashboard/WeeklyProgress";
import { FlashcardStats } from "@/components/dashboard/FlashcardStats";
import { PomodoroStats } from "@/components/dashboard/PomodoroStats";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Sword, Timer, TrendingUp, Zap, Play } from "lucide-react";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-[#0e0e10] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">UPSC Study Dashboard</h1>
          <p className="text-gray-400 text-sm sm:text-base">Transform your preparation with data-driven insights</p>
        </div>
        {/* Unified Main Card */}
        <div className="bg-[#1a1a1d] rounded-xl p-4 sm:p-6 space-y-8">
          <PerformanceInsights />
          <WeeklyProgress />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#0e0e10] rounded-lg p-4 h-full flex flex-col justify-between">
              <FlashcardStats />
            </div>
            <div className="bg-[#0e0e10] rounded-lg p-4 h-full flex flex-col justify-between">
              <PomodoroStats />
            </div>
          </div>
          <div className="bg-[#0e0e10] rounded-lg p-4">
            <MockStats />
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced MockStats card with analytics and modern UX
const mockSpeedData = [
  { category: "Fast (≤30s)", count: 145, percentage: 58, color: "hsl(var(--success))" },
  { category: "Normal", count: 78, percentage: 31, color: "hsl(var(--primary))" },
  { category: "Slow (≥80s)", count: 27, percentage: 11, color: "hsl(var(--warning))" },
];
const mockTrend = [
  { day: "Mon", score: 82, questions: 25 },
  { day: "Tue", score: 78, questions: 30 },
  { day: "Wed", score: 85, questions: 22 },
  { day: "Thu", score: 90, questions: 28 },
  { day: "Fri", score: 87, questions: 35 },
  { day: "Sat", score: 92, questions: 40 },
  { day: "Sun", score: 88, questions: 20 },
];
const mockStats = {
  totalMocks: 12,
  avgScore: 78,
  highestScore: 92,
  lowestScore: 65,
  accuracy: 86,
  currentStreak: 4,
  bestStreak: 7,
  pending: 3,
};
const recentMocks = [
  { name: "Mock 12", score: 88, date: "Today" },
  { name: "Mock 11", score: 92, date: "Yesterday" },
  { name: "Mock 10", score: 75, date: "2 days ago" },
];

const MockStats = () => (
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
            <XAxis dataKey="day" className="text-xs text-gray-400" tick={{ fill: '#a3a3a3', fontSize: 12 }} />
            <YAxis className="text-xs text-gray-400" tick={{ fill: '#a3a3a3', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#181B23', border: 'none', color: '#fff' }} labelStyle={{ color: '#fff' }} itemStyle={{ color: '#fff' }} />
            <Line type="monotone" dataKey="score" stroke="#a3a3a3" strokeWidth={2} dot={{ fill: '#a3a3a3', strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
    {/* Speed Analysis */}
    <div>
      <h4 className="font-medium mb-2 flex items-center gap-2 text-gray-200"><Timer className="h-4 w-4 text-gray-300" /> Speed Analysis</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockSpeedData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="category" className="text-xs text-gray-400" tick={{ fill: '#a3a3a3', fontSize: 12 }} hide />
              <YAxis className="text-xs text-gray-400" tick={{ fill: '#a3a3a3', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#181B23', border: 'none', color: '#fff' }} labelStyle={{ color: '#fff' }} itemStyle={{ color: '#fff' }} />
              <Bar dataKey="count" fill="#a3a3a3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2 flex flex-col justify-center">
          {mockSpeedData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500" />
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
          <div key={idx} className="p-4 rounded-xl bg-zinc-800 flex flex-col items-center">
            <div className="font-bold text-lg text-gray-100">{mock.score}%</div>
            <div className="text-xs text-gray-400">{mock.name}</div>
            <div className="text-xs text-gray-400">{mock.date}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DashboardPage;
