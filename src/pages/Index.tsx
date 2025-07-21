import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { DateTimeline } from '@/components/DateTimeline';
import { SubjectCard } from '@/components/SubjectCard';
import { BottomNav } from '@/components/BottomNav';
import { SummaryBox } from '@/components/SummaryBox';
import { useToast } from '@/hooks/use-toast';
import { Crown } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LoginForm } from '@/components/LoginForm';

interface Topic {
  id: number;
  name: string;
  isCompleted: boolean;
  timeSpent?: string;
}

interface Chapter {
  id: number;
  name: string;
  progress: number;
  topics: Topic[];
}

interface Subject {
  id: number;
  name: string;
  progress: number;
  timeSpent: string;
  color: string;
  isPlaying: boolean;
  chapters?: Chapter[];
}

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('2');
  const [activeTab, setActiveTab] = useState('all');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(() => {
    const saved = localStorage.getItem('selectedExamId');
    return saved ? parseInt(saved) : null;
  });
  
  // Summary statistics state
  const [summaryStats, setSummaryStats] = useState({
    totalSubjects: 0,
    dueSubjects: 0,
    completionPercentage: 0,
    totalTimeSpent: "0h 00m"
  });

  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);


  // Fetch subjects from Supabase
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        
        // Get subjects for the selected exam
        const examIdToUse = selectedExamId || 1; // Default to exam_id 1 if none selected
        
        if (!selectedExamId) {
          console.warn("No selectedExamId found — defaulting to exam_id 1");
        }
        
        console.log('Fetching subjects for exam:', examIdToUse);
        
        const { data: subjectsData, error: subjectsError } = await supabase
          .from('subjects')
          .select('*')
          .eq('exam_id', examIdToUse)
          .order('order_index', { ascending: true });

        if (subjectsError) {
          console.error('Error fetching subjects:', subjectsError);
          return;
        }

        console.log('Subjects data:', subjectsData);

        // Get current user's progress
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        let userProgress: any[] = [];
        
        if (!userError && user) {
          const { data: progressData, error: progressError } = await supabase
            .from('user_subtopic_progress')
            .select('*')
            .eq('user_id', user.id);

          if (!progressError) {
            userProgress = progressData || [];
            console.log('User progress:', userProgress);
          } else {
            console.error('Error fetching user progress:', progressError);
          }
        }

        if (subjectsData) {
          // For each subject, get its chapters
          const subjectsWithChapters = await Promise.all(
            subjectsData.map(async (subject: any) => {
              const { data: chaptersData, error: chaptersError } = await supabase
                .from('chapters')
                .select('*')
                .eq('subject_id', subject.id)
                .order('name', { ascending: true });

              if (chaptersError) {
                console.error('Error fetching chapters for subject', subject.id, chaptersError);
                return {
                  id: subject.id,
                  name: subject.name,
                  progress: 0,
                  timeSpent: "0h 00m",
                  color: subject.color || "blue",
                  isPlaying: false,
                  chapters: []
                };
              }

              console.log(`Chapters for subject ${subject.name}:`, chaptersData);

              // Map chapters with subtopics
              const chaptersWithTopics = await Promise.all(
                (chaptersData || []).map(async (chapter: any) => {
                  // Get subtopics for this chapter
                  const { data: subtopicsData, error: subtopicsError } = await supabase
                    .from('subtopics')
                    .select('*')
                    .eq('chapter_id', chapter.id)
                    .order('name', { ascending: true });

                  if (subtopicsError) {
                    console.error('Error fetching subtopics for chapter', chapter.id, subtopicsError);
                    return {
                      id: chapter.id,
                      name: chapter.name,
                      progress: chapter.progress || 0,
                      topics: []
                    };
                  }

                  console.log(`Subtopics for chapter ${chapter.name}:`, subtopicsData);

                  // Map subtopics with user progress
                  const topicsWithProgress = (subtopicsData || []).map((subtopic: any) => {
                    // Find user's progress for this subtopic
                    const userSubtopicProgress = userProgress.find(p => p.subtopic_id === subtopic.id);
                    
                    return {
                      id: subtopic.id,
                      name: subtopic.name,
                      isCompleted: userSubtopicProgress?.is_completed || false,
                      timeSpent: userSubtopicProgress?.time_spent_minutes 
                        ? `${Math.floor(userSubtopicProgress.time_spent_minutes / 60)}h ${userSubtopicProgress.time_spent_minutes % 60}m`
                        : "0h 00m"
                    };
                  });

                  // Calculate chapter progress based on completed subtopics
                  const completedTopics = topicsWithProgress.filter(t => t.isCompleted).length;
                  const totalTopics = topicsWithProgress.length;
                  const chapterProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

                  return {
                    id: chapter.id,
                    name: chapter.name,
                    progress: chapterProgress,
                    topics: topicsWithProgress
                  };
                })
              );

              // Calculate subject progress based on completed subtopics across all chapters
              const allTopics = chaptersWithTopics.flatMap(ch => ch.topics);
              const totalSubjectTopics = allTopics.length;
              const completedSubjectTopics = allTopics.filter(t => t.isCompleted).length;
              const subjectProgress = totalSubjectTopics > 0 ? Math.round((completedSubjectTopics / totalSubjectTopics) * 100) : 0;

              return {
                id: subject.id,
                name: subject.name,
                progress: subjectProgress,
                timeSpent: "0h 00m", // TODO: Calculate total time spent
                color: subject.color || "blue",
                isPlaying: false,
                chapters: chaptersWithTopics
              };
            })
          );

          setSubjects(subjectsWithChapters);
          
          // Calculate and update summary statistics
          calculateSummaryStats(subjectsWithChapters).then(stats => {
            setSummaryStats(stats);
          });
        }
      } catch (error) {
        console.error('Error in fetchSubjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [selectedExamId]); // Re-fetch when exam selection changes

  // Calculate summary statistics
  const calculateSummaryStats = async (subjectsList: Subject[]) => {
    const totalSubjects = subjectsList.length;
    
    // Calculate completion percentage based on all topics across all subjects
    let totalTopics = 0;
    let completedTopics = 0;
    
    subjectsList.forEach(subject => {
      if (subject.chapters) {
        subject.chapters.forEach(chapter => {
          if (chapter.topics) {
            totalTopics += chapter.topics.length;
            completedTopics += chapter.topics.filter(topic => topic.isCompleted).length;
          }
        });
      }
    });
    
    const completionPercentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;
    
    // Calculate due subjects (subjects with progress < 100%)
    const dueSubjects = subjectsList.filter(subject => subject.progress < 100).length;
    
    // Fetch total time spent from study sessions
    let totalTimeSpent = "0h 00m";
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!userError && user) {
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('user_daily_study_sessions')
          .select('started_at, ended_at')
          .eq('user_id', user.id)
          .not('ended_at', 'is', null);

        if (!sessionsError && sessionsData) {
          let totalSeconds = 0;
          sessionsData.forEach(session => {
            if (session.started_at && session.ended_at) {
              const startTime = new Date(session.started_at);
              const endTime = new Date(session.ended_at);
              const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
              totalSeconds += duration;
            }
          });
          
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          totalTimeSpent = `${hours}h ${minutes.toString().padStart(2, '0')}m`;
        }
      }
    } catch (error) {
      console.error('Error fetching total time spent:', error);
    }
    
    return {
      totalSubjects,
      dueSubjects,
      completionPercentage,
      totalTimeSpent
    };
  };



  // Check for login success and show popup
  useEffect(() => {
    const loginSuccess = localStorage.getItem('loginSuccess');
    if (loginSuccess) {
      // Show success popup
      toast({
        title: "Welcome back!",
        description: "Thank you for signing in. You're all set to continue your studies.",
      });
      // Clear the flag
      localStorage.removeItem('loginSuccess');
    }
  }, [toast]);

  const handlePlayPause = async (subjectId: number) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (subject) {
      // Only navigate to pomodoro page - NO session start
      navigate(`/pomodoro?subject_id=${subjectId}`);
      console.log(`Navigating to pomodoro page for ${subject.name}`);
    }
  };



  const handleAddTopic = (subjectId: number, chapterId: number) => {
    console.log(`Add new topic to subject ${subjectId}, chapter ${chapterId}`);
  };

  const handleToggleTopic = async (subjectId: number, chapterId: number, topicId: number) => {
    try {
      const subject = subjects.find(s => s.id === subjectId);
      const chapter = subject?.chapters?.find(c => c.id === chapterId);
      const topic = chapter?.topics.find(t => t.id === topicId);
      
      if (topic) {
        console.log(`🔍 Toggle Debug:`);
        console.log(`  - Topic: ${topic.name} (ID: ${topicId})`);
        console.log(`  - Current isCompleted: ${topic.isCompleted}`);
        console.log(`  - Attempting to set to: ${!topic.isCompleted}`);
        console.log(`  - Action: ${topic.isCompleted ? 'Unchecking' : 'Checking'} topic`);
        console.log(`  - Checkbox State: ${topic.isCompleted ? 'CHECKED' : 'UNCHECKED'}`);
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error('User not authenticated:', userError);
          toast({
            title: "Authentication Error",
            description: "Please log in to save your progress",
            variant: "destructive",
          });
          return;
        }

        // Get existing progress to preserve time_spent_minutes
        const { data: existingProgress, error: fetchError } = await supabase
          .from('user_subtopic_progress')
          .select('time_spent_minutes')
          .eq('user_id', user.id)
          .eq('subtopic_id', topicId)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching existing progress:', fetchError);
        }

        // Save to user_subtopic_progress table
        const { error: upsertError } = await supabase
          .from('user_subtopic_progress')
          .upsert({
            user_id: user.id,
            subtopic_id: topicId,
            is_completed: !topic.isCompleted, // Toggle the completion status
            time_spent_minutes: existingProgress?.time_spent_minutes || 0, // Preserve existing time
            last_studied_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,subtopic_id'
          });

        if (upsertError) {
          console.error('Error saving progress:', upsertError);
          toast({
            title: "Save Error",
            description: "Failed to save your progress. Please try again.",
            variant: "destructive",
          });
          return;
        }

        // Small delay to ensure upsert has completed
        await new Promise(resolve => setTimeout(resolve, 100));

        // Refetch the updated progress to ensure we have the correct state
        const { data: updatedProgress, error: refetchError } = await supabase
          .from('user_subtopic_progress')
          .select('is_completed')
          .eq('user_id', user.id)
          .eq('subtopic_id', topicId)
          .maybeSingle();

        if (refetchError) {
          console.error('Error refetching progress:', refetchError);
        }

        // Use the refetched status or fallback to what we just tried to save
        const attemptedStatus = !topic.isCompleted;
        const newStatus = updatedProgress?.is_completed ?? attemptedStatus;
        console.log(`🔍 Refetch Debug: Attempted to save: ${attemptedStatus}`);
        console.log(`🔍 Refetch Debug: Supabase returned: ${updatedProgress?.is_completed}`);
        console.log(`🔍 Refetch Debug: Final status: ${newStatus}`);
        console.log(`🔍 Refetch Debug: Refetch error:`, refetchError);

        // Update local state to reflect the change and recalculate progress
        setSubjects(prevSubjects => {
          const updatedSubjects = prevSubjects.map(s => {
            if (s.id === subjectId) {
              const updatedChapters = s.chapters?.map(c => {
                if (c.id === chapterId) {
                  const updatedTopics = c.topics.map(t => {
                    if (t.id === topicId) {
                      return { ...t, isCompleted: newStatus };
                    }
                    return t;
                  });
                  
                  // Recalculate chapter progress
                  const completedTopics = updatedTopics.filter(t => t.isCompleted).length;
                  const totalTopics = updatedTopics.length;
                  const chapterProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
                  
                  return {
                    ...c,
                    progress: chapterProgress,
                    topics: updatedTopics
                  };
                }
                return c;
              });

              // Recalculate subject progress
              const allTopics = updatedChapters?.flatMap(ch => ch.topics) || [];
              const totalSubjectTopics = allTopics.length;
              const completedSubjectTopics = allTopics.filter(t => t.isCompleted).length;
              const subjectProgress = totalSubjectTopics > 0 ? Math.round((completedSubjectTopics / totalSubjectTopics) * 100) : 0;

              return {
                ...s,
                progress: subjectProgress,
                chapters: updatedChapters
              };
            }
            return s;
          });
          
          // Update summary statistics after subject changes
          calculateSummaryStats(updatedSubjects).then(stats => {
            setSummaryStats(stats);
          });
          
          return updatedSubjects;
        });

        toast({
          title: "Progress Saved",
          description: `${newStatus ? '✅ Completed' : '❌ Unchecked'} ${topic.name}`,
        });
        
        console.log(`🔍 Final Result: Checkbox is now ${newStatus ? 'CHECKED (Completed)' : 'UNCHECKED (Not Completed)'}`);
      }
    } catch (error) {
      console.error('Error toggling topic:', error);
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSubject = (updatedSubject: Subject) => {
    setSubjects(prevSubjects => 
      prevSubjects.map(subject => 
        subject.id === updatedSubject.id ? updatedSubject : subject
      )
    );
  };

  const handleAddNewSubject = () => {
    const subjectName = prompt('Enter new subject name:');
    if (subjectName && subjectName.trim()) {
      const newSubject: Subject = {
        id: Date.now(),
        name: subjectName.trim(),
        progress: 0,
        timeSpent: "0h 00m",
        color: "blue",
        isPlaying: false,
        chapters: []
      };
      setSubjects(prevSubjects => [...prevSubjects, newSubject]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-20 font-inter">
      {/* Header */}
      <Header selectedExamId={selectedExamId} onExamChange={setSelectedExamId} />
      
      {/* Date Timeline */}
      <DateTimeline selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      
      {/* Summary Box with Filters and Stats */}
      <SummaryBox 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        totalSubjects={summaryStats.totalSubjects}
        dueSubjects={summaryStats.dueSubjects}
        completionPercentage={summaryStats.completionPercentage}
        totalTimeSpent={summaryStats.totalTimeSpent}
      />
      
      {/* Subject Cards */}
      <div className="pb-4">
        {loading ? (
          <p className="text-center text-white">Loading subjects...</p>
        ) : subjects.length === 0 ? (
          <p className="text-center text-white">No subjects found. Add one!</p>
        ) : (
          subjects
            .filter(subject => {
              if (activeTab === 'all') return true;
              if (activeTab === 'due') return subject.progress < 100;
              return true;
            })
            .sort((a, b) => {
              // When "Due" is selected, sort by progress in ascending order (0% to 100%)
              if (activeTab === 'due') {
                return a.progress - b.progress;
              }
              // For "All", keep original order
              return 0;
            })
            .map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onPlayPause={(subjectId) => {
                  if (!user) {
                    setShowLoginModal(true);
                    return;
                  }
                  handlePlayPause(subjectId);
                }}
                onAddTopic={(subjectId, chapterId) => {
                  if (!user) {
                    setShowLoginModal(true);
                    return;
                  }
                  handleAddTopic(subjectId, chapterId);
                }}
                onToggleTopic={(subjectId, chapterId, topicId) => {
                  if (!user) {
                    setShowLoginModal(true);
                    return;
                  }
                  handleToggleTopic(subjectId, chapterId, topicId);
                }}
                onUpdateSubject={handleUpdateSubject}
              />
            ))
        )}

        {/* Add New Subject Button */}
        <div className="mx-6 mt-4">
          <button
            onClick={() => {
              if (!user) {
                setShowLoginModal(true);
                return;
              }
              handleAddNewSubject();
            }}
            className="flex items-center justify-center space-x-3 w-full bg-[#4263FF] hover:bg-[#3651E6] text-white font-semibold text-base px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg"
          >
            <span>Add New Subject</span>
            <Crown className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />

      {/* Login Modal for restricted actions */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent>
          <LoginForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
