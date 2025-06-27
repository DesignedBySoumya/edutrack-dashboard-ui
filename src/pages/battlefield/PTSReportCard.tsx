
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Edit, Trophy, User, Hash, Target, TrendingUp, Share2, Download, FileText, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { SubjectData, Chapter } from '@/types/reportTypes';

// Mock student data for PTS Report
const studentInfo = {
  name: "Priya Sharma",
  mockNo: "PTS-2024-15",
  rank: 45,
  totalMarks: 156,
  maxMarks: 200,
  percentile: 78.5
};

// PTS Report Card subject structure with chapters
const ptsSubjects: SubjectData = {
  maths: {
    name: "Mathematics",
    icon: "📐",
    color: "blue",
    maxMarks: 50,
    chapters: [
      { name: "Percentage", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Profit Loss & Discount", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Ratio & Proportion", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Mixtures & Alligation", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Average", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Time & Work", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Time, Speed, Distance", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Geometry", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Simplification", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Number System", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Algebra", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Trigonometry", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Mensuration", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "LCM & HCF", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Data Interpretation", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "CI / SI", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" }
    ]
  },
  english: {
    name: "English",
    icon: "📖",
    color: "purple",
    maxMarks: 50,
    chapters: [
      { name: "Error Spotting", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Sentence Improvement", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Fill in the Blanks", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Voice", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Narration", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Antonyms", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Synonyms", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Idioms & Phrases", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Cloze Test", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Reading Comprehension", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" }
    ]
  },
  gkgs: {
    name: "GK/GS",
    icon: "🌍",
    color: "green",
    maxMarks: 50,
    chapters: [
      { name: "History", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Geography", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Polity", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Science", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Economics", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Static GK", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Current Affairs", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" }
    ]
  },
  reasoning: {
    name: "Reasoning",
    icon: "🧠",
    color: "orange",
    maxMarks: 50,
    chapters: [
      { name: "Number Series", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Alphabet Series", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Analogy", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Syllogism", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Mirror / Water Image", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Dictionary", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Classifications", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Dice", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Figure Related", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Odd One Out", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Clock", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "BODMAS", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Blood Relation", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Coding Decoding", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Calendar", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Matrix", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Mathematical Operations", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Word Coding", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Ranking & Sitting Arrangement", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" },
      { name: "Venn Diagram", correct: "", incorrect: "", timeSpent: "", marks: "", whatWentWrong: "", learnings: "" }
    ]
  }
};

const PTSReportCard = () => {
  const [subjectData, setSubjectData] = useState<SubjectData>(ptsSubjects);
  const [saveStatus, setSaveStatus] = useState('');
  const [editableRank, setEditableRank] = useState(false);
  const [customRank, setCustomRank] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('pts-report-data');
    if (savedData) {
      try {
        setSubjectData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Auto-save functionality
  const saveData = () => {
    setSaveStatus('🔄 Saving...');
    localStorage.setItem('pts-report-data', JSON.stringify(subjectData));
    setTimeout(() => {
      setSaveStatus('💾 Saved');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 500);
  };

  // Calculate real-time analytics
  const calculateAnalytics = () => {
    const totalMarks = Object.values(subjectData).reduce((sum, subject) => {
      return sum + subject.chapters.reduce((chapterSum, chapter) => {
        return chapterSum + (Number(chapter.marks) || 0);
      }, 0);
    }, 0);

    const maxPossibleMarks = Object.values(subjectData).reduce((sum, subject) => sum + subject.maxMarks, 0);
    const percentile = maxPossibleMarks > 0 ? (totalMarks / maxPossibleMarks) * 100 : 0;
    const projectedRank = Math.floor((1 - percentile/100) * 12000);

    return {
      totalMarks,
      maxPossibleMarks,
      percentile: Math.round(percentile * 10) / 10,
      projectedRank
    };
  };

  const analytics = calculateAnalytics();

  const getPerformanceStatus = (correct: string, incorrect: string) => {
    const total = (Number(correct) || 0) + (Number(incorrect) || 0);
    if (total === 0) return { text: 'Not Attempted', color: 'bg-gray-100 text-gray-800' };
    const percentage = ((Number(correct) || 0) / total) * 100;
    if (percentage >= 75) return { text: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (percentage >= 50) return { text: 'Good', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Needs Work', color: 'bg-red-100 text-red-800' };
  };

  const updateChapterData = (subjectKey: string, chapterIndex: number, field: keyof Chapter, value: string) => {
    setSubjectData(prev => ({
      ...prev,
      [subjectKey]: {
        ...prev[subjectKey],
        chapters: prev[subjectKey].chapters.map((chapter, idx) =>
          idx === chapterIndex 
            ? { ...chapter, [field]: value }
            : chapter
        )
      }
    }));
  };

  // Auto-save when data changes
  useEffect(() => {
    saveData();
  }, [subjectData]);

  const calculateSubjectStats = (chapters: Chapter[]) => {
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

  const handleShare = () => {
    const shareText = `📊 My PTS Mock Test Results:
🎯 Score: ${analytics.totalMarks}/${analytics.maxPossibleMarks}
📈 Percentile: ${analytics.percentile}%
🏆 Projected Rank: ${analytics.projectedRank}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'PTS Mock Test Results',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Results copied to clipboard!",
        description: "Share your performance with others",
      });
    }
  };

  const handleDownloadPDF = () => {
    toast({
      title: "PDF Download",
      description: "PDF generation feature coming soon!",
    });
  };

  const handleAddToFlashcards = () => {
    const mistakes: any[] = [];
    Object.entries(subjectData).forEach(([subjectKey, subject]) => {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <style>{`
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>

      {/* Sticky Student Summary with Real-time Analytics */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-purple-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-200" />
                  <div>
                    <p className="text-sm text-purple-200">Student</p>
                    <p className="font-semibold">{studentInfo.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="w-5 h-5 text-purple-200" />
                  <div>
                    <p className="text-sm text-purple-200">Mock No.</p>
                    <p className="font-semibold">{studentInfo.mockNo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-purple-200" />
                  <div>
                    <p className="text-sm text-purple-200">Rank</p>
                    {editableRank ? (
                      <input
                        type="number"
                        value={customRank}
                        onChange={(e) => setCustomRank(e.target.value)}
                        onBlur={() => setEditableRank(false)}
                        onKeyPress={(e) => e.key === 'Enter' && setEditableRank(false)}
                        className="bg-transparent border-b border-white text-white font-semibold w-20"
                        placeholder="Enter rank"
                        autoFocus
                      />
                    ) : (
                      <p className="font-semibold cursor-pointer flex items-center gap-1" onClick={() => setEditableRank(true)}>
                        #{customRank || analytics.projectedRank} <Edit className="w-3 h-3" />
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-200" />
                  <div>
                    <p className="text-sm text-purple-200">Total Marks</p>
                    <p className="font-semibold">{analytics.totalMarks}/{analytics.maxPossibleMarks}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-200" />
                  <div>
                    <p className="text-sm text-purple-200">Percentile</p>
                    <p className="font-semibold">{analytics.percentile}%</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={handleShare}
                    size="sm"
                    variant="outline"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 mb-2">PTS Mock Test Report Card</h1>
          <p className="text-purple-600">Enter your performance data and track your progress in real-time</p>
        </div>

        <div className="space-y-6">
          {Object.entries(subjectData).map(([subjectKey, subject]) => {
            const stats = calculateSubjectStats(subject.chapters);
            const colorMap = {
              blue: 'border-blue-200 bg-blue-50',
              purple: 'border-purple-200 bg-purple-50',
              green: 'border-green-200 bg-green-50',
              orange: 'border-orange-200 bg-orange-50'
            };

            return (
              <Card key={subjectKey} className={`${colorMap[subject.color as keyof typeof colorMap]} shadow-lg`}>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={subjectKey} className="border-0">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{subject.icon}</span>
                          <div className="text-left">
                            <h3 className="text-xl font-bold text-gray-800">{subject.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              <span>Total: {stats.totalQuestions}</span>
                              <span>Attempted: {stats.attempted}</span>
                              <span>Correct: {stats.correct}</span>
                              <span>Incorrect: {stats.incorrect}</span>
                              <span>Time: {stats.timeSpent}min</span>
                              <span>Marks: {stats.totalMarks}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-sm text-gray-600">Progress</div>
                            <div className="font-bold">{Math.round(stats.percentage)}%</div>
                          </div>
                          <Progress 
                            value={stats.percentage} 
                            className="w-16"
                          />
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {subject.chapters.map((chapter, chapterIndex) => {
                          const status = getPerformanceStatus(chapter.correct, chapter.incorrect);
                          const total = (Number(chapter.correct) || 0) + (Number(chapter.incorrect) || 0);
                          const percentage = total > 0 ? Math.round(((Number(chapter.correct) || 0) / total) * 100) : 0;

                          return (
                            <Card key={chapterIndex} className="border-2 hover:shadow-md transition-shadow bg-white">
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-lg text-gray-800">{chapter.name}</CardTitle>
                                  <Badge className={status.color}>{status.text}</Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                {/* Input Fields */}
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-xs text-gray-600 mb-1 block">✅ Correct</label>
                                    <input
                                      type="number"
                                      min="0"
                                      placeholder="e.g., 5"
                                      value={chapter.correct}
                                      onChange={(e) => updateChapterData(subjectKey, chapterIndex, 'correct', e.target.value)}
                                      className="w-full p-2 border border-gray-300 rounded text-center"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-600 mb-1 block">❌ Incorrect</label>
                                    <input
                                      type="number"
                                      min="0"
                                      placeholder="e.g., 2"
                                      value={chapter.incorrect}
                                      onChange={(e) => updateChapterData(subjectKey, chapterIndex, 'incorrect', e.target.value)}
                                      className="w-full p-2 border border-gray-300 rounded text-center"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-600 mb-1 block">🕒 Time (min)</label>
                                    <input
                                      type="number"
                                      min="0"
                                      placeholder="e.g., 15"
                                      value={chapter.timeSpent}
                                      onChange={(e) => updateChapterData(subjectKey, chapterIndex, 'timeSpent', e.target.value)}
                                      className="w-full p-2 border border-gray-300 rounded text-center"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-600 mb-1 block">🎯 Marks</label>
                                    <input
                                      type="number"
                                      min="0"
                                      placeholder="e.g., 10"
                                      value={chapter.marks}
                                      onChange={(e) => updateChapterData(subjectKey, chapterIndex, 'marks', e.target.value)}
                                      className="w-full p-2 border border-gray-300 rounded text-center"
                                    />
                                  </div>
                                </div>

                                {/* Progress Bar with Enhanced Colors */}
                                {total > 0 && (
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600">Accuracy</span>
                                      <span className="text-gray-800 font-medium">{percentage}%</span>
                                    </div>
                                    <Progress value={percentage} className="h-3" />
                                  </div>
                                )}

                                {/* What Went Wrong */}
                                <div>
                                  <label className="text-xs text-gray-600 mb-1 block">❓ What went wrong?</label>
                                  <Textarea
                                    placeholder="Identify mistakes and areas of confusion..."
                                    value={chapter.whatWentWrong}
                                    onChange={(e) => updateChapterData(subjectKey, chapterIndex, 'whatWentWrong', e.target.value)}
                                    className="resize-none text-sm"
                                    rows={2}
                                  />
                                </div>

                                {/* Learnings */}
                                <div>
                                  <label className="text-xs text-gray-600 mb-1 block">💡 Strategy for next time</label>
                                  <Textarea
                                    placeholder="What will you do differently next time?"
                                    value={chapter.learnings}
                                    onChange={(e) => updateChapterData(subjectKey, chapterIndex, 'learnings', e.target.value)}
                                    className="resize-none text-sm"
                                    rows={2}
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-purple-200 shadow-lg p-4 rounded-t-xl mt-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={() => navigate('/battle-analysis', { state: { reportData: subjectData, studentInfo } })}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3"
              size="lg"
            >
              <FileText className="w-5 h-5 mr-2" />
              View Report Card
            </Button>
            <Button 
              onClick={handleAddToFlashcards}
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50 px-6 py-3"
              size="lg"
            >
              🧠 Add Mistakes to Flashcards
            </Button>
            <Button 
              onClick={handleDownloadPDF}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 px-6 py-3"
              size="lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </Button>
            <Button 
              onClick={() => navigate('/compare-mocks')}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3"
              size="lg"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Compare Mocks
            </Button>
          </div>
          {saveStatus && (
            <p className="text-center text-sm text-gray-600 mt-2 flex items-center justify-center gap-1">
              {saveStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PTSReportCard;
