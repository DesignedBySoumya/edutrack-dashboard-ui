
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { TrendingUp, Brain, Target, Calendar, Award, Clock } from "lucide-react";

const AnalyticsDashboard = () => {
  const [sessions] = useLocalStorage("mentalSessions", []);
  const [activeView, setActiveView] = useState("overview");

  const getAnalytics = () => {
    if (!sessions.length) return null;

    const totalQuestions = sessions.reduce((acc, s) => acc + (s.questions?.length || 0), 0);
    const totalTime = sessions.reduce((acc, s) => acc + (s.questions?.reduce((q, a) => q + a.timeSpent, 0) || 0), 0);
    const avgTime = totalTime / totalQuestions;

    const allQuestions = sessions.flatMap(s => s.questions || []);
    const fastQuestions = allQuestions.filter(q => q.timeSpent <= 30).length;
    const slowQuestions = allQuestions.filter(q => q.timeSpent > 80).length;

    const last7Days = sessions.filter(s => {
      const sessionDate = new Date(s.startTime);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessionDate > weekAgo;
    });

    const streakData = calculateStreak();
    const improvementTrend = calculateImprovement();

    return {
      totalSessions: sessions.length,
      totalQuestions,
      avgTime: Math.round(avgTime),
      beastModePercentage: Math.round((fastQuestions / totalQuestions) * 100),
      slowPercentage: Math.round((slowQuestions / totalQuestions) * 100),
      last7DaysSessions: last7Days.length,
      currentStreak: streakData.current,
      longestStreak: streakData.longest,
      improvementTrend
    };
  };

  const calculateStreak = () => {
    if (!sessions.length) return { current: 0, longest: 0 };

    const dates = sessions.map(s => new Date(s.startTime).toDateString()).reverse();
    const uniqueDates = [...new Set(dates)];
    
    let current = 0;
    let longest = 0;
    let temp = 0;

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    // Check current streak
    if (uniqueDates.includes(today) || uniqueDates.includes(yesterday)) {
      const sortedDates = uniqueDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      
      for (let i = 0; i < sortedDates.length; i++) {
        const date = new Date(sortedDates[i]);
        const expectedDate = new Date();
        expectedDate.setDate(expectedDate.getDate() - i);
        
        if (date.toDateString() === expectedDate.toDateString()) {
          current++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const current = new Date(uniqueDates[i]);
      const next = new Date(uniqueDates[i + 1]);
      const diffDays = (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24);
      
      if (diffDays <= 1) {
        temp++;
      } else {
        longest = Math.max(longest, temp + 1);
        temp = 0;
      }
    }
    longest = Math.max(longest, temp + 1);

    return { current, longest };
  };

  const calculateImprovement = () => {
    if (sessions.length < 2) return 0;

    const recent = sessions.slice(-3).flatMap(s => s.questions || []);
    const older = sessions.slice(0, 3).flatMap(s => s.questions || []);

    if (!recent.length || !older.length) return 0;

    const recentAvg = recent.reduce((acc, q) => acc + q.timeSpent, 0) / recent.length;
    const olderAvg = older.reduce((acc, q) => acc + q.timeSpent, 0) / older.length;

    return Math.round(((olderAvg - recentAvg) / olderAvg) * 100);
  };

  const analytics = getAnalytics();

  if (!analytics) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-bold text-white mb-2">No Data Yet</h3>
            <p className="text-gray-400 mb-4">Complete some battles to see your analytics</p>
            <Button className="bg-red-600 hover:bg-red-700">Start First Battle</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">📊 Beast Analytics</h1>
        <p className="text-gray-400">Track your journey to mastery</p>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 mb-6">
        {[
          { id: "overview", label: "Overview", icon: TrendingUp },
          { id: "patterns", label: "Patterns", icon: Brain },
          { id: "streaks", label: "Streaks", icon: Calendar }
        ].map(tab => (
          <Button
            key={tab.id}
            variant={activeView === tab.id ? "default" : "outline"}
            onClick={() => setActiveView(tab.id)}
            className={`${activeView === tab.id ? "bg-red-600" : "border-gray-600 text-gray-300"}`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Overview Stats */}
      {activeView === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                Total Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Sessions:</span>
                  <span className="text-white font-bold">{analytics.totalSessions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Questions:</span>
                  <span className="text-white font-bold">{analytics.totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Time:</span>
                  <span className="text-white font-bold">{analytics.avgTime}s</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                Beast Mode Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Beast Mode:</span>
                  <Badge className="bg-green-600">{analytics.beastModePercentage}%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Too Slow:</span>
                  <Badge className="bg-red-600">{analytics.slowPercentage}%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Improvement:</span>
                  <span className={`font-bold ${analytics.improvementTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {analytics.improvementTrend > 0 ? '+' : ''}{analytics.improvementTrend}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Streak Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Streak:</span>
                  <span className="text-white font-bold">{analytics.currentStreak} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Longest Streak:</span>
                  <span className="text-white font-bold">{analytics.longestStreak} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">This Week:</span>
                  <span className="text-white font-bold">{analytics.last7DaysSessions} sessions</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Improvement Insights */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Brain className="w-6 h-6" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-bold text-white">🎯 Performance Patterns</h4>
              <div className="space-y-2">
                {analytics.beastModePercentage >= 70 && (
                  <div className="p-3 bg-green-900/20 rounded-lg">
                    <p className="text-green-400 font-semibold">🔥 Beast Consistency</p>
                    <p className="text-gray-300 text-sm">You're maintaining excellent speed! Consider increasing difficulty.</p>
                  </div>
                )}
                {analytics.slowPercentage > 30 && (
                  <div className="p-3 bg-red-900/20 rounded-lg">
                    <p className="text-red-400 font-semibold">⚠️ Speed Focus Needed</p>
                    <p className="text-gray-300 text-sm">Practice formula recognition and quick calculation methods.</p>
                  </div>
                )}
                {analytics.improvementTrend > 0 && (
                  <div className="p-3 bg-blue-900/20 rounded-lg">
                    <p className="text-blue-400 font-semibold">📈 Improving Fast</p>
                    <p className="text-gray-300 text-sm">Your speed is improving by {analytics.improvementTrend}%!</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-white">🚀 Next Level Goals</h4>
              <div className="space-y-2">
                <div className="p-3 bg-purple-900/20 rounded-lg">
                  <p className="text-purple-400 font-semibold">Target: 80% Beast Mode</p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((analytics.beastModePercentage / 80) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{analytics.beastModePercentage}/80%</p>
                </div>
                
                {analytics.currentStreak < 7 && (
                  <div className="p-3 bg-yellow-900/20 rounded-lg">
                    <p className="text-yellow-400 font-semibold">🎯 7-Day Streak Challenge</p>
                    <p className="text-gray-300 text-sm">
                      {7 - analytics.currentStreak} more days to complete the challenge!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
