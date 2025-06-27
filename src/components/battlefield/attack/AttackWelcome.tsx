
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { 
  ArrowLeft, 
  Sword, 
  Brain, 
  Timer, 
  BarChart3, 
  Calendar,
  Trophy,
  Target,
  Clock
} from "lucide-react";

const AttackWelcome = () => {
  const navigate = useNavigate();
  const [sessions] = useLocalStorage("mentalSessions", []);

  const getQuickStats = () => {
    if (!sessions.length) return null;
    
    const totalQuestions = sessions.reduce((acc, s) => acc + (s.questions?.length || 0), 0);
    const allQuestions = sessions.flatMap(s => s.questions || []);
    const fastQuestions = allQuestions.filter(q => q.timeSpent <= 30).length;
    const beastModePercentage = Math.round((fastQuestions / totalQuestions) * 100);
    
    // Calculate current streak
    const sessionDates = sessions.map(s => new Date(s.startTime).toDateString());
    const uniqueDates = [...new Set(sessionDates)];
    let currentStreak = 0;
    const today = new Date();
    let checkDate = new Date(today);
    
    while (uniqueDates.includes(checkDate.toDateString())) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    return {
      totalSessions: sessions.length,
      totalQuestions,
      beastModePercentage,
      currentStreak
    };
  };

  const stats = getQuickStats();

  const battleModes = [
    {
      title: "🧠 Mental Timer",
      subtitle: "God Mode Speed Training",
      description: "Practice with any source - books, videos, notes. Pure speed focus.",
      route: "/attack/mental",
      icon: Brain,
      color: "from-purple-600 to-blue-600",
      features: ["Topper benchmarks", "Live timing", "Zero friction"]
    },
    {
      title: "⚔️ Full Battle",
      subtitle: "Complete MCQ Experience", 
      description: "Questions + confidence tracking + detailed reflection.",
      route: "/attack/plan",
      icon: Sword,
      color: "from-red-600 to-orange-600",
      features: ["Confidence tracking", "Explanations", "Beast arsenal"]
    }
  ];

  const analyticsCards = [
    {
      title: "📊 Analytics",
      description: "AI-powered insights and performance tracking",
      route: "/attack/analytics",
      icon: BarChart3,
      color: "bg-blue-900/50"
    },
    {
      title: "🔥 Streaks",
      description: "Daily consistency and streak tracking",
      route: "/attack/streaks", 
      icon: Calendar,
      color: "bg-green-900/50"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">⚔️ ATTACK MODE</h1>
            <p className="text-gray-400">Transform your study sessions into battles</p>
          </div>
          <div></div>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 text-center">
                <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                <div className="text-xl font-bold text-white">{stats.totalSessions}</div>
                <div className="text-xs text-gray-400">Battles</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 text-center">
                <Target className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <div className="text-xl font-bold text-white">{stats.totalQuestions}</div>
                <div className="text-xs text-gray-400">Questions</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <div className="text-xl font-bold text-white">{stats.beastModePercentage}%</div>
                <div className="text-xs text-gray-400">Beast Mode</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 text-center">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                <div className="text-xl font-bold text-white">{stats.currentStreak}</div>
                <div className="text-xs text-gray-400">Day Streak</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Battle Modes */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {battleModes.map((mode, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all group cursor-pointer" onClick={() => navigate(mode.route)}>
              <CardHeader className="pb-4">
                <div className={`mx-auto mb-4 p-4 bg-gradient-to-r ${mode.color} rounded-full w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <mode.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white text-center mb-2">{mode.title}</CardTitle>
                <p className="text-center text-gray-400 font-semibold">{mode.subtitle}</p>
                <p className="text-center text-gray-300 text-sm">{mode.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  {mode.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-gray-200">
                      <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button className={`w-full bg-gradient-to-r ${mode.color} hover:opacity-90 text-white py-3 font-bold group-hover:bg-opacity-90 transition-all`}>
                  Start Battle 🎯
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {analyticsCards.map((card, index) => (
            <Card key={index} className={`${card.color} border-gray-700 hover:border-gray-600 transition-all cursor-pointer group`} onClick={() => navigate(card.route)}>
              <CardContent className="p-6 text-center">
                <card.icon className="w-12 h-12 mx-auto mb-4 text-white group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{card.description}</p>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  View Details →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Getting Started */}
        {!stats && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white text-center">🎯 Ready for Battle?</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-300">
                Choose your battle mode and start building your MCQ mastery. 
                Track your progress, build streaks, and become a beast!
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => navigate("/attack/mental")}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Quick Start - Mental Timer
                </Button>
                <Button 
                  onClick={() => navigate("/attack/plan")}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Full Battle Mode
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pro Tips */}
        <Card className="bg-gray-800 border-gray-700 mt-8">
          <CardHeader>
            <CardTitle className="text-lg text-white">💡 Beast Mode Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold text-white">🧠 Mental Timer</h4>
                <p className="text-gray-400">Perfect for books, YouTube videos, or any external source. Just start the timer and solve!</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-white">📊 Track Everything</h4>
                <p className="text-gray-400">Your speed, confidence, and patterns are analyzed to create personalized insights.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-white">🔥 Build Streaks</h4>
                <p className="text-gray-400">Consistency beats intensity. Daily practice builds lasting mastery.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttackWelcome;
