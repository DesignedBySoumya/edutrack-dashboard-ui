import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp, 
  RotateCcw, 
  Share, 
  Download, 
  Eye,
  Star,
  Zap,
  Brain,
  BookOpen
} from 'lucide-react';

// Types for the data structure
interface Chapter {
  name: string;
  correct: number;
  incorrect: number;
  timeSpent: number;
  marks: number;
  whatWentWrong: string;
  learnings: string;
}

interface Subject {
  name: string;
  icon: string;
  color: string;
  chapters: Chapter[];
}

interface SubjectData {
  [key: string]: Subject;
}

interface StudentInfo {
  name: string;
  mockNo: string;
  rank: number;
  totalMarks: number;
  maxMarks: number;
  percentile: number;
}

const BattleAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data from navigation state or use default data
  const reportData = location.state?.reportData as SubjectData || {};
  const studentInfo = location.state?.studentInfo as StudentInfo || {
    name: "Student",
    mockNo: "PTS-2024-00",
    rank: 0,
    totalMarks: 0,
    maxMarks: 200,
    percentile: 0
  };

  // Calculate overall statistics
  const calculateOverallStats = () => {
    let totalQuestions = 0;
    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalTime = 0;
    let totalMarks = 0;

    Object.values(reportData).forEach((subject) => {
      subject.chapters.forEach((chapter) => {
        totalQuestions += chapter.correct + chapter.incorrect;
        totalCorrect += chapter.correct;
        totalIncorrect += chapter.incorrect;
        totalTime += chapter.timeSpent;
        totalMarks += chapter.marks;
      });
    });

    const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
    
    return {
      totalQuestions,
      totalCorrect,
      totalIncorrect,
      totalTime,
      totalMarks,
      accuracy
    };
  };

  const overallStats = calculateOverallStats();

  // Calculate subject-wise statistics
  const calculateSubjectStats = (chapters: Chapter[]) => {
    const totalQuestions = chapters.reduce((sum, ch) => sum + ch.correct + ch.incorrect, 0);
    const attempted = chapters.filter(ch => ch.correct + ch.incorrect > 0).length;
    const totalCorrect = chapters.reduce((sum, ch) => sum + ch.correct, 0);
    const totalIncorrect = chapters.reduce((sum, ch) => sum + ch.incorrect, 0);
    const totalTime = chapters.reduce((sum, ch) => sum + ch.timeSpent, 0);
    const totalMarks = chapters.reduce((sum, ch) => sum + ch.marks, 0);
    
    return {
      totalQuestions,
      attempted,
      correct: totalCorrect,
      incorrect: totalIncorrect,
      timeSpent: totalTime,
      totalMarks,
      accuracy: totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0,
      status: totalQuestions > 0 ? (
        (totalCorrect / totalQuestions) * 100 >= 80 ? 'Excellent' :
        (totalCorrect / totalQuestions) * 100 >= 60 ? 'Good' : 'Needs Work'
      ) : 'Not Attempted'
    };
  };

  // Get performance status for a chapter
  const getChapterStatus = (correct: number, incorrect: number) => {
    const total = correct + incorrect;
    if (total === 0) return { text: 'Not Attempted', color: 'bg-gray-100 text-gray-800' };
    const percentage = (correct / total) * 100;
    if (percentage >= 80) return { text: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (percentage >= 60) return { text: 'Good', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Needs Work', color: 'bg-red-100 text-red-800' };
  };

  // Generate AI insights
  const generateInsights = () => {
    const subjectStats = Object.entries(reportData).map(([key, subject]) => ({
      key,
      ...subject,
      stats: calculateSubjectStats(subject.chapters)
    }));

    const weakSubjects = subjectStats.filter(s => s.stats.accuracy < 60);
    const strongSubjects = subjectStats.filter(s => s.stats.accuracy >= 80);
    
    let insights = [];
    
    if (weakSubjects.length > 0) {
      insights.push(`Focus on ${weakSubjects.map(s => s.name).join(', ')} - these need immediate attention.`);
    }
    
    if (strongSubjects.length > 0) {
      insights.push(`Great performance in ${strongSubjects.map(s => s.name).join(', ')} - maintain this momentum!`);
    }
    
    if (overallStats.accuracy >= 75) {
      insights.push("Excellent overall performance! You're on track for a great rank.");
    } else if (overallStats.accuracy >= 50) {
      insights.push("Good foundation, but there's room for improvement in accuracy.");
    } else {
      insights.push("Focus on understanding concepts better and practice more questions.");
    }

    return insights;
  };

  const insights = generateInsights();

  // Color mapping for subjects
  const colorMap = {
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
    green: 'bg-green-50 border-green-200',
    orange: 'bg-orange-50 border-orange-200'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Victory Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🎉</div>
            <h1 className="text-4xl font-bold mb-2">Battle Completed!</h1>
            <p className="text-purple-200">Your performance analysis is ready</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="bg-white/10 rounded-lg p-4">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-300" />
              <div className="text-sm text-purple-200">Rank</div>
              <div className="text-xl font-bold">#{studentInfo.rank}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <Target className="w-6 h-6 mx-auto mb-2 text-green-300" />
              <div className="text-sm text-purple-200">Score</div>
              <div className="text-xl font-bold">{studentInfo.totalMarks}/{studentInfo.maxMarks}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue-300" />
              <div className="text-sm text-purple-200">Percentile</div>
              <div className="text-xl font-bold">{studentInfo.percentile}%</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-300" />
              <div className="text-sm text-purple-200">Accuracy</div>
              <div className="text-xl font-bold">{Math.round(overallStats.accuracy)}%</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <Clock className="w-6 h-6 mx-auto mb-2 text-orange-300" />
              <div className="text-sm text-purple-200">Time</div>
              <div className="text-xl font-bold">{overallStats.totalTime}min</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Subject Battle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Object.entries(reportData).map(([subjectKey, subject]) => {
            const stats = calculateSubjectStats(subject.chapters);
            const statusColor = stats.status === 'Excellent' ? 'text-green-600' :
                              stats.status === 'Good' ? 'text-yellow-600' : 'text-red-600';

            return (
              <Card key={subjectKey} className={`${colorMap[subject.color as keyof typeof colorMap] || 'bg-gray-50'} shadow-lg`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{subject.icon}</span>
                      <div>
                        <CardTitle className="text-xl">{subject.name}</CardTitle>
                        <div className={`text-sm font-medium ${statusColor}`}>{stats.status}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{Math.round(stats.accuracy)}%</div>
                      <div className="text-sm text-gray-600">Accuracy</div>
                    </div>
                  </div>
                  <Progress value={stats.accuracy} className="h-3" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{stats.correct}</div>
                      <div className="text-xs text-gray-600">Correct</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">{stats.incorrect}</div>
                      <div className="text-xs text-gray-600">Incorrect</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{stats.timeSpent}min</div>
                      <div className="text-xs text-gray-600">Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{stats.totalMarks}</div>
                      <div className="text-xs text-gray-600">Marks</div>
                    </div>
                  </div>
                  
                  {/* Chapter Chips */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Chapter Performance:</div>
                    <div className="flex flex-wrap gap-2">
                      {subject.chapters.slice(0, 6).map((chapter, idx) => {
                        const status = getChapterStatus(chapter.correct, chapter.incorrect);
                        const accuracy = chapter.correct + chapter.incorrect > 0 ? 
                          Math.round((chapter.correct / (chapter.correct + chapter.incorrect)) * 100) : 0;
                        
                        return (
                          <Badge
                            key={idx}
                            className={`${status.color} text-xs cursor-pointer`}
                            title={`${chapter.name}: ${accuracy}% accuracy`}
                          >
                            {chapter.name} ({accuracy}%)
                          </Badge>
                        );
                      })}
                      {subject.chapters.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{subject.chapters.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* AI Insights Panel */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-600" />
              <CardTitle className="text-xl text-blue-800">Smart Insights</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <p className="text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <BookOpen className="w-4 h-4 mr-2" />
                Revise Weak Chapters
              </Button>
              <Button variant="outline" className="border-blue-600 text-blue-600">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retry Mistakes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Battle Map */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6" />
              Battle Map Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(reportData).map(([subjectKey, subject]) => (
                <div key={subjectKey} className="space-y-2">
                  <div className="font-medium text-gray-800 flex items-center gap-2">
                    <span>{subject.icon}</span>
                    {subject.name}
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {subject.chapters.slice(0, 8).map((chapter, idx) => {
                      const status = getChapterStatus(chapter.correct, chapter.incorrect);
                      const bgColor = status.text === 'Excellent' ? 'bg-green-300' :
                                    status.text === 'Good' ? 'bg-yellow-300' :
                                    status.text === 'Needs Work' ? 'bg-red-300' : 'bg-gray-200';
                      
                      return (
                        <div
                          key={idx}
                          className={`h-8 ${bgColor} rounded text-xs flex items-center justify-center font-medium text-gray-800 cursor-pointer hover:scale-105 transition-transform`}
                          title={chapter.name}
                        >
                          {chapter.name.slice(0, 8)}...
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA Footer */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-purple-200 shadow-lg p-4 rounded-t-xl">
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={() => navigate('/battlefield/war/report/pts')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Full Report
            </Button>
            <Button variant="outline" className="border-purple-600 text-purple-600"
            onClick={() => navigate('/battlefield/war/report/weak-chapters')}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry Weak Areas
            </Button>
            <Button variant="outline" className="border-purple-600 text-purple-600">
              <Share className="w-4 h-4 mr-2" />
              Share Report
            </Button>
            <Button variant="outline" className="border-purple-600 text-purple-600">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleAnalysis;