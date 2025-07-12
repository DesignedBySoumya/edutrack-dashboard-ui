
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
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

interface SessionData {
  id: string;
  total_questions: number;
  average_time: number;
  start_time: string;
  end_time: string;
}

interface QuestionData {
  time_spent: number;
}

const AttackWelcome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const fetchSessions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('mental_battle_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (sessionsError) {
        console.error('Error fetching sessions:', sessionsError);
        return;
      }

      setSessions(sessionsData || []);

      // Fetch all questions for stats
      const { data: questionsData, error: questionsError } = await supabase
        .from('mental_battle_questions')
        .select('time_spent')
        .in('session_id', sessionsData?.map(s => s.id) || []);

      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
        return;
      }

      setQuestions(questionsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQuickStats = () => {
    if (!sessions.length) return null;
    
    const totalQuestions = questions.length;
    const fastQuestions = questions.filter(q => q.time_spent <= 30).length;
    const beastModePercentage = totalQuestions > 0 ? Math.round((fastQuestions / totalQuestions) * 100) : 0;
    
    // Calculate current streak
    const sessionDates = sessions.map(s => new Date(s.start_time).toDateString());
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
      route: "mental",
      icon: Brain,
      color: "from-purple-600 to-blue-600",
      features: ["Topper benchmarks", "Live timing", "Zero friction"]
    },
    {
      title: "⚔️ Full Battle",
      subtitle: "Complete MCQ Experience", 
      description: "Questions + confidence tracking + detailed reflection.",
      route: "plan",
      icon: Sword,
      color: "from-red-600 to-orange-600",
      features: ["Confidence tracking", "Explanations", "Beast arsenal"]
    }
  ];

  const analyticsCards = [
    {
      title: "📊 Analytics",
      description: "AI-powered insights and performance tracking",
      route: "analytics",
      icon: BarChart3,
      color: "bg-blue-900/50"
    },
    {
      title: "🔥 Streaks",
      description: "Daily consistency and streak tracking",
      route: "streaks", 
      icon: Calendar,
      color: "bg-green-900/50"
    }
  ];

  // Redirect if not authenticated
  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/battlefield")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">⚔️ ATTACK MODE</h1>
            <p className="text-gray-400">Transform your study sessions into battles</p>
          </div>
          <div className="w-[120px]"></div>
        </div>

        {/* Quick Stats */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="animate-pulse">
                    <div className="w-6 h-6 bg-gray-600 rounded mx-auto mb-2"></div>
                    <div className="w-8 h-8 bg-gray-600 rounded mx-auto mb-2"></div>
                    <div className="w-16 h-4 bg-gray-600 rounded mx-auto"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stats ? (
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
        ) : (
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardContent className="p-6 text-center">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <h3 className="text-lg font-semibold text-white mb-2">Ready for Your First Battle?</h3>
              <p className="text-gray-400">Start your first mental timer session to see your stats here!</p>
            </CardContent>
          </Card>
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
