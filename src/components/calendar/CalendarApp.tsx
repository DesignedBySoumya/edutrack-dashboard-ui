
import { useState } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { Sidebar } from './Sidebar';
import { CalendarGrid } from './CalendarGrid';
import { EventModal } from './EventModal';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { ViewType, CalendarEvent } from '@/types/calendar';

export const CalendarApp = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStartTime, setModalStartTime] = useState<Date | null>(null);
  const [modalEndTime, setModalEndTime] = useState<Date | null>(null);

  const {
    events,
    calendars,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleCalendarVisibility,
    addCalendar,
    deleteCalendar,
  } = useCalendarEvents();

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setModalStartTime(null);
    setModalEndTime(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(undefined);
    setModalStartTime(null);
    setModalEndTime(null);
  };

  const handleUpdateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    updateEvent(id, updates);
    handleCloseModal();
  };

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
    handleCloseModal();
  };

  const handleAddEventClick = () => {
    setSelectedEvent(undefined);
    setModalStartTime(new Date());
    setModalEndTime(new Date(Date.now() + 60 * 60 * 1000));
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (eventData: {
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    all_day: boolean;
    color: string;
    location?: string;
    calendar_id?: string;
  }) => {
    await addEvent(eventData);
    setIsModalOpen(false);
  };

  // Wrapper for Sidebar's addCalendar signature
  const handleAddCalendar = async (name: string, color: string, description: string) => {
    await addCalendar({ name, color });
  };

  // Link sidebar calendar range selection to main calendar view
  const handleSidebarRangeSelect = (range: { from: Date; to?: Date }) => {
    if (range && range.from && range.to) {
      setView('week');
      setCurrentDate(range.from);
    } else if (range && range.from) {
      setView('day');
      setCurrentDate(range.from);
    }
  };

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onDateChange={setCurrentDate}
        onViewChange={setView}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          calendars={calendars}
          onToggleCalendar={toggleCalendarVisibility}
          onNewEvent={handleAddEventClick}
          onAddCalendar={handleAddCalendar}
          currentDate={currentDate}
          onDateSelect={(dateOrRange) => {
            if (dateOrRange instanceof Date) {
              setView('day');
              setCurrentDate(dateOrRange);
            } else if (dateOrRange && 'from' in dateOrRange) {
              handleSidebarRangeSelect(dateOrRange);
            }
          }}
          onRangeSelect={handleSidebarRangeSelect}
          onDeleteCalendar={deleteCalendar}
        />
        
        <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900 scrollbar-corner-slate-900" style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 #0f172a' }}>
          <CalendarGrid
            currentDate={currentDate}
            view={view}
            events={events}
            calendars={calendars}
            onEventClick={handleEventClick}
            onCreateEvent={() => {}}
            onMoveEvent={updateEvent}
          />
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
        calendars={calendars}
        onSave={handleSaveEvent}
        onUpdate={handleUpdateEvent}
        onDelete={handleDeleteEvent}
        startTime={modalStartTime}
        endTime={modalEndTime}
      />
    </div>
  );
};
