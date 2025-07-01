
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trophy, Target, Clock, TrendingUp } from 'lucide-react';
import { useBattleSessions } from '@/hooks/useBattleSessions';

const PTSReportCard = () => {
  const navigate = useNavigate();
  const { data: battleSessions, isLoading } = useBattleSessions();

  // Get the most recent battle session
  const latestBattle = battleSessions?.[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-950 via-slate-900 to-black p-6 flex items-center justify-center">
        <div className="text-orange-400 text-xl">Loading battle report...</div>
      </div>
    );
  }

  if (!latestBattle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-950 via-slate-900 to-black p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button
              onClick={() => navigate('/battlefield/war/report')}
              variant="ghost"
              className="text-orange-400 hover:text-orange-300 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Reports
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-orange-400 mb-2">📊 No Battle Reports</h1>
            <p className="text-gray-300 mb-8">Complete a battle to see your performance report.</p>
            <Button
              onClick={() => navigate('/battlefield/war/config')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
            >
              Start Your First Battle
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Process subjects data from the latest battle
  const subjectsData = latestBattle.subjects_data || {};
  const subjects = Object.entries(subjectsData).map(([name, data]: [string, any]) => ({
    name,
    correct: data.correct || 0,
    incorrect: data.incorrect || 0,
    marks: data.marks || 0,
    maxMarks: data.maxMarks || 0
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-950 via-slate-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            onClick={() => navigate('/battlefield/war/report')}
            variant="ghost"
            className="text-orange-400 hover:text-orange-300 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Reports
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-400 mb-2">📊 PTS Report Card</h1>
          <p className="text-gray-300">Detailed Performance Analysis</p>
          <p className="text-sm text-gray-400 mt-2">
            Battle completed on {new Date(latestBattle.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Overall Performance */}
        <Card className="bg-slate-800/50 border-orange-500/20 mb-6">
          <CardHeader>
            <CardTitle className="text-orange-400 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Overall Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{latestBattle.correct_answers}</div>
                <div className="text-sm text-gray-400">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{latestBattle.incorrect_answers}</div>
                <div className="text-sm text-gray-400">Incorrect</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{latestBattle.total_marks}/100</div>
                <div className="text-sm text-gray-400">Total Marks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {latestBattle.total_questions > 0 ? Math.round((latestBattle.correct_answers / latestBattle.total_questions) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-400">Accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject-wise Performance */}
        {subjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {subjects.map((subject, index) => (
              <Card key={index} className="bg-slate-800/50 border-orange-500/20">
                <CardHeader>
                  <CardTitle className="text-orange-400">{subject.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Correct:</span>
                      <span className="text-green-400 font-bold">{subject.correct}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Incorrect:</span>
                      <span className="text-red-400 font-bold">{subject.incorrect}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Marks:</span>
                      <span className="text-blue-400 font-bold">{subject.marks}/{subject.maxMarks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Accuracy:</span>
                      <span className="text-purple-400 font-bold">
                        {subject.correct + subject.incorrect > 0 ? Math.round((subject.correct / (subject.correct + subject.incorrect)) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center">
          <Button
            onClick={() => navigate('/battlefield/war/config')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
          >
            Start New Battle
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PTSReportCard;
