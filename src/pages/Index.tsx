
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { DateTimeline } from '@/components/DateTimeline';
import { SubjectTabs } from '@/components/SubjectTabs';
import { SubjectCard } from '@/components/SubjectCard';
import { BottomNav } from '@/components/BottomNav';
import { SummaryBox } from '@/components/SummaryBox';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState('2');
  const [activeTab, setActiveTab] = useState('all');

  const subjects = [
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
  ];

  const handlePlayPause = (id: number) => {
    console.log(`Play/Pause subject ${id}`);
  };

  const handleAddTopic = (subjectId: number, chapterId: number) => {
    console.log(`Add new topic to subject ${subjectId}, chapter ${chapterId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <Header />
      
      {/* Date Timeline */}
      <DateTimeline selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      
      {/* Summary Box */}
      <SummaryBox />
      
      {/* Subject Tabs */}
      <SubjectTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Subject Cards */}
      <div className="pb-4">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            onPlayPause={() => handlePlayPause(subject.id)}
            onAddTopic={handleAddTopic}
          />
        ))}
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;
