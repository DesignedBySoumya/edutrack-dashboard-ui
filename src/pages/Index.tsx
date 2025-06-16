
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
      name: "Indian and World Geography",
      progress: 8,
      timeSpent: "9h 01m",
      color: "green",
      isPlaying: false
    },
    {
      id: 3,
      name: "Indian Economy",
      progress: 33,
      timeSpent: "1h 00m",
      color: "purple",
      isPlaying: false
    }
  ];

  const handlePlayPause = (id: number) => {
    console.log(`Play/Pause subject ${id}`);
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
          />
        ))}
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;
