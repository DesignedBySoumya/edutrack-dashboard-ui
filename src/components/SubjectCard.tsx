
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { SubjectProgress } from './subject-card/SubjectProgress';
import { ChapterSection } from './subject-card/ChapterSection';
import { SubjectCardActions } from './subject-card/SubjectCardActions';
import { AddUnitButton } from './subject-card/AddUnitButton';

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

interface SubjectCardProps {
  subject: Subject;
  onPlayPause: (subjectId: number) => void;
  onAddTopic?: (subjectId: number, chapterId: number) => void;
  onToggleTopic?: (subjectId: number, chapterId: number, topicId: number) => void;
  onUpdateSubject?: (updatedSubject: Subject) => void;
}

export const SubjectCard = ({ 
  subject, 
  onPlayPause, 
  onAddTopic, 
  onToggleTopic,
  onUpdateSubject 
}: SubjectCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [localSubject, setLocalSubject] = useState(subject);
  const [activeTopicId, setActiveTopicId] = useState<number | null>(null);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleToggleChapter = (chapterId: number) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedSubject = { ...localSubject, isPlaying: !localSubject.isPlaying };
    setLocalSubject(updatedSubject);
    onPlayPause(localSubject.id);
    if (onUpdateSubject) {
      onUpdateSubject(updatedSubject);
    }
  };

  const handleAddUnit = (e: React.MouseEvent) => {
    e.stopPropagation();
    const unitName = prompt('Enter new unit name:');
    if (unitName && unitName.trim()) {
      const updatedSubject = { ...localSubject };
      const newChapter: Chapter = {
        id: Date.now(),
        name: unitName.trim(),
        progress: 0,
        topics: []
      };
      
      if (!updatedSubject.chapters) {
        updatedSubject.chapters = [];
      }
      updatedSubject.chapters.push(newChapter);
      setLocalSubject(updatedSubject);
      
      if (onUpdateSubject) {
        onUpdateSubject(updatedSubject);
      }
    }
  };

  const handleAddSubtopic = (chapterId: number) => {
    const topicName = prompt('Enter new subtopic name:');
    if (topicName && topicName.trim()) {
      const updatedSubject = { ...localSubject };
      const chapterIndex = updatedSubject.chapters?.findIndex(ch => ch.id === chapterId);
      
      if (chapterIndex !== undefined && chapterIndex >= 0 && updatedSubject.chapters) {
        const newTopic: Topic = {
          id: Date.now(),
          name: topicName.trim(),
          isCompleted: false
        };
        
        updatedSubject.chapters[chapterIndex].topics.push(newTopic);
        setLocalSubject(updatedSubject);
        
        if (onAddTopic) {
          onAddTopic(localSubject.id, chapterId);
        }
        if (onUpdateSubject) {
          onUpdateSubject(updatedSubject);
        }
      }
    }
  };

  const handleToggleTopic = (chapterId: number, topicId: number) => {
    const updatedSubject = { ...localSubject };
    const chapterIndex = updatedSubject.chapters?.findIndex(ch => ch.id === chapterId);
    
    if (chapterIndex !== undefined && chapterIndex >= 0 && updatedSubject.chapters) {
      const topicIndex = updatedSubject.chapters[chapterIndex].topics.findIndex(t => t.id === topicId);
      
      if (topicIndex >= 0) {
        updatedSubject.chapters[chapterIndex].topics[topicIndex].isCompleted = 
          !updatedSubject.chapters[chapterIndex].topics[topicIndex].isCompleted;
        
        // Update chapter progress
        const chapter = updatedSubject.chapters[chapterIndex];
        const completedTopics = chapter.topics.filter(t => t.isCompleted).length;
        chapter.progress = chapter.topics.length > 0 ? Math.round((completedTopics / chapter.topics.length) * 100) : 0;
        
        // Update overall subject progress
        const totalTopics = updatedSubject.chapters.reduce((sum, ch) => sum + ch.topics.length, 0);
        const totalCompleted = updatedSubject.chapters.reduce((sum, ch) => 
          sum + ch.topics.filter(t => t.isCompleted).length, 0);
        updatedSubject.progress = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0;
        
        setLocalSubject(updatedSubject);
        
        if (onToggleTopic) {
          onToggleTopic(localSubject.id, chapterId, topicId);
        }
        if (onUpdateSubject) {
          onUpdateSubject(updatedSubject);
        }
      }
    }
  };

  const handleTopicHover = (topicId: number) => {
    setActiveTopicId(topicId);
  };

  const handleTopicLeave = () => {
    setActiveTopicId(null);
  };

  return (
    <div className="mx-6 mb-4">
      <div className="bg-[#1F2430] rounded-2xl hover:shadow-lg hover:shadow-black/20 transition-all duration-200 cursor-pointer">
        {/* Main Subject Card */}
        <div className="p-5" onClick={handleToggleExpand}>
          <div className="flex items-center justify-between">
            <SubjectProgress progress={localSubject.progress} color={localSubject.color} />

            {/* Subject Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white mb-1 truncate">
                {localSubject.name}
              </h3>
              <p className="text-sm font-medium text-[#C0C0C0] mb-3">{localSubject.timeSpent}</p>
              <div className="flex items-center text-sm text-[#4299E1] hover:text-blue-300 transition-colors pl-2">
                <span className="font-medium">See Details</span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </div>
            </div>

            <SubjectCardActions 
              isPlaying={localSubject.isPlaying} 
              onPlayPause={handlePlayPause} 
            />
          </div>
        </div>

        {/* Expanded Units */}
        {isExpanded && (
          <div className="border-t border-slate-700 transition-all duration-300 ease-in-out">
            {localSubject.chapters?.filter(chapter => chapter.name.toLowerCase() !== 'car').map((chapter) => (
              <ChapterSection
                key={chapter.id}
                chapter={chapter}
                isExpanded={expandedChapters.has(chapter.id)}
                activeTopicId={activeTopicId}
                onToggleExpand={handleToggleChapter}
                onAddSubtopic={handleAddSubtopic}
                onToggleTopic={handleToggleTopic}
                onTopicHover={handleTopicHover}
                onTopicLeave={handleTopicLeave}
              />
            ))}

            <AddUnitButton onAddUnit={handleAddUnit} />
          </div>
        )}
      </div>
    </div>
  );
};
