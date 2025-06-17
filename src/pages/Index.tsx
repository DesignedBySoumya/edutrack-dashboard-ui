
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { DateTimeline } from '@/components/DateTimeline';
import { SubjectCard } from '@/components/SubjectCard';
import { BottomNav } from '@/components/BottomNav';
import { SummaryBox } from '@/components/SummaryBox';
import { Crown } from 'lucide-react';

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
  const [selectedDate, setSelectedDate] = useState('2');
  const [activeTab, setActiveTab] = useState('all');

  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: 1,
      name: "Indian Polity and Governance",
      progress: 11,
      timeSpent: "26h 09m",
      color: "blue",
      isPlaying: false,
      chapters: [
        {
          id: 1,
          name: "Historical Background",
          progress: 40,
          topics: [
            { id: 1, name: "Regulating Act 1773", isCompleted: true, timeSpent: "2h 30m" },
            { id: 2, name: "Charter Act 1833", isCompleted: true, timeSpent: "1h 45m" },
            { id: 3, name: "Government of India Act 1858", isCompleted: false }
          ]
        },
        {
          id: 2,
          name: "Constitution Framing",
          progress: 0,
          topics: [
            { id: 4, name: "Constituent Assembly", isCompleted: false },
            { id: 5, name: "Drafting Committee", isCompleted: false },
            { id: 6, name: "Key Features", isCompleted: false }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Indian and World Geography",
      progress: 8,
      timeSpent: "9h 01m",
      color: "green",
      isPlaying: false,
      chapters: [
        {
          id: 3,
          name: "Physical Geography",
          progress: 25,
          topics: [
            { id: 7, name: "Physiographic Divisions", isCompleted: true, timeSpent: "3h 00m" },
            { id: 8, name: "Drainage System", isCompleted: false },
            { id: 9, name: "Climate", isCompleted: false }
          ]
        },
        {
          id: 4,
          name: "Human Geography",
          progress: 0,
          topics: [
            { id: 10, name: "Population Distribution", isCompleted: false },
            { id: 11, name: "Agricultural Patterns", isCompleted: false }
          ]
        }
      ]
    },
    {
      id: 3,
      name: "Indian Economy",
      progress: 33,
      timeSpent: "1h 00m",
      color: "purple",
      isPlaying: false,
      chapters: [
        {
          id: 5,
          name: "Basic Concepts",
          progress: 60,
          topics: [
            { id: 12, name: "GDP vs GNP", isCompleted: true, timeSpent: "30m" },
            { id: 13, name: "Inflation Types", isCompleted: true, timeSpent: "25m" },
            { id: 14, name: "Monetary Policy", isCompleted: false }
          ]
        }
      ]
    }
  ]);

  const handlePlayPause = (subjectId: number) => {
    setSubjects(prevSubjects => 
      prevSubjects.map(subject => 
        subject.id === subjectId 
          ? { ...subject, isPlaying: !subject.isPlaying }
          : { ...subject, isPlaying: false } // Stop other subjects when one starts
      )
    );
    
    const subject = subjects.find(s => s.id === subjectId);
    if (subject) {
      console.log(`${subject.isPlaying ? 'Paused' : 'Started'} timer for ${subject.name}`);
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
    <div className="min-h-screen bg-slate-900 text-white pb-20 font-inter overflow-x-hidden">
      {/* Header */}
      <Header />
      
      {/* Date Timeline - Fixed positioning */}
      <div className="sticky top-0 z-10 bg-slate-900">
        <DateTimeline selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      </div>
      
      {/* Summary Box with Filters and Stats */}
      <SummaryBox activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Subject Cards Container - Responsive Grid */}
      <div className="px-4 sm:px-6 pb-4 max-w-[1440px] mx-auto">
        {/* Mobile & Tablet: Stacked layout */}
        <div className="block lg:hidden space-y-4">
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
          
          {/* Add New Subject Button - Mobile/Tablet */}
          <div className="mt-4">
            <button
              onClick={handleAddNewSubject}
              className="flex items-center justify-center space-x-3 w-full bg-[#4263FF] hover:bg-[#3651E6] text-white font-semibold text-base px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg"
            >
              <span>Add New Subject</span>
              <Crown className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desktop: 3-column grid layout */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
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
          
          {/* Add New Subject Button - Desktop */}
          <div className="flex items-center justify-center">
            <button
              onClick={handleAddNewSubject}
              className="flex items-center justify-center space-x-3 w-full bg-[#4263FF] hover:bg-[#3651E6] text-white font-semibold text-base px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg max-w-md"
            >
              <span>Add New Subject</span>
              <Crown className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;
