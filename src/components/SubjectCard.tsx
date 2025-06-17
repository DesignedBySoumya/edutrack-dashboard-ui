
import React, { useState } from 'react';
import { Play, Pause, ChevronDown, ChevronUp, Plus, Check } from 'lucide-react';

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

  // Increased progress circle size - 48px diameter
  const radius = 20; // Increased from 12 to 20
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (localSubject.progress / 100) * circumference;

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

  const handleAddTopic = (chapterId: number) => {
    const topicName = prompt('Enter new topic name:');
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

  return (
    <div className="mx-6 mb-3">
      <div className="bg-slate-800 rounded-xl hover:shadow-lg hover:shadow-black/15 transition-all cursor-pointer">
        {/* Main Subject Card */}
        <div className="p-4" onClick={handleToggleExpand}>
          <div className="flex items-center justify-between">
            {/* Progress Circle - Increased size */}
            <div className="relative mr-4 flex-shrink-0">
              <svg width="56" height="56" className="transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-gray-700"
                />
                <circle
                  cx="28"
                  cy="28"
                  r={radius}
                  strokeWidth="4"
                  fill="none"
                  className="stroke-yellow-400"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {localSubject.progress}%
                </span>
              </div>
            </div>

            {/* Subject Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-white mb-1 truncate">
                {localSubject.name}
              </h3>
              <p className="text-xs text-gray-400 mb-2">{localSubject.timeSpent}</p>
              <div className="flex items-center text-xs text-blue-400 hover:text-blue-300 transition-colors">
                <span className="font-medium">See Details</span>
                {isExpanded ? (
                  <ChevronUp className="w-3 h-3 ml-1" />
                ) : (
                  <ChevronDown className="w-3 h-3 ml-1" />
                )}
              </div>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={handlePlayPause}
              className="w-12 h-12 rounded-full bg-yellow-400 hover:bg-orange-400 flex items-center justify-center transition-all transform hover:brightness-110 flex-shrink-0 ml-4"
            >
              {localSubject.isPlaying ? (
                <Pause className="w-6 h-6 text-black" />
              ) : (
                <Play className="w-6 h-6 text-black ml-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded Chapters */}
        {isExpanded && (
          <div className="border-t border-slate-700 transition-all duration-300 ease-in-out">
            {localSubject.chapters?.map((chapter) => (
              <div key={chapter.id} className="border-b border-slate-700 last:border-b-0">
                {/* Chapter Header */}
                <div 
                  className="p-4 pl-8 cursor-pointer hover:bg-slate-750 transition-colors"
                  onClick={() => handleToggleChapter(chapter.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-white">{chapter.name}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">({chapter.progress}%)</span>
                      {chapter.progress === 100 ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <div className="w-4 h-4 rounded border border-gray-400"></div>
                      )}
                      {expandedChapters.has(chapter.id) ? (
                        <ChevronUp className="w-3 h-3 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Chapter Progress Bar */}
                  <div className="w-full bg-gray-800 rounded h-1.5">
                    <div
                      className="h-1.5 rounded bg-blue-500 transition-all duration-300"
                      style={{ width: `${chapter.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Expanded Topics */}
                {expandedChapters.has(chapter.id) && (
                  <div className="px-4 pb-4 pl-12 transition-all duration-300 ease-in-out">
                    <div className="space-y-2">
                      {chapter.topics.map((topic) => (
                        <div 
                          key={topic.id} 
                          className="flex items-center justify-between py-2 px-2 rounded hover:bg-blue-500/10 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleTopic(chapter.id, topic.id);
                              }}
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all hover:scale-110 ${
                                topic.isCompleted 
                                  ? 'bg-green-500 border-green-500' 
                                  : 'border-gray-400 bg-transparent hover:border-gray-300'
                              }`}
                            >
                              {topic.isCompleted && <Check className="w-3 h-3 text-black" />}
                            </button>
                            <span className={`text-sm font-medium transition-all ${
                              topic.isCompleted ? 'text-gray-400 line-through' : 'text-gray-200'
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddTopic(chapter.id);
                        }}
                        className="flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300 transition-colors mt-3 border border-blue-500 rounded-lg px-3 py-2 hover:bg-blue-500/10"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="font-medium">Add New Topic</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
