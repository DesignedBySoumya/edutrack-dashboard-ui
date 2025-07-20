import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Sword, Timer, TrendingUp, Zap } from "lucide-react";

const speedData = [
  { category: "Fast (≤30s)", count: 145, percentage: 58, color: "hsl(var(--success))" },
  { category: "Normal", count: 78, percentage: 31, color: "hsl(var(--primary))" },
  { category: "Slow (≥80s)", count: 27, percentage: 11, color: "hsl(var(--warning))" },
];

const weeklyTrend = [
  { day: "Mon", accuracy: 82, questions: 25 },
  { day: "Tue", accuracy: 78, questions: 30 },
  { day: "Wed", accuracy: 85, questions: 22 },
  { day: "Thu", accuracy: 90, questions: 28 },
  { day: "Fri", accuracy: 87, questions: 35 },
  { day: "Sat", accuracy: 92, questions: 40 },
  { day: "Sun", accuracy: 88, questions: 20 },
];

export const MCQBattleStats = () => {
  const stats = {
    totalSessions: 34,
    totalQuestions: 850,
    overallAccuracy: 86,
    avgTimePerQuestion: 45,
    currentStreak: 8,
    longestStreak: 15,
    beastModePercentage: 58,
  };

  const totalQuestions = speedData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sword className="h-5 w-5" />
          <span>MCQ Battle Analytics</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-primary">{stats.totalQuestions}</div>
            <div className="text-xs text-muted-foreground">Questions</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-success">{stats.overallAccuracy}%</div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{stats.avgTimePerQuestion}s</div>
            <div className="text-xs text-muted-foreground">Avg Time</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-warning">{stats.currentStreak}</div>
            <div className="text-xs text-muted-foreground">Streak</div>
          </div>
        </div>

        {/* Speed Analysis */}
        <div>
          <h4 className="font-medium mb-3 flex items-center">
            <Timer className="h-4 w-4 mr-2" />
            Speed Analysis
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={speedData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="category" className="text-xs" hide />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {speedData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">{item.count}</span>
                    <span className="text-xs text-muted-foreground ml-1">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 p-2 bg-success/10 rounded-lg">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-success">
                Beast Mode: {stats.beastModePercentage}% of answers in ≤30s
              </span>
            </div>
          </div>
        </div>

        {/* Weekly Trend */}
        <div>
          <h4 className="font-medium mb-3 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Weekly Performance
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Battle Streaks */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-warning/5 rounded-lg">
            <div className="font-medium">{stats.currentStreak} days</div>
            <div className="text-sm text-muted-foreground">Current Battle Streak</div>
          </div>
          <div className="p-3 bg-primary/5 rounded-lg">
            <div className="font-medium">{stats.longestStreak} days</div>
            <div className="text-sm text-muted-foreground">Longest Battle Streak</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-3 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground">Last 7 Days</div>
          <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
            <div>
              <div className="font-medium">12</div>
              <div className="text-xs text-muted-foreground">Sessions</div>
            </div>
            <div>
              <div className="font-medium">200</div>
              <div className="text-xs text-muted-foreground">Questions</div>
            </div>
            <div>
              <div className="font-medium">88%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 