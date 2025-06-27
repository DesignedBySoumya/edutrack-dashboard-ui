
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Brain, BarChart3, FileText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { SubjectData, StudentInfo, SubjectAnalysis } from '@/types/reportTypes';

const BattleAnalysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reportData, studentInfo } = location.state || { reportData: null, studentInfo: null };
  const { toast } = useToast();

  if (!reportData || !studentInfo) {
    return <div className="min-h-screen flex items-center justify-center">No data available. Please submit the report card first.</div>;
  }

  const calculateSubjectStats = (chapters: any[]) => {
    const totalQuestions = chapters.reduce((sum, ch) => sum + (Number(ch.correct) || 0) + (Number(ch.incorrect) || 0), 0);
    const attempted = chapters.filter(ch => (Number(ch.correct) || 0) + (Number(ch.incorrect) || 0) > 0).length;
    const totalCorrect = chapters.reduce((sum, ch) => sum + (Number(ch.correct) || 0), 0);
    const totalIncorrect = chapters.reduce((sum, ch) => sum + (Number(ch.incorrect) || 0), 0);
    const totalTime = chapters.reduce((sum, ch) => sum + (Number(ch.timeSpent) || 0), 0);
    const totalMarks = chapters.reduce((sum, ch) => sum + (Number(ch.marks) || 0), 0);
    
    return {
      totalQuestions,
      attempted,
      correct: totalCorrect,
      incorrect: totalIncorrect,
      timeSpent: totalTime,
      totalMarks,
      percentage: totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0
    };
  };

  const subjectAnalysis: SubjectAnalysis[] = Object.entries(reportData as SubjectData).map(([subjectKey, subject]) => {
    const stats = calculateSubjectStats(subject.chapters);
    return {
      name: subject.name,
      icon: subject.icon,
      color: subject.color,
      ...stats
    };
  });

  const totalMarks = subjectAnalysis.reduce((sum, subject) => sum + subject.totalMarks, 0);
  const totalQuestions = subjectAnalysis.reduce((sum, subject) => sum + subject.totalQuestions, 0);
  const overallAccuracy = totalQuestions > 0 ? (subjectAnalysis.reduce((sum, subject) => sum + subject.correct, 0) / totalQuestions) * 100 : 0;

  const handleAddToFlashcards = () => {
    const mistakes: any[] = [];
    Object.entries(reportData as SubjectData).forEach(([subjectKey, subject]) => {
      subject.chapters.forEach((chapter) => {
        if ((Number(chapter.incorrect) || 0) > 0 && chapter.whatWentWrong) {
          mistakes.push({
            subject: subject.name,
            chapter: chapter.name,
            mistakes: chapter.whatWentWrong,
            learnings: chapter.learnings
          });
        }
      });
    });

    if (mistakes.length > 0) {
      toast({
        title: "🧠 Mistakes added to flashcards!",
        description: `${mistakes.length} mistake(s) sent to your flashcard system`,
      });
    } else {
      toast({
        title: "No mistakes found",
        description: "Add some incorrect answers and 'What went wrong' notes first",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-indigo-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Student: {studentInfo.name}</h2>
                  <p className="text-sm">Mock No: {studentInfo.mockNo}</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Total Marks: {totalMarks}</h2>
                  <p className="text-sm">Overall Accuracy: {overallAccuracy.toFixed(2)}%</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Overall Performance</h2>
                  <p className="text-sm">Insights and recommendations based on your performance.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <Card className="mb-8 bg-white shadow-lg">
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Battle Analysis</h1>
            <p className="text-gray-600">
              Detailed analysis of your performance in the PTS Mock Test. Identify strengths and weaknesses to improve your score.
            </p>
          </CardContent>
        </Card>

        {/* Subject-wise Analysis */}
        <Card className="mb-8 bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Subject-wise Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {subjectAnalysis.map((subject) => (
                <div key={subject.name} className="p-4 border rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{subject.icon}</span>
                    <h3 className="font-semibold">{subject.name}</h3>
                  </div>
                  <p className="text-sm">Total Questions: {subject.totalQuestions}</p>
                  <p className="text-sm">Correct: {subject.correct}</p>
                  <p className="text-sm">Incorrect: {subject.incorrect}</p>
                  <p className="text-sm">Accuracy: {subject.percentage.toFixed(2)}%</p>
                  <p className="text-sm">Marks: {subject.totalMarks}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Center */}
        <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 shadow-xl">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">🎯 Action Center</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                className="bg-white/20 hover:bg-white/30 border-white/30 text-white p-6 h-auto flex-col"
                onClick={() => navigate('/review-weak-chapters')}
              >
                <AlertTriangle className="w-8 h-8 mb-2" />
                <span className="font-semibold">Review Weak Chapters</span>
                <span className="text-sm opacity-80">Focus on problem areas</span>
              </Button>
              
              <Button 
                className="bg-white/20 hover:bg-white/30 border-white/30 text-white p-6 h-auto flex-col"
                onClick={handleAddToFlashcards}
              >
                <Brain className="w-8 h-8 mb-2" />
                <span className="font-semibold">🧠 Add Mistakes to Flashcards</span>
                <span className="text-sm opacity-80">Learn from errors</span>
              </Button>
              
              <Button 
                className="bg-white/20 hover:bg-white/30 border-white/30 text-white p-6 h-auto flex-col"
                onClick={() => navigate('/compare-mocks')}
              >
                <BarChart3 className="w-8 h-8 mb-2" />
                <span className="font-semibold">Compare Progress</span>
                <span className="text-sm opacity-80">Track improvement</span>
              </Button>
              
              <Button 
                className="bg-white/20 hover:bg-white/30 border-white/30 text-white p-6 h-auto flex-col"
                onClick={() => window.print()}
              >
                <FileText className="w-8 h-8 mb-2" />
                <span className="font-semibold">Download Report</span>
                <span className="text-sm opacity-80">Save & share</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BattleAnalysis;
