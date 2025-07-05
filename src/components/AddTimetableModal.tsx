
import React, { useState } from 'react';
import { X, Clock, Calendar, Bell } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface AddTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scheduleData: ScheduleData) => void;
}

interface ScheduleData {
  category: string;
  dates: string[]; // Array of ISO date strings
  startTime: string;
  endTime: string;
  notifications: boolean;
}

const categories = [
  { name: 'Indian Polity and Governance', color: '#3b82f6' },
  { name: 'Indian and World Geography', color: '#10b981' },
  { name: 'Indian Economy', color: '#8b5cf6' },
  { name: 'General Studies', color: '#f59e0b' },
  { name: 'Essay Writing', color: '#ef4444' },
  { name: 'Current Affairs', color: '#06b6d4' },
];

// Get current week dates (Monday to Sunday)
const getCurrentWeekDates = () => {
  const today = new Date();
  const currentDay = today.getDay();
  
  let daysToSubtract;
  if (currentDay === 0) { // Sunday
    daysToSubtract = 6;
  } else {
    daysToSubtract = currentDay - 1;
  }
  
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysToSubtract);
  
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    weekDates.push({
      date: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
      dayShort: date.toLocaleDateString('en-US', { weekday: 'short' }),
      displayDate: date.getDate()
    });
  }
  
  return weekDates;
};

export const AddTimetableModal = ({ isOpen, onClose, onSave }: AddTimetableModalProps) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notifications, setNotifications] = useState(false);

  const weekDates = getCurrentWeekDates();

  const handleDateToggle = (date: string) => {
    setSelectedDates(prev => 
      prev.includes(date) 
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  const handleSave = () => {
    if (!selectedCategory || selectedDates.length === 0 || !startTime || !endTime) {
      return;
    }

    onSave({
      category: selectedCategory,
      dates: selectedDates,
      startTime,
      endTime,
      notifications
    });

    // Reset form
    setSelectedCategory('');
    setSelectedDates([]);
    setStartTime('');
    setEndTime('');
    setNotifications(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1f] rounded-xl border border-slate-800 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Add Study Schedule</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Category Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <Calendar className="w-4 h-4 inline mr-2" />
              Study Subject
            </label>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedCategory === category.name
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-slate-700 hover:border-slate-600 text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm">{category.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Select Dates (This Week)
            </label>
            <div className="grid grid-cols-7 gap-2">
              {weekDates.map((weekDate) => (
                <button
                  key={weekDate.date}
                  onClick={() => handleDateToggle(weekDate.date)}
                  className={`p-2 rounded-lg text-xs font-medium transition-colors flex flex-col items-center ${
                    selectedDates.includes(weekDate.date)
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  <span>{weekDate.dayShort}</span>
                  <span className="text-lg font-bold">{weekDate.displayDate}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <Clock className="w-4 h-4 inline mr-2" />
              Time Slot
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Notification Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-300">Enable Notifications</span>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800">
          <button
            onClick={handleSave}
            disabled={!selectedCategory || selectedDates.length === 0 || !startTime || !endTime}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
};
