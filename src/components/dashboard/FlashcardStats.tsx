import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, Target, Calendar } from "lucide-react";

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
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-zinc-800 rounded-xl">
            <div className="text-2xl font-bold text-gray-100">{stats.totalXP}</div>
            <div className="text-xs text-gray-400">Total XP</div>
            <Badge variant="secondary" className="mt-1 bg-zinc-700 text-gray-200 border-0">Level {stats.currentLevel}</Badge>
          </div>
          <div className="text-center p-4 bg-zinc-800 rounded-xl">
            <div className="text-2xl font-bold text-gray-100">{stats.accuracy}%</div>
            <div className="text-xs text-gray-400">Accuracy</div>
          </div>
        </div>

        {/* Streaks */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Zap className="h-4 w-4 text-yellow-400" />
            <div>
              <div className="font-medium text-gray-100">{stats.currentStreak} days</div>
              <div className="text-xs text-gray-400">Current Streak</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Target className="h-4 w-4 text-gray-300" />
            <div>
              <div className="font-medium text-gray-100">{stats.longestStreak} days</div>
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
              <div key={index} className="flex items-center justify-between p-2 bg-zinc-800 rounded-md">
                <div>
                  <div className="text-sm font-medium text-gray-100">{activity.action}</div>
                  <div className="text-xs text-gray-400">{activity.detail}</div>
                </div>
                <div className="text-xs text-gray-400">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Last Session */}
        <div className="p-4 bg-zinc-900 rounded-xl">
          <div className="text-sm text-gray-400">Last Session</div>
          <div className="font-medium text-gray-100">XP +120 earned</div>
          <div className="text-xs text-gray-400">{stats.lastSession}</div>
        </div>
      </CardContent>
    </Card>
  );
} 