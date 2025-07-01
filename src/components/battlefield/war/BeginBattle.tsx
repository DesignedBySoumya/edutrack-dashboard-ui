
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Target, CheckCircle, XCircle } from 'lucide-react';

interface BeginBattleProps {
  onEnd: () => void;
}

const BeginBattle = ({ onEnd }: BeginBattleProps) => {
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalQuestions] = useState(50);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);

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
          onEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onEnd]);

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
      setTimeout(onEnd, 1000);
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 via-slate-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-red-500/20">
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-400">{formatTime(timeRemaining)}</div>
              <div className="text-sm text-gray-400">Time Left</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-blue-500/20">
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400">{currentQuestion}/{totalQuestions}</div>
              <div className="text-sm text-gray-400">Question</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-green-500/20">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">{score}</div>
              <div className="text-sm text-gray-400">Correct</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-red-500/20">
            <CardContent className="p-4 text-center">
              <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-400">{answered - score}</div>
              <div className="text-sm text-gray-400">Incorrect</div>
            </CardContent>
          </Card>
        </div>

        {/* Question Card */}
        <Card className="bg-slate-800/50 border-orange-500/20 mb-6">
          <CardContent className="p-8">
            <div className="mb-6">
              <span className="text-orange-400 text-sm font-medium">Question {currentQuestion}</span>
              <h2 className="text-xl font-semibold text-white mt-2">{mockQuestion.text}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="p-4 text-left bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 hover:border-orange-500/50 rounded-lg transition-all text-gray-200 hover:text-white"
                >
                  <span className="font-semibold text-orange-400 mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency End Button */}
        <div className="text-center">
          <Button
            onClick={onEnd}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
          >
            End Battle Early
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BeginBattle;
