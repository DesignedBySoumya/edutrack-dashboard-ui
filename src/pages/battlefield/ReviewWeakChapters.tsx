
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, AlertTriangle, Target, BookOpen, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
// Local definition for SubjectData (copied from BattleAnalysis.tsx)
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

interface WeakChapter {
  subject: string;
  subjectIcon: string;
  subjectColor: string;
  chapterName: string;
  correct: number;
  incorrect: number;
  total: number;
  accuracy: number;
  marks: number;
  timeSpent: number;
  whatWentWrong: string;
  learnings: string;
  subjectKey: string;
  chapterIndex: number;
}

const ReviewWeakChapters = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [weakChapters, setWeakChapters] = useState<WeakChapter[]>([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('accuracy'); // 'accuracy', 'marks', 'time'
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // 'asc' or 'desc'

  useEffect(() => {
    const fetchWeakChapters = async () => {
      try {
        const { data, error } = await supabase
          .from('mock_performance_by_chapter')
          .select(`
            chapter_id,
            correct,
            incorrect,
            marks,
            time_spent_min,
            what_went_wrong,
            how_to_improve,
            chapters (
              name,
              subject_id
            )
          `);

        if (error) {
          console.error('Error fetching weak chapters:', error);
          toast({
            title: 'Error fetching weak chapters',
            description: error.message,
            variant: 'destructive',
          });
          return;
        }

        const weak: WeakChapter[] = [];
        data.forEach((item: any, idx: number) => {
          const correct = Number(item.correct) || 0;
          const incorrect = Number(item.incorrect) || 0;
          const total = correct + incorrect;
          const accuracy = total > 0 ? (correct / total) * 100 : 0;
          const marks = Number(item.marks) || 0;
          // Consider weak if accuracy < 60% or marks < 50% of expected
          if ((total > 0 && accuracy < 60) || (marks > 0 && marks < 5)) {
            weak.push({
              subject: '', // To be filled if you join with subjects
              subjectIcon: '',
              subjectColor: '',
              chapterName: item.chapters?.name || `Chapter ${item.chapter_id}`,
              correct,
              incorrect,
              total,
              accuracy: Math.round(accuracy),
              marks,
              timeSpent: Number(item.time_spent_min) || 0,
              whatWentWrong: item.what_went_wrong || '',
              learnings: item.how_to_improve || '',
              subjectKey: '',
              chapterIndex: idx,
            });
          }
        });

        setWeakChapters(weak);
      } catch (error) {
        console.error('Error fetching weak chapters:', error);
        toast({
          title: 'Error fetching weak chapters',
          description: 'Failed to load weak chapters data.',
          variant: 'destructive',
        });
      }
    };

    fetchWeakChapters();
  }, []);

  const updateChapterNotes = async (subjectKey: string, chapterIndex: number, field: string, value: string) => {
    try {
      const { error } = await supabase
        .from('mock_performance_by_chapter')
        .update({ [field]: value })
        .eq('subject_name', subjectKey)
        .eq('chapter_name', weakChapters[chapterIndex].chapterName);

      if (error) {
        console.error('Error updating data:', error);
        toast({
          title: 'Error updating notes',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      // Update local state
      setWeakChapters(prev => prev.map(chapter => 
        chapter.subjectKey === subjectKey && chapter.chapterIndex === chapterIndex
          ? { ...chapter, [field]: value }
          : chapter
      ));
      toast({
        title: 'Notes updated',
        description: `Notes for ${weakChapters[chapterIndex].chapterName} updated.`,
      });
    } catch (error) {
      console.error('Error updating data:', error);
      toast({
        title: 'Error updating notes',
        description: 'Failed to update notes.',
        variant: 'destructive',
      });
    }
  };

  const addToFlashcards = (chapter: WeakChapter) => {
    if (chapter.whatWentWrong) {
      toast({
        title: "🧠 Added to Flashcards!",
        description: `${chapter.subject} - ${chapter.chapterName} mistakes added to flashcards`,
      });
    } else {
      toast({
        title: "Add mistake details first",
        description: "Please fill in 'What went wrong' to add to flashcards",
        variant: "destructive"
      });
    }
  };

  const filteredAndSortedChapters = weakChapters
    .filter(chapter => {
      if (filter === 'accuracy') return chapter.accuracy < 50;
      if (filter === 'marks') return chapter.marks < 5;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'accuracy') {
        return sortOrder === 'asc' ? a.accuracy - b.accuracy : b.accuracy - a.accuracy;
      } else if (sortBy === 'marks') {
        return sortOrder === 'asc' ? a.marks - b.marks : b.marks - a.marks;
      } else if (sortBy === 'time') {
        return sortOrder === 'asc' ? a.timeSpent - b.timeSpent : b.timeSpent - a.timeSpent;
      }
      return 0;
    });

  const getPerformanceLevel = (accuracy: number) => {
    if (accuracy < 30) return { text: 'Critical', color: 'bg-red-100 text-red-800', icon: '🚨' };
    if (accuracy < 50) return { text: 'Poor', color: 'bg-orange-100 text-orange-800', icon: '⚠️' };
    if (accuracy < 60) return { text: 'Below Average', color: 'bg-yellow-100 text-yellow-800', icon: '📉' };
    return { text: 'Needs Work', color: 'bg-blue-100 text-blue-800', icon: '📚' };
  };

  return (
    <div className="min-h-screen bg-gray-900 dark bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          {/* <Button
            variant="outline"
            onClick={() => navigate('/pts-report-card')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Report Card
          </Button> */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              Review Weak Chapters
            </h1>
            <p className="text-gray-600 dark:text-gray-300">Focus on areas that need improvement</p>
          </div>
        </div>

        {/* Filter Options */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All Weak Areas ({weakChapters.length})
          </Button>
          <Button
            variant={filter === 'accuracy' ? 'default' : 'outline'}
            onClick={() => setFilter('accuracy')}
          >
            Low Accuracy ({weakChapters.filter(c => c.accuracy < 50).length})
          </Button>
          <Button
            variant={filter === 'marks' ? 'default' : 'outline'}
            onClick={() => setFilter('marks')}
          >
            Low Marks ({weakChapters.filter(c => c.marks < 5).length})
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{weakChapters.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Weak Chapters</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {Math.round(weakChapters.reduce((sum, ch) => sum + ch.accuracy, 0) / weakChapters.length) || 0}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Average Accuracy</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {weakChapters.reduce((sum, ch) => sum + ch.marks, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Marks Lost</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {weakChapters.filter(ch => ch.whatWentWrong).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Analyzed</div>
            </CardContent>
          </Card>
        </div>

        {/* Weak Chapters List */}
        {filteredAndSortedChapters.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Target className="w-16 h-16 mx-auto text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Great Job!</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {filter === 'all' 
                  ? 'No weak chapters found. Keep up the excellent work!'
                  : 'No chapters match the current filter. Try adjusting your filter settings.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 min-h-[300px]">
            {filteredAndSortedChapters.map((chapter, index) => {
              const performance = getPerformanceLevel(chapter.accuracy);
              
              return (
                <Card key={`${chapter.subjectKey}-${chapter.chapterIndex}`} className="border-l-4 border-l-red-400 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{chapter.subjectIcon}</span>
                        <div>
                          <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{chapter.chapterName}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{chapter.subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={performance.color}>
                          {performance.icon} {performance.text}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Performance Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">{chapter.correct}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">Correct</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600 dark:text-red-400">{chapter.incorrect}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">Incorrect</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{chapter.accuracy}%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{chapter.marks}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">Marks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{chapter.timeSpent}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">Minutes</div>
                      </div>
                    </div>

                    {/* Analysis Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400" />
                          What went wrong?
                        </label>
                        <Textarea
                          placeholder="Identify specific mistakes and confusion areas..."
                          value={chapter.whatWentWrong}
                          onChange={(e) => updateChapterNotes(chapter.subjectKey, chapter.chapterIndex, 'whatWentWrong', e.target.value)}
                          rows={3}
                          className="text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                          Learning strategy
                        </label>
                        <Textarea
                          placeholder="Plan your revision approach for this chapter..."
                          value={chapter.learnings}
                          onChange={(e) => updateChapterNotes(chapter.subjectKey, chapter.chapterIndex, 'learnings', e.target.value)}
                          rows={3}
                          className="text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex items-center gap-x-2 bg-purple-600 text-white hover:bg-purple-700 rounded focus-visible:ring-2 focus-visible:ring-purple-400"
                        onClick={() => {
                          // Navigate to flashcards page, passing current location for back navigation
                          navigate('/flashcards', { state: { from: '/battlefield/review-weak-chapters' } });
                          addToFlashcards(chapter);
                        }}
                      >
                        <Brain className="w-4 h-4 text-white" />
                        <span className="text-white">Add to Flashcards</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-x-2 border-purple-600 text-purple-600 bg-gray-50 dark:bg-gray-800 dark:border-purple-400 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-gray-700 rounded focus-visible:ring-2 focus-visible:ring-purple-400"
                        onClick={() => {
                          // Navigate to the PTS Report Card page
                          navigate('/battlefield/war/report/pts');
                        }}
                      >
                        <Target className="w-4 h-4 text-purple-600 dark:text-purple-200" />
                        <span className="text-purple-600 dark:text-purple-200">Practice More</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Action Footer */}
        <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Ready to improve?</h3>
              <p className="text-gray-600 dark:text-gray-300">Focus on these weak areas in your next study session</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => navigate('/battlefield/war/report/compare')} 
                variant="outline"
                className="border-blue-600 text-blue-600 bg-gray-50 dark:bg-gray-800 dark:border-blue-400 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-gray-700 rounded focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                View Progress
              </Button>
              <Button 
                onClick={() => navigate('/battlefield/war/report/analysis')}
                className="bg-purple-600 text-white hover:bg-purple-700 rounded focus-visible:ring-2 focus-visible:ring-purple-400"
              >
                Back to Report Card
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewWeakChapters;
