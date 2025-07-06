import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { DateTimeline } from '@/components/DateTimeline';
import { StudySession } from '@/components/StudySession';
import { supabase } from '@/lib/supabaseClient';

interface Subject {
  id: number;
  name: string;
  progress: number;
  timeSpent: string;
  color: string;
  isPlaying: boolean;
  chapters?: any[];
}

interface StudyStats {
  timeSpentToday: number;
  timeSpentTotal: number;
  studyStreak: number;
  completedChapters: number;
  totalChapters: number;
}

const PomodoroPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [studyStats, setStudyStats] = useState<StudyStats>({
    timeSpentToday: 0,
    timeSpentTotal: 0,
    studyStreak: 0,
    completedChapters: 0,
    totalChapters: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());

  const subjectId = searchParams.get('subject_id');

  useEffect(() => {
    const fetchSubjectAndStats = async () => {
      if (!subjectId) {
        setLoading(false);
        return;
      }

      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error('User not authenticated:', userError);
          setLoading(false);
          return;
        }

        // Fetch subject data
        const { data: subjectData, error: subjectError } = await supabase
          .from('subjects')
          .select('*')
          .eq('id', subjectId)
          .single();

        if (subjectError) {
          console.error('Error fetching subject:', subjectError);
          setLoading(false);
          return;
        }

        if (subjectData) {
          // Fetch chapters for this subject
          const { data: chaptersData, error: chaptersError } = await supabase
            .from('chapters')
            .select('*')
            .eq('subject_id', subjectId);

          if (chaptersError) {
            console.error('Error fetching chapters:', chaptersError);
          }

          // Fetch user's study sessions for today
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);

          const { data: todaySessions, error: sessionsError } = await supabase
            .from('user_daily_study_sessions')
            .select('*')
            .eq('user_id', user.id)
            .eq('subject_id', subjectId)
            .gte('started_at', today.toISOString())
            .lt('started_at', tomorrow.toISOString());

          if (sessionsError) {
            console.error('Error fetching today sessions:', sessionsError);
          }

          // Calculate time spent today
          const timeSpentToday = todaySessions?.reduce((total, session: any) => {
            const startTime = new Date(session.started_at as string);
            const endTime = session.ended_at ? new Date(session.ended_at as string) : new Date();
            return total + Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
          }, 0) || 0;

          // Fetch all sessions for total time calculation
          const { data: allSessions, error: allSessionsError } = await supabase
            .from('user_daily_study_sessions')
            .select('*')
            .eq('user_id', user.id)
            .eq('subject_id', subjectId);

          if (allSessionsError) {
            console.error('Error fetching all sessions:', allSessionsError);
          }

          // Calculate total time spent
          const timeSpentTotal = allSessions?.reduce((total, session: any) => {
            const startTime = new Date(session.started_at as string);
            const endTime = session.ended_at ? new Date(session.ended_at as string) : new Date();
            return total + Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
          }, 0) || 0;

          // Calculate study streak (simplified - count consecutive days with sessions)
          const { data: streakData, error: streakError } = await supabase
            .from('user_daily_study_sessions')
            .select('started_at')
            .eq('user_id', user.id)
            .eq('subject_id', subjectId)
            .order('started_at', { ascending: false })
            .limit(30); // Check last 30 days

          if (streakError) {
            console.error('Error fetching streak data:', streakError);
          }

          // Calculate streak (simplified algorithm)
          let studyStreak = 0;
          if (streakData && streakData.length > 0) {
            const uniqueDates = [...new Set(streakData.map((s: any) => 
              new Date(s.started_at as string).toDateString()
            ))].sort().reverse();
            
            let currentStreak = 0;
            const today = new Date().toDateString();
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            
            for (let i = 0; i < uniqueDates.length; i++) {
              const date = uniqueDates[i];
              if (date === today || date === yesterday || 
                  new Date(date) > new Date(Date.now() - (currentStreak + 1) * 86400000)) {
                currentStreak++;
              } else {
                break;
              }
            }
            studyStreak = currentStreak;
          }

          // Calculate progress based on completed subtopics (same as Index page)
          let totalTopics = 0;
          let completedTopics = 0;
          
          if (chaptersData && chaptersData.length > 0) {
            // Get current user for progress calculation
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            let userProgress: any[] = [];
            
            if (!userError && user) {
              const { data: progressData, error: progressError } = await supabase
                .from('user_subtopic_progress')
                .select('*')
                .eq('user_id', user.id);

              if (!progressError) {
                userProgress = progressData || [];
              }
            }

            // Calculate progress for each chapter
            for (const chapter of chaptersData) {
              const { data: subtopicsData, error: subtopicsError } = await supabase
                .from('subtopics')
                .select('*')
                .eq('chapter_id', chapter.id);

              if (!subtopicsError && subtopicsData) {
                totalTopics += subtopicsData.length;
                
                // Count completed subtopics
                for (const subtopic of subtopicsData) {
                  const userSubtopicProgress = userProgress.find(p => p.subtopic_id === subtopic.id);
                  if (userSubtopicProgress?.is_completed) {
                    completedTopics++;
                  }
                }
              }
            }
          }

          // Calculate progress percentage
          const subjectProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

          // Set subject data
          setSubject({
            id: subjectData.id,
            name: subjectData.name,
            progress: subjectProgress, // Use calculated progress instead of subjectData.progress
            timeSpent: formatTimeSpent(timeSpentTotal),
            color: subjectData.color || '#f97316',
            isPlaying: false,
            chapters: chaptersData || []
          });

          // Set study stats
          setStudyStats({
            timeSpentToday,
            timeSpentTotal,
            studyStreak,
            completedChapters: completedTopics,
            totalChapters: totalTopics
          });
        }
      } catch (error) {
        console.error('Error fetching subject and stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectAndStats();
  }, [subjectId]);

  // Helper function to format time spent
  const formatTimeSpent = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
  };

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="flex items-center justify-center h-screen">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-center">
            <h2 className="text-xl font-semibold mb-2">Subject not found</h2>
            <p className="text-gray-400 mb-4">The subject you're looking for doesn't exist.</p>
            <button
              onClick={handleBack}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to subjects
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <Header selectedExamId={null} onExamChange={() => {}} />
      
      {/* DateTimeline */}
      <DateTimeline 
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
      
      {/* StudySession */}
      <StudySession 
        subject={subject}
        onBack={handleBack}
        studyStats={studyStats}
      />
    </div>
  );
};

export default PomodoroPage; 