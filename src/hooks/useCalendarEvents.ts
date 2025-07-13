
import { useState, useEffect } from 'react';
import { CalendarEvent, Calendar } from '@/types/calendar';

const DEFAULT_CALENDARS: Calendar[] = [
  { id: '1', name: 'Study', color: '#10B981', visible: true, type: 'study' },
];

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [calendars, setCalendars] = useState<Calendar[]>(DEFAULT_CALENDARS);

  useEffect(() => {
    const savedEvents = localStorage.getItem('focustime-events');
    const savedCalendars = localStorage.getItem('focustime-calendars');
    
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt),
      }));
      setEvents(parsedEvents);
    }
    
    if (savedCalendars) {
      setCalendars(JSON.parse(savedCalendars));
    }
  }, []);

  const saveEvents = (newEvents: CalendarEvent[]) => {
    localStorage.setItem('focustime-events', JSON.stringify(newEvents));
    setEvents(newEvents);
  };

  const saveCalendars = (newCalendars: Calendar[]) => {
    localStorage.setItem('focustime-calendars', JSON.stringify(newCalendars));
    setCalendars(newCalendars);
  };

  const addEvent = (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const newEvents = [...events, newEvent];
    saveEvents(newEvents);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    const newEvents = events.map(event => 
      event.id === id 
        ? { ...event, ...updates, updatedAt: new Date() }
        : event
    );
    saveEvents(newEvents);
  };

  const deleteEvent = (id: string) => {
    const newEvents = events.filter(event => event.id !== id);
    saveEvents(newEvents);
  };

  const toggleCalendarVisibility = (calendarId: string) => {
    const newCalendars = calendars.map(cal => 
      cal.id === calendarId 
        ? { ...cal, visible: !cal.visible }
        : cal
    );
    saveCalendars(newCalendars);
  };

  const addCalendar = (name: string, color: string) => {
    const newCalendar: Calendar = {
      id: crypto.randomUUID(),
      name,
      color,
      visible: true,
      type: 'study'
    };
    const newCalendars = [...calendars, newCalendar];
    saveCalendars(newCalendars);
    return newCalendar;
  };

  const deleteCalendar = (calendarId: string) => {
    // Remove the calendar
    const newCalendars = calendars.filter(cal => cal.id !== calendarId);
    saveCalendars(newCalendars);
    // Remove all events associated with this calendar
    const newEvents = events.filter(event => event.calendarId !== calendarId);
    saveEvents(newEvents);
  };

  return {
    events,
    calendars,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleCalendarVisibility,
    addCalendar,
    deleteCalendar,
  };
};
