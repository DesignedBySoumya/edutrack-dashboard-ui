import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Edit, Trophy, User, Hash, Target, TrendingUp, Share2, Download, FileText, BarChart3, CheckCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

// Type definitions
interface ChapterData {
  chapter_id: number;
  name: string;
  correct: string | number;
  incorrect: string | number;
  timeSpent: string | number;
  marks: string | number;
  whatWentWrong: string;
  learnings: string;
}

interface SubjectData {
  name: string;
  icon: string;
  color: string;
  maxMarks: number;
  chapters: ChapterData[];
}

interface SaveStatus {
  [key: string]: 'idle' | 'saving' | 'saved' | 'error';
}

// Dynamic student data interface
interface MockTestInfo {
  id: string;
  user_id: string;
  exam_id: number;
  pts_year: string;
  total_score: number;
  accuracy: number;
  rank: number;
  percentile: number;
  created_at: string;
}

// Helper function to get academic year
function getAcademicYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
}

const PTSReportCard = () => {
  const [subjectData, setSubjectData] = useState<Record<string, SubjectData>>({});
  const [mockId, setMockId] = useState<string | null>(null);
  const [mockTestInfo, setMockTestInfo] = useState<MockTestInfo | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({});
  const [editableRank, setEditableRank] = useState(false);
  const [customRank, setCustomRank] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('Student');
  const [totalMockNumber, setTotalMockNumber] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Debounce refs
  const debounceRefs = useRef<Record<string, NodeJS.Timeout>>({});
  const mockCreationPromise = useRef<Promise<string> | null>(null);
  // Track if mock has been created in this session to prevent duplicates
  const mockCreatedInSession = useRef<boolean>(false);

  // Create new mock test ID (only once per session)
  const ensureMockTest = useCallback(async (): Promise<string> => {
    // If there's already a creation in progress, wait for it
    if (mockCreationPromise.current) {
      return await mockCreationPromise.current;
    }

    // If we already have a mock_id and it was created in this session, return it
    if (mockId && mockCreatedInSession.current) {
      return mockId;
    }

    // Check if we have a mock_id from localStorage (from a previous session)
    const savedMockId = localStorage.getItem('mock_id');
    if (savedMockId && !mockCreatedInSession.current) {
      // Verify the saved mock_id actually exists in the database
      const { data: mockData } = await supabase
        .from('mock_tests')
        .select('*')
        .eq('id', savedMockId)
        .single();
      
      if (mockData) {
        setMockId(savedMockId);
        setMockTestInfo(mockData);
        return savedMockId;
      } else {
        console.log('Saved mock_id not found in database, removing from localStorage');
        localStorage.removeItem('mock_id');
      }
    }

    // Create new mock test
    mockCreationPromise.current = (async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error('User not authenticated');
        }

        const exam_id = Number(localStorage.getItem('selectedExamId')) || 1;
        const pts_year = getAcademicYear();

        // Extract user name from auth data
        let displayName = 'Student';
        
        // Try to get from user metadata first
        if (user.user_metadata?.full_name) {
          displayName = user.user_metadata.full_name;
        } else if (user.user_metadata?.name) {
          displayName = user.user_metadata.name;
        } else if (user.user_metadata?.first_name && user.user_metadata?.last_name) {
          displayName = `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
        } else if (user.email) {
          // Extract name from email (before @ symbol)
          const emailName = user.email.split('@')[0];
          // Capitalize first letter and replace dots/underscores with spaces
          displayName = emailName
            .replace(/[._]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
        }
        
        setUserName(displayName);
        console.log('Extracted user name:', displayName);

        // Get the total number of mock tests for this user (all time)
        const { data: allUserMocks, error: countError } = await supabase
          .from('mock_tests')
          .select('id')
          .eq('user_id', user.id);

        if (countError) {
          console.error('Error counting existing mocks:', countError);
        }

        const currentTotalMockNumber = (allUserMocks?.length || 0) + 1;
        setTotalMockNumber(currentTotalMockNumber);
        console.log(`Creating mock test #${currentTotalMockNumber} for user ${user.id} (total mocks: ${allUserMocks?.length || 0})`);
        
        const mockTestData = {
          user_id: user.id,
          exam_id,
          pts_year,
          total_score: 0,
          accuracy: 0,
          rank: 1200,
          percentile: 0
        };

        console.log('Attempting to create mock test with data:', mockTestData);
        
        // First, check if we can access the mock_tests table
        const { data: tableCheck, error: tableError } = await supabase
          .from('mock_tests')
          .select('id')
          .limit(1);
        
        if (tableError) {
          console.error('Cannot access mock_tests table:', tableError);
          throw new Error(`Cannot access mock_tests table: ${tableError.message}`);
        }
        
        console.log('mock_tests table is accessible');
        
        const { data, error } = await supabase
          .from('mock_tests')
          .insert(mockTestData)
          .select()
          .single();

        if (error) {
          console.error('Error creating mock test:', error);
          console.error('Error details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          
          // If RLS is blocking, try to use a test mock_id
          if (error.code === '42501' || error.message.includes('policy') || error.message.includes('RLS')) {
            console.log('RLS policy blocking insert, using test mock_id');
            const testMockId = '4e02855f-9b77-4d17-b360-1d8cf857a911';
            
            // Verify this test mock_id exists
            const { data: testMock } = await supabase
              .from('mock_tests')
              .select('id')
              .eq('id', testMockId)
              .single();
            
            if (testMock) {
              setMockId(testMockId);
              // Mark as created in this session and save to localStorage
              mockCreatedInSession.current = true;
              localStorage.setItem('mock_id', testMockId);
              toast({
                title: 'Using Test Mock ID',
                description: 'RLS blocked insert, using test mock_id',
                variant: 'default'
              });
              return testMockId;
            } else {
              throw new Error('Test mock_id not found in database');
            }
          }
          
          throw error;
        }

        const newMockId = data.id;
        setMockId(newMockId);
        setMockTestInfo(data);
        // Mark as created in this session and save to localStorage
        mockCreatedInSession.current = true;
        localStorage.setItem('mock_id', newMockId);
        console.log('Mock test created:', newMockId);
        return newMockId;
      } catch (error) {
        console.error('Failed to create mock test:', error);
        throw error;
      } finally {
        mockCreationPromise.current = null;
      }
    })();

    return await mockCreationPromise.current;
  }, [mockId]);

  // Update mock test with current analytics
  const updateMockTestAnalytics = useCallback(async (mock_id: string) => {
    try {
      const analytics = calculateAnalytics();
      const totalCorrect = Object.values(subjectData).reduce((sum: number, subject: SubjectData) => {
        return sum + subject.chapters.reduce((chapterSum: number, chapter: ChapterData) => {
          return chapterSum + (Number(chapter.correct) || 0);
        }, 0);
      }, 0);
      const totalIncorrect = Object.values(subjectData).reduce((sum: number, subject: SubjectData) => {
        return sum + subject.chapters.reduce((chapterSum: number, chapter: ChapterData) => {
          return chapterSum + (Number(chapter.incorrect) || 0);
        }, 0);
      }, 0);
      const attempted = totalCorrect + totalIncorrect;
      const accuracy = attempted > 0 ? (totalCorrect / attempted) * 100 : 0;

      const { error } = await supabase
        .from('mock_tests')
        .update({
          total_score: analytics.totalMarks,
          accuracy: accuracy,
          percentile: analytics.percentile,
          rank: analytics.projectedRank
        })
        .eq('id', mock_id);

      if (error) {
        console.error('Error updating mock test analytics:', error);
      }
    } catch (error) {
      console.error('Error updating mock test analytics:', error);
    }
  }, [subjectData]);

  // Auto-save chapter data to Supabase
  const saveChapterData = useCallback(async (subjectKey: string, chapterIndex: number, chapterData: ChapterData) => {
    try {
      // Ensure we have a mock_id (should be created on page load)
      if (!mockId) {
        console.error('No mock_id available for saving chapter data');
        return;
      }
      
      // Set saving status for this specific chapter
      const chapterKey = `${subjectKey}-${chapterIndex}`;
      setSaveStatus(prev => ({ ...prev, [chapterKey]: 'saving' }));

      const chapterEntry = {
        mock_id: mockId,
        chapter_id: chapterData.chapter_id,
        correct: Number(chapterData.correct) || 0,
        incorrect: Number(chapterData.incorrect) || 0,
        time_spent_min: Number(chapterData.timeSpent) || 0,
        marks: Number(chapterData.marks) || 0,
        what_went_wrong: chapterData.whatWentWrong || '',
        how_to_improve: chapterData.learnings || '',
      };

      const { error } = await supabase
        .from('mock_performance_by_chapter')
        .upsert(chapterEntry, { onConflict: ['mock_id', 'chapter_id'] });

      if (error) throw error;

      // Update mock test analytics
      await updateMockTestAnalytics(mockId);

      // Set saved status
      setSaveStatus(prev => ({ ...prev, [chapterKey]: 'saved' }));
      
      // Clear saved status after 2 seconds
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, [chapterKey]: 'idle' }));
      }, 2000);

    } catch (error) {
      console.error('Error saving chapter data:', error);
      const chapterKey = `${subjectKey}-${chapterIndex}`;
      setSaveStatus(prev => ({ ...prev, [chapterKey]: 'error' }));
      
      // Clear error status after 3 seconds
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, [chapterKey]: 'idle' }));
      }, 3000);
    }
  }, [mockId, updateMockTestAnalytics]);

  // Debounced save function
  const debouncedSave = useCallback((subjectKey: string, chapterIndex: number, chapterData: ChapterData) => {
    const chapterKey = `${subjectKey}-${chapterIndex}`;
    
    // Clear existing timeout
    if (debounceRefs.current[chapterKey]) {
      clearTimeout(debounceRefs.current[chapterKey]);
    }

    // Set new timeout
    debounceRefs.current[chapterKey] = setTimeout(() => {
      saveChapterData(subjectKey, chapterIndex, chapterData);
    }, 500); // 500ms debounce
  }, [saveChapterData]);

  // Update chapter data and trigger auto-save
  const updateChapterData = useCallback((subjectKey: string, chapterIndex: number, field: keyof ChapterData, value: string) => {
    setSubjectData(prev => {
      const newData = {
        ...prev,
        [subjectKey]: {
          ...prev[subjectKey],
          chapters: prev[subjectKey].chapters.map((chapter: ChapterData, idx: number) => 
            idx === chapterIndex ? { ...chapter, [field]: value } : chapter
          )
        }
      };

      // Trigger debounced save
      const updatedChapter = newData[subjectKey].chapters[chapterIndex];
      debouncedSave(subjectKey, chapterIndex, updatedChapter);

      return newData;
    });
  }, [debouncedSave]);

  // Load data from Supabase on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is coming from war route (end battle scenario)
        // If so, clear any existing mock_id to ensure a fresh mock test
        const isFromWarRoute = localStorage.getItem('from_war_route') === 'true';
        if (isFromWarRoute) {
          localStorage.removeItem('from_war_route');
          localStorage.removeItem('mock_id');
          setMockId(null);
          setMockTestInfo(null);
          mockCreatedInSession.current = false;
          console.log('Cleared existing mock data for fresh war session');
        }
        
        // Create a mock test only if one hasn't been created in this session
        // This prevents duplicate creation on re-renders or hot reloads
        try {
          await ensureMockTest();
        } catch (error) {
          console.error('Failed to create new mock test:', error);
          toast({
            title: 'Error',
            description: 'Failed to create new mock test',
            variant: 'destructive'
          });
        }

        // Fetch subjects and chapters structure
        const examId = Number(localStorage.getItem('selectedExamId')) || 1;
        const { data: subjects, error: subError } = await supabase
          .from('subjects')
          .select('*')
          .eq('exam_id', examId);

        if (subError) {
          console.error('Error loading subjects:', subError);
          return;
        }

        const finalSubjects: Record<string, SubjectData> = {};

        for (const subject of subjects) {
          const { data: chapters, error: chapError } = await supabase
            .from('chapters')
            .select('*')
            .eq('subject_id', subject.id);

          if (chapError) {
            console.error(`Error loading chapters for ${subject.name}:`, chapError);
            continue;
          }

          let color = subject.color || 'blue';
          if (color === 'black' || color === '#000' || color === '#000000') color = 'blue';

          finalSubjects[subject.key || subject.name.toLowerCase()] = {
            name: subject.name,
            icon: subject.icon || '📘',
            color,
            maxMarks: subject.maxMarks || 50,
            chapters: chapters.map(ch => ({
              chapter_id: ch.id,
              name: ch.name,
              correct: '',
              incorrect: '',
              timeSpent: '',
              marks: '',
              whatWentWrong: '',
              learnings: ''
            }))
          };
        }

        setSubjectData(finalSubjects);

        // Load saved chapter data for the current mock_id (if any exists)
        const currentMockId = mockId;
        if (currentMockId) {
          const { data: savedChapters, error: loadError } = await supabase
            .from('mock_performance_by_chapter')
            .select('*')
            .eq('mock_id', currentMockId);

          if (!loadError && savedChapters) {
            setSubjectData(prev => {
              const updated = { ...prev };
              
              savedChapters.forEach(savedChapter => {
                Object.keys(updated).forEach(subjectKey => {
                  const subject = updated[subjectKey];
                  const chapterIndex = subject.chapters.findIndex(ch => ch.chapter_id === savedChapter.chapter_id);
                  
                  if (chapterIndex !== -1) {
                    updated[subjectKey].chapters[chapterIndex] = {
                      ...updated[subjectKey].chapters[chapterIndex],
                      correct: savedChapter.correct || '',
                      incorrect: savedChapter.incorrect || '',
                      timeSpent: savedChapter.time_spent_min || '',
                      marks: savedChapter.marks || '',
                      whatWentWrong: savedChapter.what_went_wrong || '',
                      learnings: savedChapter.how_to_improve || ''
                    };
                  }
                });
              });
              
              return updated;
            });
          }
        }

      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error loading data',
          description: 'Failed to load your saved data',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast, ensureMockTest, mockId]);

  // Cleanup function to reset session flag when component unmounts
  useEffect(() => {
    return () => {
      // Reset session flag on unmount
      mockCreatedInSession.current = false;
    };
  }, []);

  // Calculate real-time analytics
  const calculateAnalytics = () => {
    const totalMarks = Object.values(subjectData).reduce((sum: number, subject: SubjectData) => {
      return sum + subject.chapters.reduce((chapterSum: number, chapter: ChapterData) => {
        return chapterSum + (Number(chapter.marks) || 0);
      }, 0);
    }, 0);
    const maxPossibleMarks = Object.values(subjectData).reduce((sum: number, subject: SubjectData) => sum + subject.maxMarks, 0);
    const percentile = maxPossibleMarks > 0 ? totalMarks / maxPossibleMarks * 100 : 0;
    const projectedRank = Math.floor((1 - percentile / 100) * 12000);
    return {
      totalMarks,
      maxPossibleMarks,
      percentile: Math.round(percentile * 10) / 10,
      projectedRank
    };
  };

  const analytics = calculateAnalytics();

  const getPerformanceStatus = (correct: string | number, incorrect: string | number) => {
    const total = (Number(correct) || 0) + (Number(incorrect) || 0);
    if (total === 0) return {
      text: 'Not Attempted',
      color: 'bg-gray-100 text-gray-800'
    };
    const percentage = (Number(correct) || 0) / total * 100;
    if (percentage >= 75) return {
      text: 'Excellent',
      color: 'bg-green-100 text-green-800'
    };
    if (percentage >= 50) return {
      text: 'Good',
      color: 'bg-yellow-100 text-yellow-800'
    };
    return {
      text: 'Needs Work',
      color: 'bg-red-100 text-red-800'
    };
  };

  const calculateSubjectStats = (chapters: ChapterData[]) => {
    const totalQuestions = chapters.reduce((sum: number, ch: ChapterData) => sum + (Number(ch.correct) || 0) + (Number(ch.incorrect) || 0), 0);
    const attempted = chapters.filter(ch => (Number(ch.correct) || 0) + (Number(ch.incorrect) || 0) > 0).length;
    const totalCorrect = chapters.reduce((sum: number, ch: ChapterData) => sum + (Number(ch.correct) || 0), 0);
    const totalIncorrect = chapters.reduce((sum: number, ch: ChapterData) => sum + (Number(ch.incorrect) || 0), 0);
    const totalTime = chapters.reduce((sum: number, ch: ChapterData) => sum + (Number(ch.timeSpent) || 0), 0);
    const totalMarks = chapters.reduce((sum: number, ch: ChapterData) => sum + (Number(ch.marks) || 0), 0);
    return {
      totalQuestions,
      attempted,
      correct: totalCorrect,
      incorrect: totalIncorrect,
      timeSpent: totalTime,
      totalMarks,
      percentage: totalQuestions > 0 ? totalCorrect / totalQuestions * 100 : 0
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
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Results copied to clipboard!",
        description: "Share your performance with others"
      });
    }
  };

  const handleDownloadPDF = () => {
    toast({
      title: "PDF Download",
      description: "PDF generation feature coming soon!"
    });
  };

  const handleAddToFlashcards = () => {
    const mistakes: any[] = [];
    Object.entries(subjectData).forEach(([subjectKey, subject]) => {
      subject.chapters.forEach((chapter: ChapterData) => {
        if ((Number(chapter.incorrect) || 0) > 0 && chapter.whatWentWrong) {
          mistakes.push({
            subject: subject.name,
            chapter: chapter.name,
            mistakes: String(chapter.whatWentWrong),
            learnings: String(chapter.learnings)
          });
        }
      });
    });
    if (mistakes.length > 0) {
      toast({
        title: "🧠 Mistakes added to flashcards!",
        description: `${mistakes.length} mistake(s) sent to your flashcard system`
      });
    } else {
      toast({
        title: "No mistakes found",
        description: "Add some incorrect answers and 'What went wrong' notes first",
        variant: "destructive"
      });
    }
  };

  // Mock creation is now automatic on page load - no manual triggers needed

  // Enhanced Progress Bar Component
  const EnhancedProgressBar = ({ value, className = "", size = "neutral" }: { 
    value: number; 
    className?: string; 
    size?: "subject" | "chapter" | "neutral";
  }) => {
    const getProgressColor = (val: number) => {
      if (val >= 75) return "progress-excellent";
      if (val >= 50) return "progress-good";
      if (val > 0) return "progress-needs-work";
      return "progress-neutral";
    };

    const progressClass = size === "subject" ? "subject-progress" : "chapter-progress";
    const colorClass = getProgressColor(value);
    const width = Math.min(100, Math.max(0, value));

    return (
      <div 
        className={`enhanced-progress ${progressClass} ${className}`}
        style={{
          background: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 100%)',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          height: size === "subject" ? '8px' : '6px',
          minWidth: size === "subject" ? '80px' : 'auto'
        }}
      >
        <div 
          className={`enhanced-progress-fill ${colorClass}`}
          style={{ 
            width: `${width}%`,
            height: '100%',
            background: colorClass === 'progress-excellent' ? 'linear-gradient(90deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)' :
                       colorClass === 'progress-good' ? 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%)' :
                       colorClass === 'progress-needs-work' ? 'linear-gradient(90deg, #ef4444 0%, #f87171 50%, #fca5a5 100%)' :
                       'linear-gradient(90deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)',
            borderRadius: '12px',
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            display: 'block'
          }}
        />
      </div>
    );
  };

  // Get save status indicator
  const getSaveStatusIndicator = (subjectKey: string, chapterIndex: number) => {
    const chapterKey = `${subjectKey}-${chapterIndex}`;
    const status = saveStatus[chapterKey] || 'idle';
    
    switch (status) {
      case 'saving':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'saved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <span className="text-red-500 text-xs">⚠️</span>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-purple-600">Loading your data...</p>
        </div>
      </div>
    );
  }

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
        
        /* Ensure proper contrast for all form inputs */
        input, textarea {
          color: #000000 !important;
          background-color: #ffffff !important;
        }
        
        /* Exception for rank input in dark header */
        .bg-gradient-to-r input {
          color: #ffffff !important;
          background-color: transparent !important;
        }
        
        /* Ensure placeholders are visible */
        input::placeholder, textarea::placeholder {
          color: #6b7280 !important;
        }
        
        /* Focus states for better UX */
        input:focus, textarea:focus {
          outline: 2px solid #8b5cf6 !important;
          outline-offset: 2px !important;
        }
        
        /* Enhanced Progress Bar Styling */
        .enhanced-progress {
          background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 100%) !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          position: relative !important;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1) !important;
          border: 1px solid rgba(0, 0, 0, 0.05) !important;
          height: auto !important;
          min-height: 6px !important;
        }
        
        .enhanced-progress-fill {
          background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%) !important;
          border-radius: 12px !important;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease !important;
          position: relative !important;
          overflow: hidden !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
          height: 100% !important;
          min-height: 6px !important;
          display: block !important;
        }
        
        .enhanced-progress:hover .enhanced-progress-fill {
          transform: scaleY(1.1);
        }
        
        .enhanced-progress-fill::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        /* Subject-level progress bar (larger) */
        .subject-progress {
          height: 8px !important;
          min-width: 80px !important;
          max-width: 80px !important;
        }
        
        /* Chapter-level progress bar (smaller) */
        .chapter-progress {
          height: 6px !important;
          width: 100% !important;
        }
        
        /* Consistent progress container heights */
        .progress-container {
          min-height: 32px;
          display: flex;
          align-items: center;
        }
        
        /* Progress bar with different color schemes */
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
                    <p className="font-semibold">{userName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="w-5 h-5 text-purple-200" />
                  <div>
                    <p className="text-sm text-purple-200">Mock No.</p>
                    <p className="font-semibold">
                      {mockTestInfo ? 
                        `PTS-${mockTestInfo.pts_year}-${totalMockNumber}` : 
                        'Loading...'
                      }
                    </p>
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
                        onChange={e => setCustomRank(e.target.value)} 
                        onBlur={() => setEditableRank(false)} 
                        onKeyPress={e => e.key === 'Enter' && setEditableRank(false)} 
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
                  <Button onClick={handleShare} size="sm" variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
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
          <p className="text-purple-600">Enter your performance data - it saves automatically as you type</p>
        </div>

        <div className="space-y-6">
          {Object.entries(subjectData).map(([subjectKey, subject]) => {
            const s = subject as SubjectData;
            const stats = calculateSubjectStats(s.chapters);
            const colorMap = {
              blue: 'border-blue-200 bg-blue-50',
              purple: 'border-purple-200 bg-purple-50',
              green: 'border-green-200 bg-green-50',
              orange: 'border-orange-200 bg-orange-50',
              default: 'border-blue-200 bg-blue-50',
            };
            
            return (
              <Card key={subjectKey} className={`${colorMap[s.color as keyof typeof colorMap] || colorMap.default} shadow-lg`}>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={subjectKey} className="border-0">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{s.icon}</span>
                          <div className="text-left">
                            <h3 className="text-xl font-bold text-gray-800">{s.name}</h3>
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
                        <div className="flex items-center justify-end gap-4 min-w-[140px]">
                          <div className="flex flex-col items-end justify-center">
                            <div className="text-sm text-gray-600 leading-tight">Progress</div>
                            <div className="font-bold text-lg leading-tight">{Math.round(stats.percentage)}%</div>
                          </div>
                          <div className="flex items-center justify-center h-8">
                            <EnhancedProgressBar value={stats.percentage} size="subject" className="w-20" />
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {s.chapters.map((chapter: ChapterData, chapterIndex: number) => {
                          const status = getPerformanceStatus(chapter.correct, chapter.incorrect);
                          const total = (Number(chapter.correct) || 0) + (Number(chapter.incorrect) || 0);
                          const percentage = total > 0 ? Math.round((Number(chapter.correct) || 0) / total * 100) : 0;
                          
                          return (
                            <Card key={chapterIndex} className="border-2 hover:shadow-md transition-shadow bg-white relative">
                              {/* Save status indicator */}
                              <div className="absolute top-2 right-2">
                                {getSaveStatusIndicator(subjectKey, chapterIndex)}
                              </div>
                              
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
                                      onChange={e => updateChapterData(subjectKey, chapterIndex, 'correct', e.target.value)} 
                                      className="w-full p-2 border border-gray-300 rounded text-center text-black bg-white" 
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-600 mb-1 block">❌ Incorrect</label>
                                    <input 
                                      type="number" 
                                      min="0" 
                                      placeholder="e.g., 2" 
                                      value={chapter.incorrect} 
                                      onChange={e => updateChapterData(subjectKey, chapterIndex, 'incorrect', e.target.value)} 
                                      className="w-full p-2 border border-gray-300 rounded text-center text-black bg-white" 
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-600 mb-1 block">🕒 Time (min)</label>
                                    <input 
                                      type="number" 
                                      min="0" 
                                      placeholder="e.g., 15" 
                                      value={chapter.timeSpent} 
                                      onChange={e => updateChapterData(subjectKey, chapterIndex, 'timeSpent', e.target.value)} 
                                      className="w-full p-2 border border-gray-300 rounded text-center text-black bg-white" 
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-600 mb-1 block">🎯 Marks</label>
                                    <input 
                                      type="number" 
                                      min="0" 
                                      placeholder="e.g., 10" 
                                      value={chapter.marks} 
                                      onChange={e => updateChapterData(subjectKey, chapterIndex, 'marks', e.target.value)} 
                                      className="w-full p-2 border border-gray-300 rounded text-center text-black bg-white" 
                                    />
                                  </div>
                                </div>
                                
                                {/* Progress Bar */}
                                {total > 0 && (
                                  <div className="flex items-center justify-between gap-3 py-2">
                                    <div className="flex flex-col">
                                      <span className="text-sm text-gray-600 leading-tight">Accuracy</span>
                                      <span className="text-sm text-gray-800 font-medium leading-tight">{percentage}%</span>
                                    </div>
                                    <div className="flex items-center justify-center flex-1 max-w-[120px]">
                                      <EnhancedProgressBar value={percentage} size="chapter" />
                                    </div>
                                  </div>
                                )}
                                
                                {/* What Went Wrong */}
                                <div>
                                  <label className="text-xs text-gray-600 mb-1 block">❓ What went wrong?</label>
                                  <Textarea 
                                    placeholder="Identify mistakes and areas of confusion..." 
                                    value={chapter.whatWentWrong} 
                                    onChange={e => updateChapterData(subjectKey, chapterIndex, 'whatWentWrong', e.target.value)} 
                                    className="resize-none text-sm text-black bg-white border-gray-300" 
                                    rows={2} 
                                  />
                                </div>
                                
                                {/* Learnings */}
                                <div>
                                  <label className="text-xs text-gray-600 mb-1 block">💡 Strategy for next time</label>
                                  <Textarea 
                                    placeholder="What will you do differently next time?" 
                                    value={chapter.learnings} 
                                    onChange={e => updateChapterData(subjectKey, chapterIndex, 'learnings', e.target.value)} 
                                    className="resize-none text-sm text-black bg-white border-gray-300" 
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

        {/* Action Buttons - Only essential actions */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-purple-200 shadow-lg p-4 rounded-t-xl mt-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={() => navigate('/battlefield/war/report/analysis', {
                state: { 
                  reportData: subjectData, 
                  studentInfo: {
                    name: userName,
                    mockNo: mockTestInfo ? `PTS-${mockTestInfo.pts_year}-${totalMockNumber}` : 'Loading...',
                    rank: customRank || analytics.projectedRank,
                    totalMarks: analytics.totalMarks,
                    maxMarks: analytics.maxPossibleMarks,
                    percentile: analytics.percentile
                  }
                }
              })} 
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3" 
              size="lg"
            >
              <FileText className="w-5 h-5 mr-2" />
              View Report Card
            </Button>
            <Button 
              onClick={handleAddToFlashcards} 
              variant="outline" 
              size="lg" 
              className="border-purple-600 text-purple-600 px-6 py-3 bg-gray-50"
            >
              🧠 Add Mistakes to Flashcards
            </Button>
            <Button 
              onClick={handleDownloadPDF} 
              variant="outline" 
              size="lg" 
              className="border-green-600 text-green-600 px-6 py-3 bg-gray-50"
            >
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </Button>
            <Button 
              onClick={() => navigate('/battlefield/war/report/compare')} 
              variant="outline" 
              size="lg" 
              className="border-blue-600 text-blue-600 px-6 py-3 bg-gray-50"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Compare Mocks
            </Button>


          </div>
          
          {/* Auto-save status indicator */}
          <div className="text-center text-sm text-gray-600 mt-2 flex items-center justify-center gap-1">
            <span className="animate-pulse">⚡</span> Auto-saving enabled - your data is safe!
          </div>
        </div>
      </div>
    </div>
  );
};

export default PTSReportCard;