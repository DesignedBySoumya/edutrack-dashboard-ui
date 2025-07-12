import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, Clock } from "lucide-react";

interface TimingBenchmarks {
  topper: number;
  average: number;
  maximum: number;
}

interface QuestionData {
  questionNumber: number;
  timeSpent: number;
  timestamp: Date;
}

const MentalTimer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(20);
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentSessionQuestions, setCurrentSessionQuestions] = useState<QuestionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timerStart, setTimerStart] = useState<number | null>(null);

  const benchmarks: TimingBenchmarks = {
    topper: 30,    // 30 seconds for toppers
    average: 45,   // 45 seconds average
    maximum: 80    // 80 seconds maximum
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        if (isActive && !isLoading) {
          solveQuestion();
        } else if (!isActive && !isLoading) {
          startTimer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isActive, isLoading]);

  const createSession = async () => {
    if (!user) {
      console.error("No user authenticated");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('mental_battle_sessions')
        .insert([
          {
            user_id: user.id,
            source: 'Manual',
            start_time: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating session:", error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error("Error creating session:", error);
      return null;
    }
  };

  const saveQuestion = async (questionData: QuestionData) => {
    if (!sessionId) {
      console.error("No session ID available");
      return false;
    }

    try {
      const { error } = await supabase
        .from('mental_battle_questions')
        .insert([
          {
            session_id: sessionId,
            question_number: questionData.questionNumber,
            time_spent: questionData.timeSpent,
            timestamp: questionData.timestamp.toISOString()
          }
        ]);

      if (error) {
        console.error("Error saving question:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error saving question:", error);
      return false;
    }
  };

  const updateSessionEnd = async () => {
    if (!sessionId) {
      console.error("No session ID available");
      return false;
    }

    const averageTime = currentSessionQuestions.length > 0 
      ? currentSessionQuestions.reduce((acc, q) => acc + q.timeSpent, 0) / currentSessionQuestions.length 
      : 0;

    try {
      const { error } = await supabase
        .from('mental_battle_sessions')
        .update({
          end_time: new Date().toISOString(),
          total_questions: currentQuestion,
          average_time: averageTime
        })
        .eq('id', sessionId);

      if (error) {
        console.error("Error updating session:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error updating session:", error);
      return false;
    }
  };

  const startTimer = async () => {
    setIsLoading(true);
    
    // Create session if this is the first question
    if (currentQuestion === 1) {
      const newSessionId = await createSession();
      if (newSessionId) {
        setSessionId(newSessionId);
      } else {
        setIsLoading(false);
        return;
      }
    }
    
    setIsActive(true);
    setTime(0);
    setTimerStart(Date.now());
    setIsLoading(false);
  };

  const solveQuestion = async () => {
    // Capture the current time before stopping the timer
    const timeSpent = Math.round((Date.now() - (timerStart || 0)) / 1000); // ensure integer
    console.log('Saving question:', { questionNumber: currentQuestion, timeSpent });
    setIsActive(false);
    setIsLoading(true);
    
    // Record the question timing
    const questionData: QuestionData = {
      questionNumber: currentQuestion,
      timeSpent: timeSpent,
      timestamp: new Date()
    };
    
    // Save to database
    const saved = await saveQuestion(questionData);
    if (saved) {
      setCurrentSessionQuestions(prev => [...prev, questionData]);
    }
    
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(prev => prev + 1);
      setTime(0);
      setTimerStart(Date.now());
    } else {
      // Session complete
      await completeBattle();
    }
    
    setIsLoading(false);
  };

  const completeBattle = async () => {
    setIsLoading(true);
    
    // Update session with end time and stats
    await updateSessionEnd();
    
    // Prepare session data for reflection page
    const sessionData = {
      id: sessionId,
      totalQuestions: currentQuestion,
      averageTime: currentSessionQuestions.length > 0 
        ? currentSessionQuestions.reduce((acc, q) => acc + q.timeSpent, 0) / currentSessionQuestions.length 
        : 0,
      questions: currentSessionQuestions,
      startTime: new Date(),
      endTime: new Date()
    };
    
    navigate("/battlefield/attack/reflect", { state: { sessionData } });
    setIsLoading(false);
  };

  const skipQuestion = async () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(prev => prev + 1);
      setTime(0);
      setIsActive(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimingStatus = () => {
    if (time <= benchmarks.topper) return { color: "text-green-500", label: "🔥 Beast Mode" };
    if (time <= benchmarks.average) return { color: "text-yellow-500", label: "⚡ Good Pace" };
    if (time <= benchmarks.maximum) return { color: "text-orange-500", label: "⏰ Getting Slow" };
    return { color: "text-red-500", label: "🔔 Time's Up!" };
  };

  const timingStatus = getTimingStatus();

  // Redirect if not authenticated
  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/battlefield/attack")}
            className="text-gray-400 hover:text-white"
            disabled={isLoading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Attack
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">🧠 Mental Timer Battle</h1>
            <p className="text-gray-400">Question {currentQuestion} of {totalQuestions}</p>
          </div>
          <div className="text-right">
            <div className="text-white font-bold">Session Progress</div>
            <div className="text-gray-400">{Math.round((currentQuestion / totalQuestions) * 100)}%</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 mb-8">
          <div 
            className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Main Timer Card */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-white mb-4">Mental Battle Zone</CardTitle>
            
            {/* Timing Benchmarks Bar */}
            <div className="relative w-full h-6 bg-gray-700 rounded-full mb-4">
              <div className="absolute left-0 top-0 h-full bg-green-500 rounded-l-full" style={{ width: `${(benchmarks.topper / benchmarks.maximum) * 100}%` }} />
              <div className="absolute top-0 h-full bg-yellow-500" style={{ 
                left: `${(benchmarks.topper / benchmarks.maximum) * 100}%`,
                width: `${((benchmarks.average - benchmarks.topper) / benchmarks.maximum) * 100}%`
              }} />
              <div className="absolute top-0 h-full bg-orange-500" style={{ 
                left: `${(benchmarks.average / benchmarks.maximum) * 100}%`,
                width: `${((benchmarks.maximum - benchmarks.average) / benchmarks.maximum) * 100}%`
              }} />
              
              {/* Current time indicator */}
              <div 
                className="absolute top-0 w-1 h-full bg-white shadow-lg transition-all duration-1000"
                style={{ left: `${Math.min((time / benchmarks.maximum) * 100, 100)}%` }}
              />
            </div>

            {/* Benchmark Labels */}
            <div className="flex justify-between text-xs text-gray-400 mb-6">
              <span>🔺 Topper: {benchmarks.topper}s</span>
              <span>🔹 Average: {benchmarks.average}s</span>
              <span>🔔 Max: {benchmarks.maximum}s</span>
            </div>
          </CardHeader>

          <CardContent className="text-center">
            {/* Main Timer Display */}
            <div className="mb-8">
              <div className={`text-6xl font-bold mb-2 ${timingStatus.color}`}>
                {formatTime(time)}
              </div>
              <div className={`text-xl ${timingStatus.color}`}>
                {timingStatus.label}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {!isActive ? (
                <Button 
                  onClick={startTimer}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-xl"
                  disabled={isLoading}
                >
                  {isLoading ? "🔄 Creating Session..." : `🎯 Start Solving Question ${currentQuestion}`}
                </Button>
              ) : (
                <Button 
                  onClick={solveQuestion}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-2xl"
                  disabled={isLoading}
                >
                  {isLoading ? "🔄 Saving..." : "✅ SOLVED IT! (Press SPACE)"}
                </Button>
              )}

              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={skipQuestion}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                  disabled={isLoading}
                >
                  Skip ⏭
                </Button>
                <Button 
                  variant="outline" 
                  onClick={completeBattle}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                  disabled={isLoading}
                >
                  End Battle 🔔
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Stats */}
        {currentSessionQuestions.length > 0 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Live Session Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">
                    {Math.round(currentSessionQuestions.reduce((acc, q) => acc + q.timeSpent, 0) / currentSessionQuestions.length) || 0}s
                  </div>
                  <div className="text-sm text-gray-400">Avg Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-500">
                    {currentSessionQuestions.filter(q => q.timeSpent <= benchmarks.topper).length}
                  </div>
                  <div className="text-sm text-gray-400">Beast Mode</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500">
                    {currentSessionQuestions.filter(q => q.timeSpent > benchmarks.maximum).length}
                  </div>
                  <div className="text-sm text-gray-400">Too Slow</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MentalTimer;
