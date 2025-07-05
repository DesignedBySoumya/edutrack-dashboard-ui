import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { DateTimeline } from '@/components/DateTimeline';
import { SubjectCard } from '@/components/SubjectCard';
import { BottomNav } from '@/components/BottomNav';
import { SummaryBox } from '@/components/SummaryBox';
import { StudySession } from '@/components/StudySession';
import { useToast } from '@/hooks/use-toast';
import { Crown } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

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
  const [selectedDate, setSelectedDate] = useState('2');
  const [activeTab, setActiveTab] = useState('all');
  const [activeStudySubject, setActiveStudySubject] = useState<Subject | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(() => {
    const saved = localStorage.getItem('selectedExamId');
    return saved ? parseInt(saved) : null;
  });

  // Fetch subjects from Supabase
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        
        // Get subjects (all subjects are linked to exam_id: 1 for now)
        const { data: subjectsData, error: subjectsError } = await supabase
          .from('subjects')
          .select('*')
          .order('order_index', { ascending: true });

        if (subjectsError) {
          console.error('Error fetching subjects:', subjectsError);
          return;
        }

        console.log('Subjects data:', subjectsData);

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

                  return {
                    id: chapter.id,
                    name: chapter.name,
                    progress: chapter.progress || 0,
                    topics: (subtopicsData || []).map((subtopic: any) => ({
                      id: subtopic.id,
                      name: subtopic.name,
                      isCompleted: subtopic.is_completed || false,
                      timeSpent: subtopic.time_spent || "0h 00m"
                    }))
                  };
                })
              );

              return {
                id: subject.id,
                name: subject.name,
                progress: 0,
                timeSpent: "0h 00m",
                color: subject.color || "blue",
                isPlaying: false,
                chapters: chaptersWithTopics
              };
            })
          );

          setSubjects(subjectsWithChapters);
        }
      } catch (error) {
        console.error('Error in fetchSubjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

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

  const handlePlayPause = (subjectId: number) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (subject) {
      // Start study session for this subject
      setActiveStudySubject(subject);
      
      // Update the subject's playing state
      setSubjects(prevSubjects => 
        prevSubjects.map(s => 
          s.id === subjectId 
            ? { ...s, isPlaying: true }
            : { ...s, isPlaying: false }
        )
      );
      
      console.log(`Started study session for ${subject.name}`);
    }
  };

  const handleEndStudySession = () => {
    if (activeStudySubject) {
      // Stop the study session
      setSubjects(prevSubjects => 
        prevSubjects.map(s => 
          s.id === activeStudySubject.id 
            ? { ...s, isPlaying: false }
            : s
        )
      );
      setActiveStudySubject(null);
      console.log('Ended study session');
    }
  };

  const handleAddTopic = (subjectId: number, chapterId: number) => {
    console.log(`Add new topic to subject ${subjectId}, chapter ${chapterId}`);
  };

  const handleToggleTopic = (subjectId: number, chapterId: number, topicId: number) => {
    const subject = subjects.find(s => s.id === subjectId);
    const chapter = subject?.chapters?.find(c => c.id === chapterId);
    const topic = chapter?.topics.find(t => t.id === topicId);
    
    if (topic) {
      console.log(`${topic.isCompleted ? 'Unchecked' : 'Completed'} topic: ${topic.name}`);
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
      
      {/* Conditional Rendering: Study Session or Subject List */}
      {activeStudySubject ? (
        <StudySession 
          subject={activeStudySubject} 
          onBack={handleEndStudySession}
        />
      ) : (
        <>
          {/* Summary Box with Filters and Stats */}
          <SummaryBox activeTab={activeTab} onTabChange={setActiveTab} />
          
          {/* Subject Cards */}
          <div className="pb-4">
            {loading ? (
              <p className="text-center text-white">Loading subjects...</p>
            ) : subjects.length === 0 ? (
              <p className="text-center text-white">No subjects found. Add one!</p>
            ) : (
              subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  onPlayPause={handlePlayPause}
                  onAddTopic={handleAddTopic}
                  onToggleTopic={handleToggleTopic}
                  onUpdateSubject={handleUpdateSubject}
                />
              ))
            )}

            {/* Add New Subject Button */}
            <div className="mx-6 mt-4">
              <button
                onClick={handleAddNewSubject}
                className="flex items-center justify-center space-x-3 w-full bg-[#4263FF] hover:bg-[#3651E6] text-white font-semibold text-base px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg"
              >
                <span>Add New Subject</span>
                <Crown className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;
