import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, Target, Calendar, Star, Flame, Trophy } from "lucide-react";
import { DashboardStats } from "@/lib/dashboardService";

interface FlashcardStatsProps {
  stats: DashboardStats;
}

export const FlashcardStats = ({ stats }: FlashcardStatsProps) => {
  const flashcardStats = stats.flashcardStats;
  const recentActivity = flashcardStats.recentActivity;

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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="text-center p-3 md:p-4 rounded-xl bg-[#0e0e10] flex flex-col items-center justify-center w-full min-h-[80px] md:min-h-[90px]">
              <div className="flex items-center justify-center gap-1 md:gap-2 mb-1 md:mb-2">
                <Star className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
                <div className="font-bold text-[#3B82F6] text-base md:text-lg lg:text-xl">{flashcardStats.totalXP}</div>
              </div>
              <div className="text-xs text-gray-400">Total XP</div>
            </div>
            <div className="text-center p-3 md:p-4 rounded-xl bg-[#0e0e10] flex flex-col items-center justify-center w-full min-h-[80px] md:min-h-[90px]">
              <div className="flex items-center justify-center gap-1 md:gap-2 mb-1 md:mb-2">
                <Target className="h-4 w-4 md:h-5 md:w-5 text-green-400" />
                <div className="font-bold text-[#10B981] text-base md:text-lg lg:text-xl">{flashcardStats.accuracy}%</div>
              </div>
              <div className="text-xs text-gray-400">Accuracy</div>
            </div>
            <div className="text-center p-3 md:p-4 rounded-xl bg-[#0e0e10] flex flex-col items-center justify-center w-full min-h-[80px] md:min-h-[90px]">
              <div className="flex items-center justify-center gap-1 md:gap-2 mb-1 md:mb-2">
                <Flame className="h-4 w-4 md:h-5 md:w-5 text-yellow-400" />
                <div className="font-bold text-[#FACC15] text-base md:text-lg lg:text-xl">{flashcardStats.currentStreak}</div>
                {flashcardStats.currentStreak >= 10 && <span className="ml-1 text-sm md:text-base">🔥</span>}
              </div>
              <div className="text-xs text-gray-400">Current Streak</div>
            </div>
            <div className="text-center p-3 md:p-4 rounded-xl bg-[#0e0e10] flex flex-col items-center justify-center w-full min-h-[80px] md:min-h-[90px]">
              <div className="flex items-center justify-center gap-1 md:gap-2 mb-1 md:mb-2">
                <Trophy className="h-4 w-4 md:h-5 md:w-5 text-purple-400" />
                <div className="font-bold text-[#8B5CF6] text-base md:text-lg lg:text-xl">{flashcardStats.longestStreak}</div>
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
              <span className="font-medium text-gray-100">{flashcardStats.totalSessions}</span>
            </div>
            <div>
              <span className="text-gray-400">Cards Reviewed: </span>
              <span className="font-medium text-gray-100">{flashcardStats.cardsReviewed}</span>
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
            {recentActivity.map((activity, index) => {
              // Determine styling based on action type
              const isNotPractice = activity.action === 'Not Practice';
              const isAddFlashcards = activity.action === 'Add Flashcards';
              
              const cardStyle = isNotPractice 
                ? "bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm border border-yellow-500/30"
                : isAddFlashcards
                ? "bg-gradient-to-r from-red-600/20 to-pink-600/20 backdrop-blur-sm border border-red-500/30"
                : "bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30";
              
              const textColor = isNotPractice 
                ? "text-yellow-300"
                : isAddFlashcards
                ? "text-red-300"
                : "text-blue-300";

              return (
                <div
                  key={index}
                  className={`${cardStyle} rounded-2xl p-4 md:p-5 shadow flex flex-col sm:flex-row sm:items-center sm:justify-between min-h-[90px] md:min-h-[100px]`}
                >
                  <div className="flex flex-col justify-center flex-1">
                    <div className="text-sm md:text-base font-semibold text-white mb-1">{activity.action}</div>
                    <div className={`text-xs md:text-sm ${textColor} leading-relaxed`}>{activity.detail}</div>
                  </div>
                  <div className="text-xs text-gray-300 mt-3 sm:mt-0 flex items-center sm:ml-4">{activity.time}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Last Session */}
        {flashcardStats.totalSessions > 0 ? (
          <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-4 shadow mt-4">
            <div className="text-sm text-green-300 mb-1">Last Session</div>
            <div className="font-semibold text-white">XP +{flashcardStats.lastSessionXP} earned</div>
            <div className="text-xs text-gray-300">{flashcardStats.lastSession}</div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-gray-600/20 to-gray-700/20 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-4 shadow mt-4">
            <div className="text-sm text-gray-300 mb-1">Last Session</div>
            <div className="font-semibold text-white">No sessions yet</div>
            <div className="text-xs text-gray-400">Start your first flashcard session</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 