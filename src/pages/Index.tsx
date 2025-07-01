
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { DateTimeline } from '@/components/DateTimeline';
import { SubjectCard } from '@/components/SubjectCard';
import { BottomNav } from '@/components/BottomNav';
import { SummaryBox } from '@/components/SummaryBox';
import { StudySession } from '@/components/StudySession';
import { useToast } from '@/hooks/use-toast';
import { Crown } from 'lucide-react';
import examData from '@/data/examData.json';

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

const EXAM_OPTIONS = [
  'UPSC CSE',
  'SSC CGL',
  'IIT-JEE',
  'NEET',
  'GATE',
  'CAT',
  'CLAT',
  'Bank PO'
];

const Index = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState('2');
  const [activeTab, setActiveTab] = useState('all');
  const [activeStudySubject, setActiveStudySubject] = useState<Subject | null>(null);
  const [selectedExam, setSelectedExam] = useState<string>('UPSC CSE');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load exam data on component mount and when exam changes
  useEffect(() => {
    loadExamData(selectedExam);
  }, [selectedExam]);

  // Check for login success and show popup
  useEffect(() => {
    const loginSuccess = localStorage.getItem('loginSuccess');
    if (loginSuccess) {
      toast({
        title: "Welcome back!",
        description: "Thank you for signing in. You're all set to continue your studies.",
      });
      localStorage.removeItem('loginSuccess');
    }
  }, [toast]);

  // Load saved exam on component mount
  useEffect(() => {
    const savedExam = localStorage.getItem('selectedExam');
    if (savedExam && EXAM_OPTIONS.includes(savedExam)) {
      setSelectedExam(savedExam);
    }
  }, []);

  const loadExamData = async (examName: string) => {
    setIsLoading(true);
    try {
      // Simulate loading delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const examSubjects = examData[examName as keyof typeof examData] || [];
      setSubjects(examSubjects);
      
      // Reset active study session when switching exams
      setActiveStudySubject(null);
      
      toast({
        title: `${examName} loaded successfully!`,
        description: `Ready to study ${examSubjects.length} subjects.`,
      });
    } catch (error) {
      console.error('Error loading exam data:', error);
      toast({
        title: "Error loading exam data",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExamChange = (examName: string) => {
    if (examName !== selectedExam) {
      // Show confirmation if there's active progress
      const hasProgress = subjects.some(s => s.progress > 0);
      if (hasProgress) {
        const confirmed = window.confirm(
          `Switching to ${examName} will reset your current progress. Are you sure you want to continue?`
        );
        if (!confirmed) {
          setIsDropdownOpen(false);
          return;
        }
      }
      
      setSelectedExam(examName);
      setIsDropdownOpen(false);
      
      // Save selected exam to localStorage for persistence
      localStorage.setItem('selectedExam', examName);
    } else {
      setIsDropdownOpen(false);
    }
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handlePlayPause = (subjectId: number) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (subject) {
      setActiveStudySubject(subject);
      
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
      {/* Header with Exam Dropdown */}
      <Header 
        selectedExam={selectedExam}
        examOptions={EXAM_OPTIONS}
        isDropdownOpen={isDropdownOpen}
        onDropdownToggle={handleDropdownToggle}
        onExamChange={handleExamChange}
      />
      
      {/* Date Timeline */}
      <DateTimeline selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-slate-400">Loading {selectedExam} subjects...</p>
          </div>
        </div>
      )}
      
      {/* Conditional Rendering: Study Session or Subject List */}
      {!isLoading && (
        <>
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
                {subjects.map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                    onPlayPause={handlePlayPause}
                    onAddTopic={handleAddTopic}
                    onToggleTopic={handleToggleTopic}
                    onUpdateSubject={handleUpdateSubject}
                  />
                ))}

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
        </>
      )}
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;
