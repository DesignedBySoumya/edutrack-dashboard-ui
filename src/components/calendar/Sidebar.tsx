
import { Plus, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/types/calendar';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useState } from 'react';
import { useRef } from 'react';
import { FcGoogle } from 'react-icons/fc';

interface SidebarProps {
  calendars: Calendar[];
  onToggleCalendar: (calendarId: string) => void;
  onNewEvent: () => void;
  onAddCalendar?: (name: string, color: string, description: string) => void;
  currentDate?: Date;
  onDateSelect?: (date: Date | { from: Date; to?: Date }) => void;
  onRangeSelect?: (range: { from: Date; to?: Date }) => void;
  onDeleteCalendar?: (calendarId: string) => void;
}

const COLOR_OPTIONS = [
  '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#F43F5E', '#FACC15', '#6366F1', '#14B8A6'
];

export const Sidebar = ({ calendars, onToggleCalendar, onNewEvent, onAddCalendar, currentDate, onDateSelect, onRangeSelect, onDeleteCalendar }: SidebarProps) => {
  const [showAddCalendarModal, setShowAddCalendarModal] = useState(false);
  const [newCalendarName, setNewCalendarName] = useState('');
  const [newCalendarDesc, setNewCalendarDesc] = useState('');
  const [newCalendarColor, setNewCalendarColor] = useState(COLOR_OPTIONS[0]);
  const [calendarRange, setCalendarRange] = useState<{ from: Date; to?: Date } | undefined>(undefined);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [googleCalendars, setGoogleCalendars] = useState([
    // Placeholder for Google calendars
    { id: 'gcal-1', name: 'Google Work', color: '#4285F4', visible: true },
    { id: 'gcal-2', name: 'Google Personal', color: '#0F9D58', visible: true },
  ]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [calendarToDelete, setCalendarToDelete] = useState<string | null>(null);
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleAddCalendar = () => {
    if (newCalendarName.trim() && onAddCalendar) {
      onAddCalendar(newCalendarName.trim(), newCalendarColor, newCalendarDesc.trim());
      setNewCalendarName('');
      setNewCalendarDesc('');
      setNewCalendarColor(COLOR_OPTIONS[0]);
      setShowAddCalendarModal(false);
    }
  };

  const connectGoogleCalendar = () => {
    // TODO: Implement OAuth flow here
    setGoogleConnected(true);
    // After connecting, fetch Google calendars and setGoogleCalendars([...])
  };

  // Handle range or single date selection
  const handleCalendarSelect = (range: any) => {
    setCalendarRange(range);
    if (range && range.from) {
      if (range.to) {
        onRangeSelect?.(range);
      } else {
        onDateSelect?.(range.from);
      }
    }
  };

  const handleCalendarMouseDown = (calendarId: string) => {
    longPressTimeout.current = setTimeout(() => {
      setCalendarToDelete(calendarId);
      setShowDeleteModal(true);
    }, 700); // 700ms for long press
  };

  const handleCalendarMouseUp = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
  };

  const handleDeleteCalendar = () => {
    if (calendarToDelete) {
      // Permanently delete the calendar and its events
      if (onDeleteCalendar) {
        onDeleteCalendar(calendarToDelete);
      }
      setShowDeleteModal(false);
      setCalendarToDelete(null);
    }
  };

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-700 p-4">
      <div className="mb-6">
        <Button 
          onClick={onNewEvent}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-base font-semibold flex items-center justify-center gap-2 shadow-sm"
          size="lg"
        >
          <Plus className="h-5 w-5" />
          Create Event
        </Button>
        <div className="h-3" />
        <Button 
          variant="outline"
          className="w-full border-slate-600 text-slate-700 bg-white hover:bg-slate-100 rounded-lg py-2 text-base font-semibold flex items-center justify-center gap-2 shadow-sm focus:ring-2 focus:ring-blue-400 mb-6"
          size="lg"
          onClick={connectGoogleCalendar}
        >
          <FcGoogle className="h-5 w-5" />
          {googleConnected ? 'Google Connected' : 'Connect with Google'}
        </Button>
        {/* Calendar Demo with range selection */}
        <div className="p-3 bg-slate-800 rounded-lg">
          <CalendarComponent
            mode="range"
            selected={calendarRange}
            onSelect={handleCalendarSelect}
            className="rounded-md border-0 shadow-none bg-transparent"
            captionLayout="dropdown"
            classNames={{
              months: "flex flex-col space-y-0",
              month: "space-y-2",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium text-slate-300",
              nav: "space-x-1 flex items-center",
              nav_button: "h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100 text-slate-400",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-slate-400 rounded-md w-7 font-normal text-[0.7rem]",
              row: "flex w-full mt-1",
              cell: "h-7 w-7 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-7 w-7 p-0 font-normal aria-selected:opacity-100 text-slate-300 hover:bg-slate-700 hover:text-white",
              day_selected: "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-600 focus:text-white",
              day_today: "bg-slate-600 text-white",
              day_outside: "text-slate-500 opacity-50 aria-selected:bg-accent/50 aria-selected:text-slate-500 aria-selected:opacity-30",
              day_disabled: "text-slate-500 opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
          />
        </div>
      </div>
      <div className="space-y-4">
        {googleConnected && (
          <div>
            <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wide mb-2">Google Calendars</h3>
            <div className="space-y-2 mb-4">
              {googleCalendars.map((calendar) => (
                <div
                  key={calendar.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: calendar.color }}
                    />
                    <span className="text-sm text-slate-200">{calendar.name}</span>
                  </div>
                  <span className="text-xs text-green-400">●</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
            My Calendars
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddCalendarModal(true)}
            className="h-6 w-6 p-0 hover:bg-slate-700 text-slate-400"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <div className="space-y-2">
          {calendars.map((calendar) => (
            <div
              key={calendar.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 transition-colors"
              onMouseDown={() => handleCalendarMouseDown(calendar.id)}
              onMouseUp={handleCalendarMouseUp}
              onMouseLeave={handleCalendarMouseUp}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: calendar.color }}
                />
                <span className="text-sm text-slate-200">{calendar.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleCalendar(calendar.id)}
                className="h-6 w-6 p-0 hover:bg-slate-700"
              >
                {calendar.visible ? (
                  <Eye className="h-3 w-3 text-slate-400" />
                ) : (
                  <EyeOff className="h-3 w-3 text-slate-500" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
      {/* Add Calendar Modal */}
      {showAddCalendarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-slate-900 rounded-lg p-6 w-[340px] shadow-xl border border-slate-700">
            <h2 className="text-lg font-bold mb-4 text-white">Create New Calendar</h2>
            <label className="block text-sm text-slate-300 mb-1">Name</label>
            <input
              type="text"
              value={newCalendarName}
              onChange={e => setNewCalendarName(e.target.value)}
              className="w-full mb-3 px-2 py-1 rounded bg-slate-800 border border-slate-600 text-white"
              placeholder="Calendar name"
            />
            <label className="block text-sm text-slate-300 mb-1">Description</label>
            <textarea
              value={newCalendarDesc}
              onChange={e => setNewCalendarDesc(e.target.value)}
              className="w-full mb-3 px-2 py-1 rounded bg-slate-800 border border-slate-600 text-white"
              placeholder="Description (optional)"
              rows={2}
            />
            <label className="block text-sm text-slate-300 mb-1">Color</label>
            <div className="flex gap-2 mb-4 flex-wrap">
              {COLOR_OPTIONS.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`w-7 h-7 rounded-full border-2 ${newCalendarColor === color ? 'border-blue-500 ring-2 ring-blue-400' : 'border-slate-700'} focus:outline-none`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewCalendarColor(color)}
                />
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAddCalendar}>
                Save
              </Button>
              <Button className="flex-1" variant="ghost" onClick={() => setShowAddCalendarModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Calendar Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-slate-900 rounded-lg p-6 w-[340px] shadow-xl border border-slate-700">
            <h2 className="text-lg font-bold mb-4 text-white">Delete Calendar?</h2>
            <p className="text-slate-300 mb-6">Are you sure you want to delete this calendar? This action cannot be undone.</p>
            <div className="flex gap-2 mt-4">
              <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteCalendar}>
                Delete
              </Button>
              <Button className="flex-1" variant="ghost" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
