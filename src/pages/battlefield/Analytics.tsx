import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { BattleAnalyticsService, BattleAnalytics } from "@/lib/battleAnalyticsService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Brain, Target, Calendar, Award, Clock, Loader2 } from "lucide-react";

const Analytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<BattleAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState("overview");

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        const analyticsService = new BattleAnalyticsService(user.id);
        const data = await analyticsService.getAllAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-16 h-16 mx-auto mb-4 text-gray-400 animate-spin" />
            <h3 className="text-xl font-bold text-white mb-2">Loading Analytics</h3>
            <p className="text-gray-400">Fetching your battle data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <Brain className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h3 className="text-xl font-bold text-white mb-2">Error Loading Data</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <Button 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analytics || analytics.totalQuestions === 0) {
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
        <h1 className="text-3xl font-bold text-white mb-2">📊 Battle Analytics</h1>
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
                  <span className="text-white font-bold">{analytics.avgTimeSpent}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Accuracy:</span>
                  <span className="text-white font-bold">{analytics.accuracyPercentage}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                Speed Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Fast Mode:</span>
                  <Badge className="bg-green-600">{analytics.beastModePercentage}%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Normal Speed:</span>
                  <Badge className="bg-blue-600">{analytics.normalSpeedPercentage}%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Too Slow:</span>
                  <Badge className="bg-red-600">{analytics.slowPercentage}%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Improvement:</span>
                  <span className={`font-bold ${analytics.improvementPercentage > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {analytics.improvementPercentage > 0 ? '+' : ''}{analytics.improvementPercentage}%
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
                  <span className="text-white font-bold">{analytics.sessionsLast7Days} sessions</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Week Accuracy:</span>
                  <span className="text-white font-bold">{analytics.accuracyLast7Days}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Patterns View */}
      {activeView === "patterns" && (
        <div className="space-y-6">
          {/* Time Distribution */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Clock className="w-6 h-6" />
                Time Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.timeDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-300">{item.timeCategory}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-white font-bold w-16 text-right">
                        {item.questionCount}
                      </span>
                      <span className="text-gray-400 w-12 text-right">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Confidence Analysis */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Brain className="w-6 h-6" />
                Confidence Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analytics.confidenceAnalysis.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-700 rounded-lg">
                    <h4 className="font-bold text-white mb-2">{item.confidenceLevel}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Attempts:</span>
                        <span className="text-white">{item.totalAttempts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Accuracy:</span>
                        <span className="text-white">{item.accuracyPercentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg Time:</span>
                        <span className="text-white">{item.avgTimeSpent}s</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Streaks View */}
      {activeView === "streaks" && (
        <div className="space-y-6">
          {/* Weekly Trends */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                Weekly Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.weeklyTrends.slice(0, 4).map((week, index) => (
                  <div key={index} className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-white">
                        Week of {new Date(week.weekStart).toLocaleDateString()}
                      </h4>
                      <Badge className="bg-blue-600">
                        {week.sessionsCount} sessions
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Questions:</span>
                        <div className="text-white font-bold">{week.questionsCount}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Avg Time:</span>
                        <div className="text-white font-bold">{week.avgTimeSpent}s</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Accuracy:</span>
                        <div className="text-white font-bold">{week.accuracyPercentage}%</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Fast Mode:</span>
                        <div className="text-white font-bold">{week.beastModePercentage}%</div>
                      </div>
                    </div>
                  </div>
                ))}
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
                    <p className="text-green-400 font-semibold">🔥 Speed Consistency</p>
                    <p className="text-gray-300 text-sm">You're maintaining excellent speed! Consider increasing difficulty.</p>
                  </div>
                )}
                {analytics.slowPercentage > 30 && (
                  <div className="p-3 bg-red-900/20 rounded-lg">
                    <p className="text-red-400 font-semibold">⚠️ Speed Focus Needed</p>
                    <p className="text-gray-300 text-sm">Practice formula recognition and quick calculation methods.</p>
                  </div>
                )}
                {analytics.improvementPercentage > 0 && (
                  <div className="p-3 bg-blue-900/20 rounded-lg">
                    <p className="text-blue-400 font-semibold">📈 Improving Fast</p>
                    <p className="text-gray-300 text-sm">Your speed is improving by {analytics.improvementPercentage}%!</p>
                  </div>
                )}
                {analytics.accuracyPercentage < 70 && (
                  <div className="p-3 bg-yellow-900/20 rounded-lg">
                    <p className="text-yellow-400 font-semibold">🎯 Accuracy Focus</p>
                    <p className="text-gray-300 text-sm">Focus on accuracy over speed. Your current accuracy is {analytics.accuracyPercentage}%.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-white">🚀 Next Level Goals</h4>
              <div className="space-y-2">
                <div className="p-3 bg-purple-900/20 rounded-lg">
                  <p className="text-purple-400 font-semibold">Target: 80% Fast Mode</p>
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

                <div className="p-3 bg-green-900/20 rounded-lg">
                  <p className="text-green-400 font-semibold">Target: 85% Accuracy</p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((analytics.accuracyPercentage / 85) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{analytics.accuracyPercentage}/85%</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics; 