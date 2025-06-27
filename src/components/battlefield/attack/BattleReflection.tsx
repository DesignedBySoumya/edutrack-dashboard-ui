
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Target, TrendingUp, Award } from "lucide-react";

const BattleReflection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionData = location.state?.sessionData;

  const [reflections, setReflections] = useState({});

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <p className="text-gray-400 mb-4">No session data found</p>
            <Button onClick={() => navigate("/attack")}>Back to Attack</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { questions = [], averageTime = 0, totalQuestions = 0 } = sessionData;

  const benchmarks = {
    topper: 30,
    average: 45,
    maximum: 80
  };

  const getPerformanceInsights = () => {
    const fastQuestions = questions.filter(q => q.timeSpent <= benchmarks.topper).length;
    const slowQuestions = questions.filter(q => q.timeSpent > benchmarks.maximum).length;
    const avgTimeQuestions = questions.filter(q => q.timeSpent > benchmarks.topper && q.timeSpent <= benchmarks.average).length;

    return {
      fastQuestions,
      slowQuestions,
      avgTimeQuestions,
      beastModePercentage: Math.round((fastQuestions / questions.length) * 100)
    };
  };

  const insights = getPerformanceInsights();

  const getPerformanceLevel = () => {
    if (insights.beastModePercentage >= 70) return { level: "🔥 BEAST MODE", color: "text-red-500", bg: "bg-red-900/20" };
    if (insights.beastModePercentage >= 50) return { level: "⚡ WARRIOR", color: "text-orange-500", bg: "bg-orange-900/20" };
    if (insights.beastModePercentage >= 30) return { level: "🎯 FIGHTER", color: "text-yellow-500", bg: "bg-yellow-900/20" };
    return { level: "🛡️ TRAINEE", color: "text-blue-500", bg: "bg-blue-900/20" };
  };

  const performance = getPerformanceLevel();

  const generateBeastArsenal = () => {
    navigate("/attack/arsenal", { state: { sessionData, reflections, insights } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/attack")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Attack
          </Button>
          <h1 className="text-3xl font-bold text-white">⚔️ Battle Reflection</h1>
          <div></div>
        </div>

        {/* Performance Overview */}
        <Card className={`${performance.bg} border-gray-700 mb-6`}>
          <CardHeader>
            <CardTitle className={`text-2xl ${performance.color} text-center`}>
              {performance.level}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{totalQuestions}</div>
                <div className="text-sm text-gray-400">Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{Math.round(averageTime)}s</div>
                <div className="text-sm text-gray-400">Avg Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">{insights.fastQuestions}</div>
                <div className="text-sm text-gray-400">Beast Mode</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">{insights.slowQuestions}</div>
                <div className="text-sm text-gray-400">Too Slow</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timing Breakdown */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Timing Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Beast Mode Questions */}
              <div className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-600">🔥 Beast Mode (≤30s)</Badge>
                  <span className="text-white">{insights.fastQuestions} questions</span>
                </div>
                <div className="text-green-500 font-bold">{insights.beastModePercentage}%</div>
              </div>

              {/* Good Pace Questions */}
              <div className="flex items-center justify-between p-3 bg-yellow-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className="bg-yellow-600">⚡ Good Pace (31-45s)</Badge>
                  <span className="text-white">{insights.avgTimeQuestions} questions</span>
                </div>
                <div className="text-yellow-500 font-bold">
                  {Math.round((insights.avgTimeQuestions / questions.length) * 100)}%
                </div>
              </div>

              {/* Slow Questions */}
              {insights.slowQuestions > 0 && (
                <div className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-red-600">🔔 Too Slow ({'>'}80s)</Badge>
                    <span className="text-white">{insights.slowQuestions} questions</span>
                  </div>
                  <div className="text-red-500 font-bold">
                    {Math.round((insights.slowQuestions / questions.length) * 100)}%
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Question-by-Question Review */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Target className="w-5 h-5" />
              Question Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {questions.map((question, index) => {
                const getQuestionStatus = (time) => {
                  if (time <= benchmarks.topper) return { icon: "🔥", color: "text-green-500", label: "Beast" };
                  if (time <= benchmarks.average) return { icon: "⚡", color: "text-yellow-500", label: "Good" };
                  if (time <= benchmarks.maximum) return { icon: "⏰", color: "text-orange-500", label: "Slow" };
                  return { icon: "🔔", color: "text-red-500", label: "Very Slow" };
                };

                const status = getQuestionStatus(question.timeSpent);

                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{status.icon}</span>
                      <span className="text-white">Q{question.questionNumber}</span>
                      <Badge variant="outline" className={status.color}>
                        {status.label}
                      </Badge>
                    </div>
                    <div className={`font-bold ${status.color}`}>
                      {question.timeSpent}s
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Improvement Suggestions */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Beast Improvement Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.slowQuestions > 0 && (
                <div className="p-3 bg-red-900/20 rounded-lg">
                  <h4 className="font-bold text-red-500 mb-2">🎯 Speed Focus Area</h4>
                  <p className="text-gray-300">
                    {insights.slowQuestions} questions took longer than 80 seconds. 
                    Consider reviewing formulas and practicing quick recognition patterns.
                  </p>
                </div>
              )}
              
              {insights.beastModePercentage < 50 && (
                <div className="p-3 bg-orange-900/20 rounded-lg">
                  <h4 className="font-bold text-orange-500 mb-2">⚡ Consistency Building</h4>
                  <p className="text-gray-300">
                    Aim to get 70%+ questions in Beast Mode (≤30s). Practice daily mental battles to build speed consistency.
                  </p>
                </div>
              )}

              {insights.beastModePercentage >= 70 && (
                <div className="p-3 bg-green-900/20 rounded-lg">
                  <h4 className="font-bold text-green-500 mb-2">🔥 Beast Level Achieved!</h4>
                  <p className="text-gray-300">
                    Excellent speed consistency! Consider increasing difficulty or trying mixed topic battles.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button 
            onClick={generateBeastArsenal}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4"
          >
            <Award className="w-4 h-4 mr-2" />
            Generate Beast Arsenal 📋
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate("/attack/mental")}
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 py-4"
          >
            Battle Again ⚔️
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BattleReflection;
