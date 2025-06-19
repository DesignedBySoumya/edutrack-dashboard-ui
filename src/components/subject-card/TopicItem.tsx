
import React from 'react';
import { Check, Play } from 'lucide-react';

interface Topic {
  id: number;
  name: string;
  isCompleted: boolean;
  timeSpent?: string;
}

interface TopicItemProps {
  topic: Topic;
  chapterId: number;
  activeTopicId: number | null;
  onToggle: (chapterId: number, topicId: number) => void;
  onHover: (topicId: number) => void;
  onLeave: () => void;
}

export const TopicItem = ({ 
  topic, 
  chapterId, 
  activeTopicId, 
  onToggle, 
  onHover, 
  onLeave 
}: TopicItemProps) => {
  return (
    <div 
      className={`flex items-center justify-between py-3 px-4 rounded-lg transition-all duration-200 ${
        activeTopicId === topic.id ? 'bg-blue-500/10 border-l-4 border-blue-500' : 'hover:bg-blue-500/5'
      }`}
      onMouseEnter={() => onHover(topic.id)}
      onMouseLeave={onLeave}
    >
      <div className="flex items-center space-x-3">
        {topic.isCompleted ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(chapterId, topic.id);
            }}
            className="bg-green-500 text-white rounded-full p-1.5 hover:scale-105 transition-transform duration-200"
          >
            <Check className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(chapterId, topic.id);
            }}
            className="w-7 h-7 rounded-full border-2 border-gray-400 bg-transparent hover:border-gray-300 hover:scale-105 transition-all duration-200"
          />
        )}
        <span className={`text-sm font-medium transition-all ${
          topic.isCompleted ? 'text-gray-400 line-through' : 'text-gray-200'
        }`}>
          {topic.name}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        {topic.timeSpent && (
          <span className="text-xs text-gray-500">{topic.timeSpent}</span>
        )}
        {!topic.isCompleted && activeTopicId === topic.id && (
          <button className="w-8 h-8 rounded-full bg-yellow-400 hover:bg-orange-400 flex items-center justify-center transition-all duration-200">
            <Play className="w-4 h-4 text-black ml-0.5" />
          </button>
        )}
      </div>
    </div>
  );
};
