
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target, Clock, TrendingUp, Award, Zap } from 'lucide-react';

interface ReportCardProps {
  onNext: () => void;
  onNewBattle: () => void;
}

const ReportCard = ({ onNext, onNewBattle }: ReportCardProps) => {
  // Mock battle results
  const battleResults = {
    totalQuestions: 50,
    correct: 32,
    incorrect: 18,
    totalMarks: 64,
    maxMarks: 100,
    timeSpent: 45, // minutes
    accuracy: 64,
    rank: 'Warrior',
    subjects: {
      'Indian Polity': { correct: 8, incorrect: 2, accuracy: 80 },
      'Geography': { correct: 12, incorrect: 3, accuracy: 80 },
      'Economy': { correct: 7, incorrect: 8, accuracy: 47 },
      'History': { correct: 5, incorrect: 5, accuracy: 50 },
    }
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Legend': return 'text-yellow-400';
      case 'Warrior': return 'text-orange-400';
      case 'Fighter': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getPerformanceColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-400';
    if (accuracy >= 60) return 'text-yellow-400';
    if (accuracy >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-950 via-slate-900 to-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">Battle Complete!</h1>
          <p className="text-gray-300">Your war report is ready, warrior.</p>
        </div>

        {/* Overall Performance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-yellow-500/20">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-yellow-400 mb-1">{battleResults.rank}</div>
              <div className="text-sm text-gray-400">Battle Rank</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-green-500/20">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-green-400 mb-1">{battleResults.accuracy}%</div>
              <div className="text-sm text-gray-400">Accuracy</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-blue-500/20">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-blue-400 mb-1">{battleResults.totalMarks}/{battleResults.maxMarks}</div>
              <div className="text-sm text-gray-400">Total Marks</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-purple-400 mb-1">{battleResults.timeSpent}m</div>
              <div className="text-sm text-gray-400">Time Spent</div>
            </CardContent>
          </Card>
        </div>

        {/* Subject-wise Performance */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Subject-wise Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(battleResults.subjects).map(([subject, data]) => (
                <div key={subject} className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-white">{subject}</h3>
                    <span className={`font-bold ${getPerformanceColor(data.accuracy)}`}>
                      {data.accuracy}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span className="text-green-400">✓ {data.correct} Correct</span>
                    <span className="text-red-400">✗ {data.incorrect} Incorrect</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                      style={{ width: `${data.accuracy}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onNext}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold"
          >
            View Detailed Analysis
          </Button>
          <Button
            onClick={onNewBattle}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg font-semibold"
          >
            Start New Battle
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
