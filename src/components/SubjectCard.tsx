
import React, { useState } from 'react';
import { Play, Pause, ChevronDown, ChevronUp, Crown, Check } from 'lucide-react';

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

  // Progress circle with larger size
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (Math.round(localSubject.progress) / 100) * circumference;

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

  const handleAddUnit = () => {
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
      <div className="bg-slate-800 rounded-xl hover:shadow-lg hover:shadow-black/20 transition-all duration-200 cursor-pointer">
        {/* Main Subject Card */}
        <div className="p-4" onClick={handleToggleExpand}>
          <div className="flex items-center justify-between">
            {/* Progress Circle - Increased size */}
            <div className="relative mr-4 flex-shrink-0">
              <svg width="64" height="64" className="transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-gray-700"
                />
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  strokeWidth="4"
                  fill="none"
                  className="stroke-yellow-400"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.3s ease-in-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {Math.round(localSubject.progress)}%
                </span>
              </div>
            </div>

            {/* Subject Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white mb-1 truncate">
                {localSubject.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">{localSubject.timeSpent}</p>
              <div className="flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors">
                <span className="font-medium">See Details</span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </div>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={handlePlayPause}
              className="w-12 h-12 rounded-full bg-yellow-400 hover:bg-orange-400 flex items-center justify-center transition-all duration-200 transform hover:brightness-110 flex-shrink-0 ml-4"
            >
              {localSubject.isPlaying ? (
                <Pause className="w-6 h-6 text-black" />
              ) : (
                <Play className="w-6 h-6 text-black ml-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded Units */}
        {isExpanded && (
          <div className="border-t border-slate-700 transition-all duration-300 ease-in-out">
            {localSubject.chapters?.map((chapter) => (
              <div key={chapter.id} className="border-b border-slate-700 last:border-b-0">
                {/* Unit Header */}
                <div 
                  className="p-4 pl-8 cursor-pointer hover:bg-slate-750 transition-colors"
                  onClick={() => handleToggleChapter(chapter.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white">{chapter.name}</h4>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-muted-foreground">{Math.round(chapter.progress)}%</span>
                      {expandedChapters.has(chapter.id) ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Thicker Progress Bar */}
                  <div className="w-full bg-gray-800 rounded h-3">
                    <div
                      className="h-3 rounded bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-500 ease-in-out"
                      style={{ width: `${chapter.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Expanded Subtopics */}
                {expandedChapters.has(chapter.id) && (
                  <div className="px-4 pb-4 pl-12 transition-all duration-300 ease-in-out">
                    <div className="space-y-3">
                      {chapter.topics.map((topic) => (
                        <div 
                          key={topic.id} 
                          className={`flex items-center justify-between py-3 px-3 rounded-lg transition-all duration-200 ${
                            activeTopicId === topic.id ? 'bg-blue-500/10 border-l-4 border-blue-500' : 'hover:bg-blue-500/5'
                          }`}
                          onMouseEnter={() => handleTopicHover(topic.id)}
                          onMouseLeave={handleTopicLeave}
                        >
                          <div className="flex items-center space-x-3">
                            {topic.isCompleted ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleTopic(chapter.id, topic.id);
                                }}
                                className="bg-green-500 text-white rounded-full p-1 hover:scale-105 transition-transform duration-200"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleTopic(chapter.id, topic.id);
                                }}
                                className="w-6 h-6 rounded-full border-2 border-gray-400 bg-transparent hover:border-gray-300 hover:scale-105 transition-all duration-200"
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
                      ))}

                      {/* Add New Subtopic Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddSubtopic(chapter.id);
                        }}
                        className="flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300 transition-colors mt-4 border border-blue-500 rounded-xl px-4 py-3 hover:bg-blue-500/10 hover:shadow-md transition-all duration-200 w-full"
                      >
                        <Crown className="w-4 h-4" />
                        <span className="font-medium">Add Subtopic</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Add New Unit Button */}
            <div className="p-4 pl-8">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddUnit();
                }}
                className="flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300 transition-colors border border-blue-500 rounded-xl px-4 py-3 hover:bg-blue-500/10 hover:shadow-md transition-all duration-200 w-full mt-4"
              >
                <Crown className="w-5 h-5" />
                <span className="font-medium">Add New Unit</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
