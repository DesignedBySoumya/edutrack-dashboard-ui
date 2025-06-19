
import React from 'react';
import { Clock, BookOpen, Target } from 'lucide-react';

export const SubjectList = () => {
  const subjects = [
    {
      title: "Indian Polity",
      progress: 75,
      timeSpent: "45h 30m",
      target: "60h",
      color: "bg-blue-500",
      icon: BookOpen
    },
    {
      title: "Modern History",
      progress: 60,
      timeSpent: "32h 15m",
      target: "50h",
      color: "bg-green-500",
      icon: Clock
    },
    {
      title: "Geography",
      progress: 45,
      timeSpent: "28h 45m",
      target: "65h",
      color: "bg-yellow-500",
      icon: Target
    },
    {
      title: "Current Affairs",
      progress: 30,
      timeSpent: "25h 20m",
      target: "40h",
      color: "bg-red-500",
      icon: BookOpen
    }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {subjects.map((subject, index) => (
          <div key={index} className="bg-[#1a1a1d] rounded-xl p-4 lg:p-6 relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${subject.color} bg-opacity-20`}>
                  <subject.icon className={`w-5 h-5 text-white`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{subject.title}</h3>
                  <p className="text-sm text-gray-400">{subject.timeSpent} / {subject.target}</p>
                </div>
              </div>
              <button className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold hover:bg-yellow-600 transition-colors flex-shrink-0">
                →
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Progress</span>
                <span className="text-white font-medium">{subject.progress}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${subject.color}`}
                  style={{ width: `${subject.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              Last studied: 2 hours ago
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
