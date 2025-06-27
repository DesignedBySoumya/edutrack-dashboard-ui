
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, AlertTriangle, Target, BookOpen, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { SubjectData } from '@/types/reportTypes';

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

  useEffect(() => {
    // Load data from localStorage
    const savedData = localStorage.getItem('pts-report-data');
    if (savedData) {
      try {
        const data: SubjectData = JSON.parse(savedData);
        const weak: WeakChapter[] = [];
        
        Object.entries(data).forEach(([subjectKey, subject]) => {
          subject.chapters.forEach((chapter, index) => {
            const correct = Number(chapter.correct) || 0;
            const incorrect = Number(chapter.incorrect) || 0;
            const total = correct + incorrect;
            const accuracy = total > 0 ? (correct / total) * 100 : 0;
            const marks = Number(chapter.marks) || 0;
            
            // Consider weak if accuracy < 60% or marks < 50% of expected
            if ((total > 0 && accuracy < 60) || (marks > 0 && marks < 5)) {
              weak.push({
                subject: subject.name,
                subjectIcon: subject.icon,
                subjectColor: subject.color,
                chapterName: chapter.name,
                correct,
                incorrect,
                total,
                accuracy: Math.round(accuracy),
                marks,
                timeSpent: Number(chapter.timeSpent) || 0,
                whatWentWrong: chapter.whatWentWrong || '',
                learnings: chapter.learnings || '',
                subjectKey,
                chapterIndex: index
              });
            }
          });
        });
        
        setWeakChapters(weak);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
  }, []);

  const updateChapterNotes = (subjectKey: string, chapterIndex: number, field: string, value: string) => {
    const savedData = localStorage.getItem('pts-report-data');
    if (savedData) {
      try {
        const data: SubjectData = JSON.parse(savedData);
        (data[subjectKey].chapters[chapterIndex] as any)[field] = value;
        localStorage.setItem('pts-report-data', JSON.stringify(data));
        
        // Update local state
        setWeakChapters(prev => prev.map(chapter => 
          chapter.subjectKey === subjectKey && chapter.chapterIndex === chapterIndex
            ? { ...chapter, [field]: value }
            : chapter
        ));
      } catch (error) {
        console.error('Error updating data:', error);
      }
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

  const filteredChapters = weakChapters.filter(chapter => {
    if (filter === 'accuracy') return chapter.accuracy < 50;
    if (filter === 'marks') return chapter.marks < 5;
    return true;
  });

  const getPerformanceLevel = (accuracy: number) => {
    if (accuracy < 30) return { text: 'Critical', color: 'bg-red-100 text-red-800', icon: '🚨' };
    if (accuracy < 50) return { text: 'Poor', color: 'bg-orange-100 text-orange-800', icon: '⚠️' };
    if (accuracy < 60) return { text: 'Below Average', color: 'bg-yellow-100 text-yellow-800', icon: '📉' };
    return { text: 'Needs Work', color: 'bg-blue-100 text-blue-800', icon: '📚' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/pts-report-card')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Report Card
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
              Review Weak Chapters
            </h1>
            <p className="text-gray-600">Focus on areas that need improvement</p>
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
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{weakChapters.length}</div>
              <div className="text-sm text-gray-600">Weak Chapters</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(weakChapters.reduce((sum, ch) => sum + ch.accuracy, 0) / weakChapters.length) || 0}%
              </div>
              <div className="text-sm text-gray-600">Average Accuracy</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {weakChapters.reduce((sum, ch) => sum + ch.marks, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Marks Lost</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {weakChapters.filter(ch => ch.whatWentWrong).length}
              </div>
              <div className="text-sm text-gray-600">Analyzed</div>
            </CardContent>
          </Card>
        </div>

        {/* Weak Chapters List */}
        {filteredChapters.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Target className="w-16 h-16 mx-auto text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Great Job!</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'No weak chapters found. Keep up the excellent work!'
                  : 'No chapters match the current filter. Try adjusting your filter settings.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredChapters.map((chapter, index) => {
              const performance = getPerformanceLevel(chapter.accuracy);
              
              return (
                <Card key={`${chapter.subjectKey}-${chapter.chapterIndex}`} className="border-l-4 border-l-red-400">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{chapter.subjectIcon}</span>
                        <div>
                          <CardTitle className="text-lg">{chapter.chapterName}</CardTitle>
                          <p className="text-sm text-gray-600">{chapter.subject}</p>
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
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{chapter.correct}</div>
                        <div className="text-xs text-gray-600">Correct</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600">{chapter.incorrect}</div>
                        <div className="text-xs text-gray-600">Incorrect</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{chapter.accuracy}%</div>
                        <div className="text-xs text-gray-600">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">{chapter.marks}</div>
                        <div className="text-xs text-gray-600">Marks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">{chapter.timeSpent}</div>
                        <div className="text-xs text-gray-600">Minutes</div>
                      </div>
                    </div>

                    {/* Analysis Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          What went wrong?
                        </label>
                        <Textarea
                          placeholder="Identify specific mistakes and confusion areas..."
                          value={chapter.whatWentWrong}
                          onChange={(e) => updateChapterNotes(chapter.subjectKey, chapter.chapterIndex, 'whatWentWrong', e.target.value)}
                          rows={3}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-1">
                          <BookOpen className="w-4 h-4 text-blue-500" />
                          Learning strategy
                        </label>
                        <Textarea
                          placeholder="Plan your revision approach for this chapter..."
                          value={chapter.learnings}
                          onChange={(e) => updateChapterNotes(chapter.subjectKey, chapter.chapterIndex, 'learnings', e.target.value)}
                          rows={3}
                          className="text-sm"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => addToFlashcards(chapter)}
                        className="flex items-center gap-1"
                      >
                        <Brain className="w-4 h-4" />
                        Add to Flashcards
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate('/pts-report-card')}
                        className="flex items-center gap-1"
                      >
                        <Target className="w-4 h-4" />
                        Practice More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Action Footer */}
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-800">Ready to improve?</h3>
              <p className="text-gray-600">Focus on these weak areas in your next study session</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/compare-mocks')} variant="outline">
                View Progress
              </Button>
              <Button onClick={() => navigate('/pts-report-card')}>
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
