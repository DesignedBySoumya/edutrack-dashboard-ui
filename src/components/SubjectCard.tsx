
import React, { useState } from 'react';
import { Play, Pause, ChevronDown, ChevronUp, Plus, Check } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  onPlayPause: () => void;
  onAddTopic?: (subjectId: number, chapterId: number) => void;
}

export const SubjectCard = ({ subject, onPlayPause, onAddTopic }: SubjectCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'stroke-orange-500',
      green: 'stroke-yellow-500',
      purple: 'stroke-yellow-500',
      orange: 'stroke-orange-500',
      teal: 'stroke-teal-500',
      pink: 'stroke-pink-500',
    };
    return colorMap[color as keyof typeof colorMap] || 'stroke-orange-500';
  };

  const getPlayButtonColor = (color: string) => {
    const colorMap = {
      blue: 'bg-orange-500 hover:bg-orange-600',
      green: 'bg-yellow-500 hover:bg-yellow-600',
      purple: 'bg-yellow-500 hover:bg-yellow-600',
      orange: 'bg-orange-500 hover:bg-orange-600',
      teal: 'bg-teal-500 hover:bg-teal-600',
      pink: 'bg-pink-500 hover:bg-pink-600',
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-orange-500 hover:bg-orange-600';
  };

  const getProgressBarColor = (color: string) => {
    const colorMap = {
      blue: 'bg-orange-500',
      green: 'bg-yellow-500',
      purple: 'bg-yellow-500',
      orange: 'bg-orange-500',
      teal: 'bg-teal-500',
      pink: 'bg-pink-500',
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-orange-500';
  };

  const circumference = 2 * Math.PI * 20;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (subject.progress / 100) * circumference;

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAddTopic = (chapterId: number) => {
    if (onAddTopic) {
      onAddTopic(subject.id, chapterId);
    }
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded} className="mx-4 mb-4">
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <CollapsibleTrigger asChild>
          <div className="p-4 cursor-pointer hover:bg-gray-750 transition-colors">
            <div className="flex items-center justify-between">
              {/* Progress Ring */}
              <div className="relative mr-4">
                <svg width="56" height="56" className="transform -rotate-90">
                  <circle
                    cx="28"
                    cy="28"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-gray-700"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r="20"
                    strokeWidth="4"
                    fill="none"
                    className={getColorClasses(subject.color)}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {subject.progress}%
                  </span>
                </div>
              </div>

              {/* Subject Info */}
              <div className="flex-1">
                <h3 className="text-base font-medium text-white mb-1">{subject.name}</h3>
                <p className="text-sm text-gray-400 mb-2">{subject.timeSpent}</p>
                <div className="flex items-center text-xs text-gray-500 hover:text-gray-300 transition-colors">
                  <span>See Details</span>
                  {isExpanded ? (
                    <ChevronUp className="w-3 h-3 ml-1" />
                  ) : (
                    <ChevronDown className="w-3 h-3 ml-1" />
                  )}
                </div>
              </div>

              {/* Play/Pause Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayPause();
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${getPlayButtonColor(
                  subject.color
                )}`}
              >
                {subject.isPlaying ? (
                  <Pause className="w-5 h-5 text-black" />
                ) : (
                  <Play className="w-5 h-5 text-black ml-0.5" />
                )}
              </button>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="animate-accordion-down">
          <div className="border-t border-gray-700">
            {subject.chapters?.map((chapter) => (
              <div key={chapter.id} className="p-4 border-b border-gray-700 last:border-b-0">
                {/* Chapter Header */}
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-white">{chapter.name}</h4>
                  <span className="text-xs text-gray-400">({chapter.progress}%)</span>
                </div>

                {/* Chapter Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <div
                    className={`h-2 rounded-full ${getProgressBarColor(subject.color)}`}
                    style={{ width: `${chapter.progress}%` }}
                  ></div>
                </div>

                {/* Topics */}
                <div className="space-y-2 ml-4">
                  {chapter.topics.map((topic) => (
                    <div key={topic.id} className="flex items-center justify-between py-1">
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          topic.isCompleted 
                            ? `${getProgressBarColor(subject.color)} border-transparent` 
                            : 'border-gray-500 bg-transparent'
                        }`}>
                          {topic.isCompleted && <Check className="w-3 h-3 text-black" />}
                        </div>
                        <span className={`text-sm ${
                          topic.isCompleted ? 'text-gray-400 line-through' : 'text-gray-300'
                        }`}>
                          {topic.name}
                        </span>
                      </div>
                      {topic.timeSpent && (
                        <span className="text-xs text-gray-500">{topic.timeSpent}</span>
                      )}
                    </div>
                  ))}

                  {/* Add New Topic Button */}
                  <button
                    onClick={() => handleAddTopic(chapter.id)}
                    className="flex items-center space-x-2 text-xs text-gray-500 hover:text-gray-300 transition-colors mt-2"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add New Topic</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
