import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, Target, Calendar, Star, Flame, Trophy } from "lucide-react";

export const FlashcardStats = () => {
  const stats = {
    totalXP: 1480,
    currentLevel: 7,
    currentStreak: 12,
    longestStreak: 18,
    totalSessions: 45,
    cardsReviewed: 324,
    accuracy: 84,
    lastSession: "3 hours ago",
  };

  const recentActivity = [
    { action: "XP +120", detail: "Geography review session", time: "3h ago" },
    { action: "XP +95", detail: "Polity flashcards", time: "1d ago" },
    { action: "Streak extended", detail: "Day 12 completed", time: "1d ago" },
  ];

  return (
    <Card className="bg-[#181B23] rounded-2xl shadow p-6 font-inter text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Brain className="h-5 w-5 text-gray-300" />
          <span>Flashcard Review</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Stats */}
        <div className="w-full max-w-full overflow-x-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 gap-y-4">
            <div className="text-center p-3 md:p-4 rounded-xl bg-[#0e0e10] flex flex-col items-center w-full">
              <div className="flex items-center justify-center gap-2">
                <Star className="h-5 w-5 text-blue-400" />
                <div className="font-bold text-[#3B82F6] text-lg md:text-2xl">{stats.totalXP}</div>
              </div>
              <div className="text-xs text-gray-400">Total XP</div>
            </div>
            <div className="text-center p-3 md:p-4 rounded-xl bg-[#0e0e10] flex flex-col items-center w-full">
              <div className="flex items-center justify-center gap-2">
                <Target className="h-5 w-5 text-green-400" />
                <div className="font-bold text-[#10B981] text-lg md:text-2xl">{stats.accuracy}%</div>
              </div>
              <div className="text-xs text-gray-400">Accuracy</div>
            </div>
            <div className="text-center p-3 md:p-4 rounded-xl bg-[#0e0e10] flex flex-col items-center w-full">
              <div className="flex items-center justify-center gap-2">
                <Flame className="h-5 w-5 text-yellow-400" />
                <div className="font-bold text-[#FACC15] text-lg md:text-2xl">{stats.currentStreak}</div>
                {stats.currentStreak >= 10 && <span className="ml-1 text-lg">🔥</span>}
              </div>
              <div className="text-xs text-gray-400">Current Streak</div>
            </div>
            <div className="text-center p-3 md:p-4 rounded-xl bg-[#0e0e10] flex flex-col items-center w-full">
              <div className="flex items-center justify-center gap-2">
                <Trophy className="h-5 w-5 text-purple-400" />
                <div className="font-bold text-[#8B5CF6] text-lg md:text-2xl">{stats.longestStreak}</div>
              </div>
              <div className="text-xs text-gray-400">Longest Streak</div>
            </div>
          </div>
        </div>

        {/* Review Stats */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-200">Review Statistics</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Total Sessions: </span>
              <span className="font-medium text-gray-100">{stats.totalSessions}</span>
            </div>
            <div>
              <span className="text-gray-400">Cards Reviewed: </span>
              <span className="font-medium text-gray-100">{stats.cardsReviewed}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h4 className="font-medium mb-3 flex items-center text-gray-200">
            <Calendar className="h-4 w-4 mr-2 text-gray-300" />
            Recent Activity
          </h4>
          <div className="space-y-2">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-4 shadow flex flex-col sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-white">{activity.action}</div>
                  <div className="text-xs text-blue-300">{activity.detail}</div>
                </div>
                <div className="text-xs text-gray-300 mt-2 sm:mt-0">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Last Session */}
        <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-4 shadow mt-4">
          <div className="text-sm text-green-300 mb-1">Last Session</div>
          <div className="font-semibold text-white">XP +120 earned</div>
          <div className="text-xs text-gray-300">{stats.lastSession}</div>
        </div>
      </CardContent>
    </Card>
  );
} 