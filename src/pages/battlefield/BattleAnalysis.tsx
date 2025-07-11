import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp, 
  RotateCcw, 
  Share2, 
  Download, 
  Eye,
  Star,
  Zap,
  Brain,
  BookOpen,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

// Types for the data structure
interface Chapter {
  name: string;
  correct: string | number;
  incorrect: string | number;
  timeSpent: string | number;
  marks: string | number;
  whatWentWrong: string;
  learnings: string;
}

interface Subject {
  name: string;
  icon: string;
  color: string;
  maxMarks: number;
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

// Enhanced Progress Bar Component
const EnhancedProgressBar = ({ value, className = "", size = "neutral" }: { 
  value: number; 
  className?: string; 
  size?: "subject" | "chapter" | "neutral";
}) => {
  const getProgressColor = (val: number) => {
    if (val >= 80) return 'progress-excellent';
    if (val >= 60) return 'progress-good';
    return 'progress-needs-work';
  };

  const getHeight = () => {
    switch (size) {
      case "subject": return "h-3";
      case "chapter": return "h-2";
      default: return "h-2";
    }
  };

  return (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${getHeight()} ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressColor(value)}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};

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

  // Helper function to safely convert string/number to number
  const safeNumber = (value: string | number): number => {
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return value || 0;
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
        const correct = safeNumber(chapter.correct);
        const incorrect = safeNumber(chapter.incorrect);
        const timeSpent = safeNumber(chapter.timeSpent);
        const marks = safeNumber(chapter.marks);
        
        totalQuestions += correct + incorrect;
        totalCorrect += correct;
        totalIncorrect += incorrect;
        totalTime += timeSpent;
        totalMarks += marks;
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
    const totalQuestions = chapters.reduce((sum, ch) => {
      const correct = safeNumber(ch.correct);
      const incorrect = safeNumber(ch.incorrect);
      return sum + correct + incorrect;
    }, 0);
    
    const attempted = chapters.filter(ch => {
      const correct = safeNumber(ch.correct);
      const incorrect = safeNumber(ch.incorrect);
      return correct + incorrect > 0;
    }).length;
    
    const totalCorrect = chapters.reduce((sum, ch) => sum + safeNumber(ch.correct), 0);
    const totalIncorrect = chapters.reduce((sum, ch) => sum + safeNumber(ch.incorrect), 0);
    const totalTime = chapters.reduce((sum, ch) => sum + safeNumber(ch.timeSpent), 0);
    const totalMarks = chapters.reduce((sum, ch) => sum + safeNumber(ch.marks), 0);
    
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
  const getChapterStatus = (correct: string | number, incorrect: string | number) => {
    const correctNum = safeNumber(correct);
    const incorrectNum = safeNumber(incorrect);
    const total = correctNum + incorrectNum;
    
    if (total === 0) return { text: 'Not Attempted', color: 'bg-gray-100 text-gray-800' };
    const percentage = (correctNum / total) * 100;
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

  // Handle navigation back to PTS report
  const handleViewFullReport = () => {
    navigate('/battlefield/war/report/pts');
  };

  // Handle share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'PTS Mock Test Analysis',
        text: `Check out my PTS mock test performance! Rank: #${studentInfo.rank}, Score: ${studentInfo.totalMarks}/${studentInfo.maxMarks}`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`PTS Mock Test Analysis - Rank: #${studentInfo.rank}, Score: ${studentInfo.totalMarks}/${studentInfo.maxMarks}`);
      alert('Analysis link copied to clipboard!');
    }
  };

  // Handle download functionality
  const handleDownload = () => {
    // Placeholder for PDF download functionality
    alert('PDF download feature coming soon!');
  };

  // Check if we have data
  const hasData = Object.keys(reportData).length > 0;

  if (!hasData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data Available</h2>
            <p className="text-gray-600 mb-6">
              Please complete a mock test first to view the analysis.
            </p>
            <Button 
              onClick={() => navigate('/battlefield/war/report/pts')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to Report Card
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <style>{`
        /* Enhanced Progress Bar Styles */
        .progress-excellent {
          background: linear-gradient(90deg, #10b981 0%, #34d399 50%, #6ee7b7 100%) !important;
          animation: pulse-glow 2s ease-in-out infinite alternate;
        }
        
        .progress-good {
          background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%) !important;
        }
        
        .progress-needs-work {
          background: linear-gradient(90deg, #ef4444 0%, #f87171 50%, #fca5a5 100%) !important;
        }
        
        .progress-neutral {
          background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%) !important;
        }
        
        @keyframes pulse-glow {
          0% { box-shadow: 0 1px 3px rgba(16, 185, 129, 0.3); }
          100% { box-shadow: 0 1px 8px rgba(16, 185, 129, 0.6); }
        }
      `}</style>

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
                        <CardTitle className="text-xl text-gray-900 dark:text-gray-100">{subject.name}</CardTitle>
                        <div className={`text-sm font-medium ${statusColor}`}>{stats.status}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{Math.round(stats.accuracy)}%</div>
                      <div className="text-sm text-gray-600">Accuracy</div>
                    </div>
                  </div>
                  <EnhancedProgressBar value={stats.accuracy} size="subject" className="h-3" />
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
                        const correct = safeNumber(chapter.correct);
                        const incorrect = safeNumber(chapter.incorrect);
                        const accuracy = correct + incorrect > 0 ? 
                          Math.round((correct / (correct + incorrect)) * 100) : 0;
                        
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
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-x-2 rounded focus-visible:ring-2 focus-visible:ring-blue-400"
                onClick={() => navigate('/battlefield/war/report/weak-chapters')}
              >
                <BookOpen className="w-5 h-5 text-white" />
                <span className="text-white">Revise Weak Chapters</span>
              </Button>
              <Button 
                variant="outline" 
                className="border-purple-600 text-purple-600 bg-gray-50 flex items-center gap-x-2 rounded focus-visible:ring-2 focus-visible:ring-purple-400 hover:bg-purple-100"
                onClick={() => navigate('/battlefield/war/report/pts')}
              >
                <RotateCcw className="w-5 h-5 text-purple-600" />
                <span className="text-purple-600">Retry Mistakes</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Battle Map */}
        <Card className="mb-8 bg-gray-50 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
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
              onClick={handleViewFullReport}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-x-2 rounded focus-visible:ring-2 focus-visible:ring-purple-400"
            >
              <Eye className="w-5 h-5 text-white" />
              <span className="text-white">View Full Report</span>
            </Button>
            <Button 
              variant="outline" 
              className="border-purple-600 text-purple-600 bg-gray-50 flex items-center gap-x-2 rounded focus-visible:ring-2 focus-visible:ring-purple-400"
              onClick={() => navigate('/battlefield/war/report/weak-chapters')}
            >
              <RotateCcw className="w-5 h-5 text-purple-600" />
              <span className="text-purple-600">Retry Weak Areas</span>
            </Button>
            <Button 
              variant="outline" 
              className="border-blue-600 text-blue-600 bg-gray-50 flex items-center gap-x-2 rounded focus-visible:ring-2 focus-visible:ring-blue-400"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5 text-blue-600" />
              <span className="text-blue-600">Share Report</span>
            </Button>
            <Button 
              variant="outline" 
              className="border-green-600 text-green-600 bg-gray-50 flex items-center gap-x-2 rounded focus-visible:ring-2 focus-visible:ring-green-400"
              onClick={handleDownload}
            >
              <Download className="w-5 h-5 text-green-600" />
              <span className="text-green-600">Download PDF</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleAnalysis;