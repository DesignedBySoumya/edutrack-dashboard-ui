
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Target, CheckCircle, XCircle } from 'lucide-react';
import { useBattleStore } from '../../../stores/battleStore';
import { useCreateBattleSession } from '@/hooks/useBattleSessions';

interface BeginBattleProps {
  onEnd: () => void;
}

const BeginBattle = ({ onEnd }: BeginBattleProps) => {
  const { currentSession, setPhase } = useBattleStore();
  const createBattleSession = useCreateBattleSession();
  
  const [timeRemaining, setTimeRemaining] = useState((currentSession?.timeLimit || 60) * 60);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalQuestions] = useState(currentSession?.questionCount || 50);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [battleResults, setBattleResults] = useState<any>({});

  // Mock question data
  const mockQuestion = {
    id: 1,
    text: "Which article of the Indian Constitution deals with the Right to Education?",
    options: [
      "Article 21A",
      "Article 19", 
      "Article 14",
      "Article 32"
    ],
    correct: 0
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleBattleEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (optionIndex: number) => {
    const isCorrect = optionIndex === mockQuestion.correct;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setAnswered(prev => prev + 1);

    // Move to next question or end battle
    if (currentQuestion >= totalQuestions) {
      setTimeout(handleBattleEnd, 1000);
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleBattleEnd = async () => {
    const timeSpent = ((currentSession?.timeLimit || 60) * 60) - timeRemaining;
    const incorrect = answered - score;
    
    // Create mock subjects data
    const subjectsData = {
      'Indian Polity': { correct: Math.floor(score * 0.4), incorrect: Math.floor(incorrect * 0.3), marks: Math.floor(score * 0.4) * 2, maxMarks: 20 },
      'Geography': { correct: Math.floor(score * 0.3), incorrect: Math.floor(incorrect * 0.3), marks: Math.floor(score * 0.3) * 2, maxMarks: 20 },
      'Economy': { correct: Math.floor(score * 0.2), incorrect: Math.floor(incorrect * 0.2), marks: Math.floor(score * 0.2) * 2, maxMarks: 20 },
      'History': { correct: Math.floor(score * 0.1), incorrect: Math.floor(incorrect * 0.2), marks: Math.floor(score * 0.1) * 2, maxMarks: 20 },
    };

    const battleSessionData = {
      session_type: 'war' as const,
      start_time: currentSession?.startTime || new Date().toISOString(),
      end_time: new Date().toISOString(),
      total_questions: totalQuestions,
      correct_answers: score,
      incorrect_answers: incorrect,
      total_marks: score * 2,
      time_spent: timeSpent,
      subjects_data: subjectsData,
    };

    try {
      await createBattleSession.mutateAsync(battleSessionData);
      setBattleResults(battleSessionData);
      setPhase('completed');
      onEnd();
    } catch (error) {
      console.error('Failed to save battle session:', error);
      // Still proceed to end battle even if save fails
      setPhase('completed');
      onEnd();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-950 via-slate-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-orange-500/20">
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-orange-400">{formatTime(timeRemaining)}</div>
              <div className="text-sm text-gray-400">Time Left</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-orange-500/20">
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-blue-400">{currentQuestion}/{totalQuestions}</div>
              <div className="text-sm text-gray-400">Question</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-orange-500/20">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-green-400">{score}</div>
              <div className="text-sm text-gray-400">Correct</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-orange-500/20">
            <CardContent className="p-4 text-center">
              <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-red-400">{answered - score}</div>
              <div className="text-sm text-gray-400">Incorrect</div>
            </CardContent>
          </Card>
        </div>

        {/* Question Card */}
        <Card className="bg-slate-800/50 border-orange-500/20 mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-orange-400 mb-4">Question {currentQuestion}</h2>
            <p className="text-lg text-gray-200 mb-6">{mockQuestion.text}</p>
            
            <div className="space-y-3">
              {mockQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full p-4 text-left bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 hover:border-orange-500/50 rounded-lg transition-all text-gray-200 hover:text-white"
                >
                  <span className="font-semibold text-orange-400 mr-3">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency End Button */}
        <div className="text-center">
          <Button
            onClick={handleBattleEnd}
            variant="outline"
            className="border-red-500 text-red-400 hover:bg-red-500/20"
          >
            End Battle Early
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BeginBattle;
