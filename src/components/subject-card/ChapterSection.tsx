
import React from 'react';
import { ChevronDown, ChevronUp, Crown } from 'lucide-react';
import { TopicItem } from './TopicItem';

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

interface ChapterSectionProps {
  chapter: Chapter;
  isExpanded: boolean;
  activeTopicId: number | null;
  onToggleExpand: (chapterId: number) => void;
  onAddSubtopic: (chapterId: number) => void;
  onToggleTopic: (chapterId: number, topicId: number) => void;
  onTopicHover: (topicId: number) => void;
  onTopicLeave: () => void;
}

export const ChapterSection = ({
  chapter,
  isExpanded,
  activeTopicId,
  onToggleExpand,
  onAddSubtopic,
  onToggleTopic,
  onTopicHover,
  onTopicLeave
}: ChapterSectionProps) => {
  const getSubjectColor = () => '#FACC15';

  return (
    <div className="border-b border-slate-700 last:border-b-0">
      {/* Unit Header */}
      <div 
        className="p-5 pl-8 cursor-pointer hover:bg-slate-750 transition-colors"
        onClick={() => onToggleExpand(chapter.id)}
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-bold text-white">{chapter.name}</h4>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-[#C0C0C0]">{Math.round(chapter.progress)}%</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#2A2E3A] rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full transition-all duration-500 ease-in-out"
            style={{ 
              width: `${chapter.progress}%`,
              backgroundColor: getSubjectColor()
            }}
          ></div>
        </div>
      </div>

      {/* Expanded Subtopics */}
      {isExpanded && (
        <div className="px-5 pb-5 pl-12 transition-all duration-300 ease-in-out">
          <div className="space-y-3">
            {chapter.topics.map((topic) => (
              <TopicItem
                key={topic.id}
                topic={topic}
                chapterId={chapter.id}
                activeTopicId={activeTopicId}
                onToggle={onToggleTopic}
                onHover={onTopicHover}
                onLeave={onTopicLeave}
              />
            ))}

            {/* Add New Subtopic Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddSubtopic(chapter.id);
              }}
              className="flex items-center justify-center space-x-2 text-sm font-bold text-gray-300 hover:text-white transition-colors mt-4 border-2 border-gray-500 hover:border-gray-400 rounded-xl px-5 py-2.5 hover:shadow-sm transition-all duration-200 w-full"
            >
              <span>Add New Subtopic</span>
              <Crown className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
