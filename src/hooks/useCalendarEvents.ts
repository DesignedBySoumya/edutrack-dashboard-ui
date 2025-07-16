
import { useState, useEffect, useCallback } from 'react';
import {
  fetchEvents,
  insertEvent,
  updateEvent as supabaseUpdateEvent,
  deleteEvent as supabaseDeleteEvent,
  fetchCalendars,
  createCalendar,
  updateCalendar as supabaseUpdateCalendar,
  deleteCalendar as supabaseDeleteCalendar,
  CalendarEvent as BackendCalendarEvent,
  Calendar as BackendCalendar,
  addEvent as addEventService,
} from '@/lib/calendarEventsService';
import { CalendarEvent, Calendar } from '@/types/calendar';

function mapBackendCalendar(cal: BackendCalendar): Calendar {
  return {
    id: cal.id,
    name: cal.name,
    color: cal.color,
    visible: true, // default to true; adjust if you store this in DB
    type: 'study', // fallback; adjust if you store this in DB
  };
}

function mapBackendEvent(ev: BackendCalendarEvent): CalendarEvent {
  return {
    id: ev.id,
    title: ev.title,
    calendarId: ev.calendar_id || '',
    description: ev.description,
    start: new Date(ev.start_time),
    end: new Date(ev.end_time),
    color: ev.color,
    isAllDay: ev.all_day,
    createdAt: new Date(ev.created_at),
    updatedAt: new Date(ev.updated_at),
  };
}

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events and calendars on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [eventsData, calendarsData] = await Promise.all([
          fetchEvents(),
          fetchCalendars(),
        ]);
        setEvents(eventsData.map(mapBackendEvent));
        setCalendars(calendarsData.map(mapBackendCalendar));
      } catch (err: any) {
        setError(err.message || 'Failed to load calendar data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Add event
  const addEvent = useCallback(async (event: {
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    all_day: boolean;
    color: string;
    location?: string;
    calendar_id?: string;
  }) => {
    const newEvent = await addEventService(event);
    setEvents((prev) => [...prev, mapBackendEvent(newEvent)]);
    return mapBackendEvent(newEvent);
  }, []);

  // Update event
  const updateEvent = useCallback(async (id: string, updates: Partial<Omit<BackendCalendarEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    // Convert Date objects to ISO strings for start_time/end_time
    const backendUpdates: any = { ...updates };
    if ('start' in updates && updates.start instanceof Date) backendUpdates.start_time = updates.start.toISOString();
    if ('end' in updates && updates.end instanceof Date) backendUpdates.end_time = updates.end.toISOString();
    delete backendUpdates.start;
    delete backendUpdates.end;
    const updated = await supabaseUpdateEvent(id, backendUpdates);
    setEvents((prev) => prev.map((e) => (e.id === id ? mapBackendEvent(updated) : e)));
    return mapBackendEvent(updated);
  }, []);

  // Delete event
  const deleteEvent = useCallback(async (id: string) => {
    await supabaseDeleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  // Add calendar with error handling and UI refresh
  const addCalendar = useCallback(async (calendar: Omit<Calendar, 'id' | 'visible' | 'type'>) => {
    try {
      const newCalendar = await createCalendar({
        name: calendar.name,
        color: calendar.color
      });
      setCalendars((prev) => [...prev, mapBackendCalendar(newCalendar)]);
      return mapBackendCalendar(newCalendar);
    } catch (error: any) {
      console.error('Failed to create calendar:', error);
      alert(error.message || 'Failed to create calendar');
      throw error;
    }
  }, []);

  // Update calendar
  const updateCalendar = useCallback(async (id: string, updates: Partial<Omit<BackendCalendar, 'id' | 'user_id' | 'created_at'>>) => {
    const updated = await supabaseUpdateCalendar(id, updates);
    setCalendars((prev) => prev.map((c) => (c.id === id ? mapBackendCalendar(updated) : c)));
    return mapBackendCalendar(updated);
  }, []);

  // Delete calendar
  const deleteCalendar = useCallback(async (id: string) => {
    await supabaseDeleteCalendar(id);
    setCalendars((prev) => prev.filter((c) => c.id !== id));
    setEvents((prev) => prev.filter((e) => e.calendarId !== id));
  }, []);

  // Toggle calendar visibility (frontend only)
  const toggleCalendarVisibility = useCallback((calendarId: string) => {
    setCalendars((prev) =>
      prev.map((cal) =>
        cal.id === calendarId ? { ...cal, visible: !('visible' in cal ? cal.visible : true) } : cal
      )
    );
  }, []);

  return {
    events,
    calendars,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    addCalendar,
    updateCalendar,
    deleteCalendar,
    toggleCalendarVisibility,
  };
};
