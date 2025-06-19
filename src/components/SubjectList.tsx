
import React from 'react';
import { SubjectCard } from './SubjectCard';

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

interface SubjectListProps {
  subjects: Subject[];
  onPlaySubject: (subjectId: number) => void;
  onUpdateSubject: (updatedSubject: Subject) => void;
}

export const SubjectList = ({ subjects, onPlaySubject, onUpdateSubject }: SubjectListProps) => {
  const handlePlayPause = (subjectId: number) => {
    onPlaySubject(subjectId);
  };

  return (
    <div className="space-y-6">
      {subjects.map((subject) => (
        <SubjectCard
          key={subject.id}
          subject={subject}
          onPlayPause={handlePlayPause}
          onUpdateSubject={onUpdateSubject}
        />
      ))}
    </div>
  );
};
