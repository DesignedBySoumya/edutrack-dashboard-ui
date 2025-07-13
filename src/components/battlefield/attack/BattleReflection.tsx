
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Target, TrendingUp, Award, CheckCircle, XCircle, Timer, Zap, Trophy, BarChart3 } from "lucide-react";
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

interface BattleLog {
  id: string;
  user_id: string;
  question_id: number;
  question_number: number;
  selected_answer: number;
  correct_answer: number;
  is_correct: boolean;
  confidence: 'low' | 'medium' | 'high';
  time_spent: number;
  battle_started_at: string;
  answered_at: string;
  exam_id: number;
  created_at: string;
}

const BattleReflection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [battleLogs, setBattleLogs] = useState<BattleLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchBattleLogs();
    }
  }, [user]);

  const fetchBattleLogs = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get the latest battle session
      const { data: latestBattle, error: latestError } = await supabase
        .from('battle_logs')
        .select('battle_started_at')
        .eq('user_id', user.id)
        .order('battle_started_at', { ascending: false })
        .limit(1);

      if (latestError) {
        console.error('Error fetching latest battle:', latestError);
        setError('Failed to fetch battle data');
        return;
      }

      if (!latestBattle || latestBattle.length === 0) {
        setError('No battle logs found');
        setLoading(false);
        return;
      }

      // Fetch all logs for the latest battle
      const { data: logs, error: logsError } = await supabase
        .from('battle_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('battle_started_at', latestBattle[0].battle_started_at)
        .order('question_number', { ascending: true });

      if (logsError) {
        console.error('Error fetching battle logs:', logsError);
        setError('Failed to fetch battle logs');
        return;
      }

      setBattleLogs(logs || []);
    } catch (err) {
      console.error('Error in fetchBattleLogs:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getBattleSummary = () => {
    if (battleLogs.length === 0) return null;

    const totalQuestions = battleLogs.length;
    const totalCorrect = battleLogs.filter(log => log.is_correct).length;
    const totalWrong = totalQuestions - totalCorrect;
    const averageTime = Math.round(
      battleLogs.reduce((acc, log) => acc + log.time_spent, 0) / totalQuestions
    );
    const beastModeCount = battleLogs.filter(log => log.confidence === 'high').length;

    return {
      totalQuestions,
      totalCorrect,
      totalWrong,
      averageTime,
      beastModeCount,
      accuracy: Math.round((totalCorrect / totalQuestions) * 100),
      beastModePercentage: Math.round((beastModeCount / totalQuestions) * 100)
    };
  };

  const getPerformanceLevel = (beastModePercentage: number) => {
    if (beastModePercentage >= 70) return { level: "🔥 BEAST MODE", color: "text-red-400", bg: "bg-red-950/30", border: "border-red-800" };
    if (beastModePercentage >= 50) return { level: "⚡ WARRIOR", color: "text-orange-400", bg: "bg-orange-950/30", border: "border-orange-800" };
    if (beastModePercentage >= 30) return { level: "🎯 FIGHTER", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-800" };
    return { level: "🛡️ TRAINEE", color: "text-blue-400", bg: "bg-blue-950/30", border: "border-blue-800" };
  };

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return <Badge className="bg-red-600/80 text-red-100 border-red-500">🔥 Beast Mode</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-600/80 text-yellow-100 border-yellow-500">⚡ Confident</Badge>;
      case 'low':
        return <Badge className="bg-blue-600/80 text-blue-100 border-blue-500">🤔 Guessing</Badge>;
      default:
        return <Badge variant="outline" className="border-gray-600 text-gray-300">Unknown</Badge>;
    }
  };

  const getTimeStatus = (timeSpent: number) => {
    if (timeSpent <= 30) return { icon: "🔥", color: "text-red-400", bg: "bg-red-950/20", label: "Fast" };
    if (timeSpent <= 45) return { icon: "⚡", color: "text-yellow-400", bg: "bg-yellow-950/20", label: "Good" };
    if (timeSpent <= 80) return { icon: "⏰", color: "text-orange-400", bg: "bg-orange-950/20", label: "Slow" };
    return { icon: "🔔", color: "text-red-400", bg: "bg-red-950/20", label: "Very Slow" };
  };

  const summary = getBattleSummary();
  const performance = summary ? getPerformanceLevel(summary.beastModePercentage) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center p-4">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-slate-300">Loading battle reflection...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center p-4">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <p className="text-slate-300 mb-4">{error || 'No battle data found'}</p>
            <Button onClick={() => navigate("/battlefield/attack")} className="bg-red-600 hover:bg-red-700">
              Back to Attack
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/battlefield/attack")}
            className="text-slate-400 hover:text-white hover:bg-slate-800/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Attack
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">⚔️ Battle Reflection</h1>
            <p className="text-slate-400 text-sm">
              Analyze your performance and identify areas for improvement
            </p>
          </div>
          <div className="w-[100px] sm:w-[120px]"></div>
        </div>

        {/* Performance Overview */}
        <Card className={`${performance?.bg} ${performance?.border} border backdrop-blur-sm`}>
          <CardHeader className="pb-4">
            <CardTitle className={`text-xl sm:text-2xl ${performance?.color} text-center flex items-center justify-center gap-2`}>
              <Trophy className="w-6 h-6" />
              {performance?.level}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold text-white">{summary.totalQuestions}</div>
                <div className="text-xs sm:text-sm text-slate-400">Total Questions</div>
              </div>
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold text-green-400">{summary.totalCorrect}</div>
                <div className="text-xs sm:text-sm text-slate-400">Correct</div>
              </div>
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold text-red-400">{summary.totalWrong}</div>
                <div className="text-xs sm:text-sm text-slate-400">Wrong</div>
              </div>
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold text-blue-400">{summary.averageTime}s</div>
                <div className="text-xs sm:text-sm text-slate-400">Avg Time</div>
              </div>
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold text-orange-400">{summary.beastModeCount}</div>
                <div className="text-xs sm:text-sm text-slate-400">Beast Mode</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">Correct Answers</span>
              <span className="text-white font-bold text-lg">{summary.accuracy}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${summary.accuracy}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Question-by-Question Review */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Question Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {battleLogs.map((log, index) => {
                const timeStatus = getTimeStatus(log.time_spent);
                const answerOptions = ['A', 'B', 'C', 'D'];

                return (
                  <div key={log.id} className={`p-4 rounded-lg border ${log.is_correct ? 'bg-green-950/20' : timeStatus.bg} border-slate-600/50`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{timeStatus.icon}</span>
                        <span className="text-white font-semibold">Q{log.question_number}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`${log.is_correct ? 'text-green-400' : timeStatus.color} border-slate-600`}>
                          {timeStatus.label}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Your Answer:</span>
                        <span className={`font-semibold ${log.is_correct ? 'text-green-400' : 'text-red-400'}`}>
                          {answerOptions[log.selected_answer]}
                        </span>
                        {log.is_correct ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Correct:</span>
                        <span className="text-green-400 font-semibold">
                          {answerOptions[log.correct_answer]}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Time:</span>
                        <span className={`font-semibold ${timeStatus.color}`}>
                          {log.time_spent}s
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Status:</span>
                        <span className={`font-semibold ${log.is_correct ? 'text-green-400' : 'text-red-400'}`}>
                          {log.is_correct ? 'Correct' : 'Wrong'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Improvement Insights */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Improvement Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summary.accuracy < 70 && (
                <div className="p-4 bg-red-950/30 border border-red-800/50 rounded-lg">
                  <h4 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Accuracy Focus
                  </h4>
                  <p className="text-slate-300 text-sm">
                    Your accuracy is {summary.accuracy}%. Focus on understanding concepts thoroughly before attempting speed.
                  </p>
                </div>
              )}
              
              {summary.beastModePercentage < 50 && (
                <div className="p-4 bg-orange-950/30 border border-orange-800/50 rounded-lg">
                  <h4 className="font-semibold text-orange-400 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Speed Building
                  </h4>
                  <p className="text-slate-300 text-sm">
                    Only {summary.beastModePercentage}% of questions were in Beast Mode. Practice daily to build speed confidence.
                  </p>
                </div>
              )}

              {summary.beastModePercentage >= 70 && summary.accuracy >= 80 && (
                <div className="p-4 bg-green-950/30 border border-green-800/50 rounded-lg">
                  <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Beast Level Achieved!
                  </h4>
                  <p className="text-slate-300 text-sm">
                    Excellent performance! You're maintaining high speed with good accuracy. Consider increasing difficulty.
                  </p>
                </div>
              )}

              {summary.averageTime > 60 && (
                <div className="p-4 bg-yellow-950/30 border border-yellow-800/50 rounded-lg">
                  <h4 className="font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                    <Timer className="w-4 h-4" />
                    Time Management
                  </h4>
                  <p className="text-slate-300 text-sm">
                    Average time of {summary.averageTime}s is above target. Practice quick recognition patterns.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => navigate("/battlefield/attack/arsenal")}
            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 font-semibold"
          >
            <Award className="w-4 h-4 mr-2" />
            Generate Beast Arsenal 📋
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate("/battlefield/attack/plan")}
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:text-white py-4 font-semibold"
          >
            Battle Again ⚔️
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BattleReflection;
