
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Printer, Clock, Target, TrendingUp } from "lucide-react";

const BeastArsenal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionData, reflections, insights } = location.state || {};

  const [isPrintView, setIsPrintView] = useState(false);

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

  const { questions = [], averageTime = 0, totalQuestions = 0, startTime, endTime } = sessionData;
  const sessionDuration = Math.round((endTime - startTime) / 1000 / 60); // in minutes

  const benchmarks = {
    topper: 30,
    average: 45,
    maximum: 80
  };

  const printArsenal = () => {
    setIsPrintView(true);
    setTimeout(() => {
      window.print();
      setIsPrintView(false);
    }, 100);
  };

  const exportData = () => {
    const arsenalData = {
      session: sessionData,
      insights,
      reflections,
      generatedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(arsenalData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `beast-arsenal-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getPerformanceLevel = () => {
    if (insights?.beastModePercentage >= 70) return { level: "BEAST MODE", color: "text-red-500", emoji: "🔥" };
    if (insights?.beastModePercentage >= 50) return { level: "WARRIOR", color: "text-orange-500", emoji: "⚡" };
    if (insights?.beastModePercentage >= 30) return { level: "FIGHTER", color: "text-yellow-500", emoji: "🎯" };
    return { level: "TRAINEE", color: "text-blue-500", emoji: "🛡️" };
  };

  const performance = getPerformanceLevel();

  return (
    <div className={`min-h-screen ${isPrintView ? 'bg-white text-black' : 'bg-gradient-to-br from-gray-900 via-gray-800 to-black'} p-6`}>
      <div className="max-w-4xl mx-auto">
        {/* Header - Hidden in print */}
        {!isPrintView && (
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/battlefield/attack/reflect", { state: { sessionData } })}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Reflection
            </Button>
            <h1 className="text-3xl font-bold text-white">📋 Beast Arsenal</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportData} className="border-gray-600 text-gray-300">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={printArsenal} className="border-gray-600 text-gray-300">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        )}

        {/* Print Header */}
        {isPrintView && (
          <div className="text-center mb-8 border-b-2 border-gray-300 pb-4">
            <h1 className="text-4xl font-bold mb-2">📋 BEAST ARSENAL</h1>
            <p className="text-lg">Mental Battle Summary & Revision Sheet</p>
            <p className="text-sm text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
          </div>
        )}

        {/* Performance Summary */}
        <Card className={`${isPrintView ? 'border-2 border-gray-300' : 'bg-gray-800 border-gray-700'} mb-6`}>
          <CardHeader>
            <CardTitle className={`text-2xl ${isPrintView ? 'text-black' : 'text-white'} text-center flex items-center justify-center gap-2`}>
              {performance.emoji} {performance.level}
              <Badge className={isPrintView ? 'bg-gray-200 text-black' : 'bg-red-600'}>
                {insights?.beastModePercentage || 0}% Beast Mode
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div>
                <div className={`text-xl font-bold ${isPrintView ? 'text-black' : 'text-white'}`}>{totalQuestions}</div>
                <div className={`text-sm ${isPrintView ? 'text-gray-600' : 'text-gray-400'}`}>Questions</div>
              </div>
              <div>
                <div className={`text-xl font-bold ${isPrintView ? 'text-black' : 'text-white'}`}>{sessionDuration}m</div>
                <div className={`text-sm ${isPrintView ? 'text-gray-600' : 'text-gray-400'}`}>Duration</div>
              </div>
              <div>
                <div className={`text-xl font-bold ${isPrintView ? 'text-black' : 'text-white'}`}>{Math.round(averageTime)}s</div>
                <div className={`text-sm ${isPrintView ? 'text-gray-600' : 'text-gray-400'}`}>Avg Time</div>
              </div>
              <div>
                <div className={`text-xl font-bold ${isPrintView ? 'text-green-700' : 'text-green-500'}`}>{insights?.fastQuestions || 0}</div>
                <div className={`text-sm ${isPrintView ? 'text-gray-600' : 'text-gray-400'}`}>Beast Mode</div>
              </div>
              <div>
                <div className={`text-xl font-bold ${isPrintView ? 'text-red-700' : 'text-red-500'}`}>{insights?.slowQuestions || 0}</div>
                <div className={`text-sm ${isPrintView ? 'text-gray-600' : 'text-gray-400'}`}>Too Slow</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card className={`${isPrintView ? 'border-2 border-gray-300' : 'bg-gray-800 border-gray-700'} mb-6`}>
          <CardHeader>
            <CardTitle className={`text-xl ${isPrintView ? 'text-black' : 'text-white'} flex items-center gap-2`}>
              <TrendingUp className="w-5 h-5" />
              Battle Insights & Action Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Timing Analysis */}
              <div className={`p-4 ${isPrintView ? 'border border-gray-300' : 'bg-gray-700'} rounded-lg`}>
                <h4 className={`font-bold ${isPrintView ? 'text-black' : 'text-white'} mb-2`}>⏱️ Timing Analysis</h4>
                <ul className={`space-y-1 ${isPrintView ? 'text-gray-700' : 'text-gray-300'}`}>
                  <li>• Beast Mode (≤30s): {insights?.fastQuestions || 0} questions ({insights?.beastModePercentage || 0}%)</li>
                  <li>• Good Pace (31-45s): {insights?.avgTimeQuestions || 0} questions</li>
                  <li>• Too Slow ({'>'}80s): {insights?.slowQuestions || 0} questions</li>
                  <li>• Average solving time: {Math.round(averageTime)}s vs Topper benchmark (30s)</li>
                </ul>
              </div>

              {/* Improvement Areas */}
              {(insights?.slowQuestions || 0) > 0 && (
                <div className={`p-4 ${isPrintView ? 'border border-red-300 bg-red-50' : 'bg-red-900/20'} rounded-lg`}>
                  <h4 className={`font-bold ${isPrintView ? 'text-red-700' : 'text-red-500'} mb-2`}>🎯 Focus Areas</h4>
                  <ul className={`space-y-1 ${isPrintView ? 'text-red-700' : 'text-red-300'}`}>
                    <li>• {insights.slowQuestions} questions took longer than 80 seconds</li>
                    <li>• Practice quick formula recall and pattern recognition</li>
                    <li>• Set daily mental battle sessions to build speed consistency</li>
                    <li>• Target: Get 70%+ questions in Beast Mode (≤30s)</li>
                  </ul>
                </div>
              )}

              {/* Strengths */}
              {(insights?.beastModePercentage || 0) >= 50 && (
                <div className={`p-4 ${isPrintView ? 'border border-green-300 bg-green-50' : 'bg-green-900/20'} rounded-lg`}>
                  <h4 className={`font-bold ${isPrintView ? 'text-green-700' : 'text-green-500'} mb-2`}>🔥 Strengths</h4>
                  <ul className={`space-y-1 ${isPrintView ? 'text-green-700' : 'text-green-300'}`}>
                    <li>• Strong speed consistency with {insights.beastModePercentage}% beast mode questions</li>
                    <li>• Good formula recall and problem recognition</li>
                    <li>• Ready for advanced mixed-topic battles</li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Question-by-Question Breakdown */}
        <Card className={`${isPrintView ? 'border-2 border-gray-300' : 'bg-gray-800 border-gray-700'} mb-6`}>
          <CardHeader>
            <CardTitle className={`text-xl ${isPrintView ? 'text-black' : 'text-white'} flex items-center gap-2`}>
              <Target className="w-5 h-5" />
              Detailed Question Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-2 ${isPrintView ? '' : 'max-h-96 overflow-y-auto'}`}>
              {questions.map((question, index) => {
                const getQuestionStatus = (time) => {
                  if (time <= benchmarks.topper) return { icon: "🔥", label: "Beast", color: isPrintView ? "text-green-700" : "text-green-500" };
                  if (time <= benchmarks.average) return { icon: "⚡", label: "Good", color: isPrintView ? "text-yellow-700" : "text-yellow-500" };
                  if (time <= benchmarks.maximum) return { icon: "⏰", label: "Slow", color: isPrintView ? "text-orange-700" : "text-orange-500" };
                  return { icon: "🔔", label: "Very Slow", color: isPrintView ? "text-red-700" : "text-red-500" };
                };

                const status = getQuestionStatus(question.timeSpent);

                return (
                  <div key={index} className={`flex items-center justify-between p-2 ${isPrintView ? 'border-b border-gray-200' : 'bg-gray-700'} rounded`}>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{status.icon}</span>
                      <span className={isPrintView ? 'text-black' : 'text-white'}>Q{question.questionNumber}</span>
                      <Badge variant="outline" className={`${status.color} ${isPrintView ? 'border-gray-400' : ''}`}>
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

        {/* Revision Checklist */}
        <Card className={`${isPrintView ? 'border-2 border-gray-300' : 'bg-gray-800 border-gray-700'} mb-6`}>
          <CardHeader>
            <CardTitle className={`text-xl ${isPrintView ? 'text-black' : 'text-white'} flex items-center gap-2`}>
              <Clock className="w-5 h-5" />
              Last-Minute Revision Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className={`p-3 ${isPrintView ? 'border border-gray-300' : 'bg-gray-700'} rounded-lg`}>
                <h4 className={`font-bold ${isPrintView ? 'text-black' : 'text-white'} mb-2`}>📝 Before Next Battle</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className={isPrintView ? 'text-gray-700' : 'text-gray-300'}>Review questions that took {'>'}80s</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className={isPrintView ? 'text-gray-700' : 'text-gray-300'}>Practice key formulas for quick recall</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className={isPrintView ? 'text-gray-700' : 'text-gray-300'}>Set timer goal: 70%+ questions in Beast Mode</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className={isPrintView ? 'text-gray-700' : 'text-gray-300'}>Schedule next mental battle session</span>
                  </label>
                </div>
              </div>

              <div className={`p-3 ${isPrintView ? 'border border-gray-300' : 'bg-gray-700'} rounded-lg`}>
                <h4 className={`font-bold ${isPrintView ? 'text-black' : 'text-white'} mb-2`}>🎯 Next Session Goals</h4>
                <ul className={`space-y-1 ${isPrintView ? 'text-gray-700' : 'text-gray-300'}`}>
                  <li>• Target: Improve beast mode percentage by 10%</li>
                  <li>• Reduce average solving time to under {Math.max(25, Math.round(averageTime) - 5)}s</li>
                  <li>• Complete 25-30 questions in next session</li>
                  <li>• Maintain focus for longer duration</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons - Hidden in print */}
        {!isPrintView && (
          <div className="flex gap-4">
            <Button 
              onClick={() => navigate("/battlefield/attack/mental")}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4"
            >
              🔥 Start New Battle
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/battlefield/attack")}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 py-4"
            >
              Back to Attack Hub
            </Button>
          </div>
        )}

        {/* Print Footer */}
        {isPrintView && (
          <div className="text-center mt-8 pt-4 border-t-2 border-gray-300">
            <p className="text-sm text-gray-600">
              Beast Arsenal generated by Attack Mode • Keep this sheet for quick revision
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeastArsenal;
