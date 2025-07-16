
import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CalendarEvent, Calendar } from '@/types/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: CalendarEvent;
  calendars: Calendar[];
  onUpdate: (id: string, updates: Partial<CalendarEvent>) => void;
  onDelete: (id: string) => void;
  startTime?: Date | null;
  endTime?: Date | null;
  onSave: (eventData: {
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    all_day: boolean;
    color: string;
    location?: string;
    calendar_id?: string;
  }) => void;
}

const TIME_OPTIONS = Array.from({ length: 24 * 4 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const min = (i % 4) * 15;
  const value = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
  let displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? 'AM' : 'PM';
  const label = `${displayHour}:${min.toString().padStart(2, '0')} ${ampm}`;
  return { value, label };
});

const CONTRAST_COLORS = [
  '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', '#FF99E6', '#CCFF1A', '#FF1A66'
];

export const EventModal = ({ 
  isOpen, 
  onClose, 
  event, 
  calendars, 
  onUpdate, 
  onDelete,
  startTime,
  endTime,
  onSave
}: EventModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [calendarId, setCalendarId] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [startTimeInput, setStartTimeInput] = useState('09:00');
  const [endTimeInput, setEndTimeInput] = useState('10:00');
  const [isAllDay, setIsAllDay] = useState(false);
  const [eventColor, setEventColor] = useState('');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setCalendarId(event.calendarId || calendars[0]?.id || '');
      setDate(event.start ? new Date(event.start) : null);
      setStartTimeInput(event.start ? format(new Date(event.start), 'HH:mm') : '09:00');
      setEndTimeInput(event.end ? format(new Date(event.end), 'HH:mm') : '10:00');
      setIsAllDay(event.isAllDay ?? false);
      setEventColor(event.color || '');
    } else if (startTime && endTime) {
      setTitle('');
      setDescription('');
      setCalendarId(calendars[0]?.id || '');
      setDate(startTime);
      setStartTimeInput(format(startTime, 'HH:mm'));
      setEndTimeInput(format(endTime, 'HH:mm'));
      setIsAllDay(false);
      setEventColor(calendars[0]?.color || CONTRAST_COLORS[0]);
    } else {
      const now = new Date();
      setTitle('');
      setDescription('');
      setCalendarId(calendars[0]?.id || '');
      setDate(now);
      setStartTimeInput('09:00');
      setEndTimeInput('10:00');
      setIsAllDay(false);
      setEventColor(calendars[0]?.color || CONTRAST_COLORS[0]);
    }
  }, [event, calendars, startTime, endTime]);

  const [location, setLocation] = useState('');

  const handleSave = () => {
    if (!title.trim() || !date) return;
    const [startHour, startMin] = startTimeInput.split(':').map(Number);
    const [endHour, endMin] = endTimeInput.split(':').map(Number);
    const start = new Date(date);
    start.setHours(startHour, startMin, 0, 0);
    const end = new Date(date);
    end.setHours(endHour, endMin, 0, 0);
    onSave({
      title: title.trim(),
      description,
      start_time: isAllDay ? new Date(date.setHours(0,0,0,0)).toISOString() : start.toISOString(),
      end_time: isAllDay ? new Date(date.setHours(23,59,59,999)).toISOString() : end.toISOString(),
      all_day: isAllDay,
      color: eventColor,
      location: location || '',
      calendar_id: calendarId || undefined,
    });
  };

  const handleDelete = () => {
    if (event) {
      onDelete(event.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">
            {event ? 'Edit Event' : 'New Event'}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 space-y-4">
          <Input
            placeholder="Event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
          />
          <Select value={calendarId} onValueChange={val => {
            setCalendarId(val);
            const cal = calendars.find(c => c.id === val);
            setEventColor(cal?.color || CONTRAST_COLORS[0]);
          }}>
            <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Select calendar/category" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              {calendars.map(calendar => (
                <SelectItem key={calendar.id} value={calendar.id} className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: calendar.color }} />
                  {calendar.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Color Picker */}
          <div>
            <div className="mb-1 text-sm text-slate-300">Event Color</div>
            <div className="flex flex-wrap gap-2">
              {CONTRAST_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`w-7 h-7 rounded-full border-2 transition-all duration-100 focus:outline-none ${eventColor === color ? 'border-blue-500 ring-2 ring-blue-400' : 'border-slate-700'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setEventColor(color)}
                  aria-label={color}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="allDay"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="allDay" className="text-sm text-slate-300">
              All day
            </label>
          </div>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start bg-slate-700 border-slate-600 text-white">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 bg-slate-800 border-slate-700">
                <CalendarComponent
                  mode="single"
                  selected={date || undefined}
                  onSelect={setDate}
                  className="rounded-md border-0 shadow-none bg-transparent"
                />
              </PopoverContent>
            </Popover>
            {!isAllDay && (
              <Select value={startTimeInput} onValueChange={setStartTimeInput}>
                <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Start time" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-60 overflow-auto">
                  {TIME_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {!isAllDay && (
              <Select value={endTimeInput} onValueChange={setEndTimeInput}>
                <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="End time" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-60 overflow-auto">
                  {TIME_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            rows={3}
          />
        </div>
        <div className="flex items-center justify-between p-4 border-t border-slate-700">
          <div>
            {event && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
          <div className="space-x-2">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!title.trim() || !date}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {event ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
