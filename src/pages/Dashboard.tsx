
import React, { useState } from 'react';
import { StreakHeatmap } from "@/components/dashboard/StreakHeatmap";
import { PerformanceInsights } from "@/components/dashboard/PerformanceInsights";
import { WeeklyProgress } from "@/components/dashboard/WeeklyProgress";
import { SubjectList } from "@/components/SubjectList";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { Header } from "@/components/Header";

interface Subject {
  id: number;
  name: string;
  progress: number;
  timeSpent: string;
  color: string;
  isPlaying: boolean;
  chapters?: Array<{
    id: number;
    name: string;
    progress: number;
    topics: Array<{
      id: number;
      name: string;
      isCompleted: boolean;
      timeSpent?: string;
    }>;
  }>;
}

const DashboardPage = () => {
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: 1,
      name: "Indian Polity and Governance",
      progress: 75,
      timeSpent: "2h 30m",
      color: "blue",
      isPlaying: false,
      chapters: [
        {
          id: 1,
          name: "Constitutional Framework",
          progress: 85,
          topics: [
            { id: 1, name: "Fundamental Rights", isCompleted: true, timeSpent: "45m" },
            { id: 2, name: "Directive Principles", isCompleted: true, timeSpent: "30m" },
            { id: 3, name: "Fundamental Duties", isCompleted: false }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Modern Indian History",
      progress: 60,
      timeSpent: "1h 45m",
      color: "green",
      isPlaying: false,
      chapters: [
        {
          id: 1,
          name: "Freedom Struggle",
          progress: 70,
          topics: [
            { id: 1, name: "1857 Revolt", isCompleted: true, timeSpent: "25m" },
            { id: 2, name: "Gandhi Era", isCompleted: false }
          ]
        }
      ]
    },
    {
      id: 3,
      name: "Geography",
      progress: 45,
      timeSpent: "3h 15m",
      color: "purple",
      isPlaying: false,
      chapters: [
        {
          id: 1,
          name: "Physical Geography",
          progress: 50,
          topics: [
            { id: 1, name: "Climate", isCompleted: true, timeSpent: "40m" },
            { id: 2, name: "Landforms", isCompleted: false }
          ]
        }
      ]
    }
  ]);

  const handlePlaySubject = (subjectId: number) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (subject) {
      setActiveSubject(subject);
      setIsStudyMode(true);
    }
  };

  const handleBackToSubjects = () => {
    setIsStudyMode(false);
    setActiveSubject(null);
  };

  const handleUpdateSubject = (updatedSubject: Subject) => {
    setSubjects(prev => prev.map(s => s.id === updatedSubject.id ? updatedSubject : s));
  };

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">UPSC Study Dashboard</h1>
          <p className="text-gray-400 text-sm sm:text-base">Transform your preparation with data-driven insights</p>
        </div>

        {isStudyMode && activeSubject ? (
          // Show Pomodoro Timer when in study mode
          <PomodoroTimer
            subjectName={activeSubject.name}
            subjectProgress={activeSubject.progress}
            onBack={handleBackToSubjects}
          />
        ) : (
          // Show normal dashboard when not in study mode
          <div className="space-y-6 lg:space-y-8">
            <StreakHeatmap />
            <PerformanceInsights />
            <WeeklyProgress />
            
            {/* Subject Cards */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-6">Your Study Subjects</h2>
              <SubjectList
                subjects={subjects}
                onPlaySubject={handlePlaySubject}
                onUpdateSubject={handleUpdateSubject}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
