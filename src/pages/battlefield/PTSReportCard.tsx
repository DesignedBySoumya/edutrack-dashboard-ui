import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trophy, Target, Clock, TrendingUp } from 'lucide-react';

const PTSReportCard = () => {
  const navigate = useNavigate();

  // Mock data with proper number types
  const reportData = {
    overall: {
      correct: 32,
      incorrect: 18,
      marks: 64,
      maxMarks: 100
    },
    subjects: [
      {
        name: "Indian Polity",
        correct: 8,
        incorrect: 2,
        marks: 16,
        maxMarks: 20
      },
      {
        name: "Geography",
        correct: 6,
        incorrect: 4,
        marks: 12,
        maxMarks: 20
      },
      {
        name: "Economy",
        correct: 10,
        incorrect: 0,
        marks: 20,
        maxMarks: 20
      },
      {
        name: "History",
        correct: 8,
        incorrect: 2,
        marks: 16,
        maxMarks: 20
      }
    ]
  };

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
                <div className="text-2xl font-bold text-green-400">{reportData.overall.correct}</div>
                <div className="text-sm text-gray-400">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{reportData.overall.incorrect}</div>
                <div className="text-sm text-gray-400">Incorrect</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{reportData.overall.marks}/{reportData.overall.maxMarks}</div>
                <div className="text-sm text-gray-400">Total Marks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{Math.round((reportData.overall.marks / reportData.overall.maxMarks) * 100)}%</div>
                <div className="text-sm text-gray-400">Percentage</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject-wise Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportData.subjects.map((subject, index) => (
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
                    <span className="text-purple-400 font-bold">{Math.round((subject.correct / (subject.correct + subject.incorrect)) * 100)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
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
