
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BeginBattleProps {
  onEnd: () => void;
}

const BeginBattle = ({ onEnd }: BeginBattleProps) => {
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const totalQuestions = 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
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
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-950 via-slate-900 to-black p-4">
      <div className="max-w-4xl mx-auto">
        {/* Timer Header */}
        <div className="bg-slate-800 rounded-lg p-4 mb-6 flex justify-between items-center">
          <div className="text-white">
            <span className="text-2xl font-bold">{formatTime(timeLeft)}</span>
          </div>
          <div className="text-white">
            Question {currentQuestion} of {totalQuestions}
          </div>
          <Button onClick={onEnd} variant="destructive">
            End Test
          </Button>
        </div>

        {/* Question Card */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardContent className="p-6">
            <h3 className="text-white text-lg mb-4">
              Sample Question: What is the capital of India?
            </h3>
            <div className="space-y-3">
              {['New Delhi', 'Mumbai', 'Kolkata', 'Chennai'].map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start text-white border-slate-600"
                >
                  {String.fromCharCode(65 + index)}. {option}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline"
            disabled={currentQuestion === 1}
            onClick={() => setCurrentQuestion(prev => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          <Button 
            onClick={() => setCurrentQuestion(prev => Math.min(totalQuestions, prev + 1))}
            disabled={currentQuestion === totalQuestions}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BeginBattle;
