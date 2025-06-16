
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
      isPlaying: false
    },
    {
      id: 2,
      name: "Indian Economy",
      progress: 8,
      timeSpent: "18h 45m",
      color: "green",
      isPlaying: false
    },
    {
      id: 3,
      name: "Modern Indian History",
      progress: 33,
      timeSpent: "42h 30m",
      color: "purple",
      isPlaying: true
    },
    {
      id: 4,
      name: "Geography of India",
      progress: 15,
      timeSpent: "22h 15m",
      color: "orange",
      isPlaying: false
    },
    {
      id: 5,
      name: "Environment and Ecology",
      progress: 7,
      timeSpent: "12h 20m",
      color: "teal",
      isPlaying: false
    },
    {
      id: 6,
      name: "Science and Technology",
      progress: 25,
      timeSpent: "35h 10m",
      color: "pink",
      isPlaying: false
    }
  ];

  const handlePlayPause = (id: number) => {
    console.log(`Play/Pause subject ${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <Header />
      
      {/* Date Timeline and Summary */}
      <div className="px-4 py-6">
        <div className="flex justify-between items-start mb-6">
          <DateTimeline selectedDate={selectedDate} onDateSelect={setSelectedDate} />
          <SummaryBox />
        </div>
        
        {/* Subject Tabs */}
        <SubjectTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Subject Cards */}
        <div className="space-y-4 mt-6">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onPlayPause={() => handlePlayPause(subject.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;
