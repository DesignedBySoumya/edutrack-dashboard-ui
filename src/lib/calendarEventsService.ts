import { createClient } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

// Types
export interface Calendar {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_time: string; // ISO 8601
  end_time: string;   // ISO 8601
  all_day: boolean;
  color?: string;
  location?: string;
  calendar_id?: string;
  created_at: string;
  updated_at: string;
}

// Helper to safely join fields for Supabase select
export const selectFields = (...fields: string[]) => fields.join(', ');

// Get current user (async)
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) throw new Error('Not authenticated');
  return data.user;
}

// Fetch all calendars for the logged-in user
export async function fetchCalendars() {
  const user = await getCurrentUser();
  const { data, error } = await supabase
    .from('calendars')
    .select(selectFields('id', 'name', 'color', 'created_at'))
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data as Calendar[];
}

// Fetch all events for the logged-in user
export async function fetchEvents() {
  const user = await getCurrentUser();
  const { data, error } = await supabase
    .from('calendar_events')
    .select(selectFields('*'))
    .eq('user_id', user.id)
    .order('start_time', { ascending: true });
  if (error) throw error;
  return data as CalendarEvent[];
}

// Insert a new event
export async function insertEvent(event: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at' | 'user_id'>) {
  const user = await getCurrentUser();
  const { data, error } = await supabase
    .from('calendar_events')
    .insert([
      {
        ...event,
        user_id: user.id,
      },
    ])
    .select()
    .single();
  if (error) throw error;
  return data as CalendarEvent;
}

// Update an event by id
export async function updateEvent(eventId: string, updates: Partial<Omit<CalendarEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) {
  const user = await getCurrentUser();
  const { data, error } = await supabase
    .from('calendar_events')
    .update(updates)
    .eq('id', eventId)
    .eq('user_id', user.id)
    .select()
    .single();
  if (error) throw error;
  return data as CalendarEvent;
}

// Delete an event by id
export async function deleteEvent(eventId: string) {
  const user = await getCurrentUser();
  const { error } = await supabase
    .from('calendar_events')
    .delete()
    .eq('id', eventId)
    .eq('user_id', user.id);
  if (error) throw error;
  return true;
}

// Create a new calendar
export async function createCalendar(calendar: Omit<Calendar, 'id' | 'user_id' | 'created_at'>) {
  const user = await getCurrentUser();
  const { data, error } = await supabase
    .from('calendars')
    .insert([
      {
        ...calendar,
        user_id: user.id,
      },
    ])
    .select()
    .single();
  if (error) throw error;
  return data as Calendar;
}

// Update a calendar by id
export async function updateCalendar(calendarId: string, updates: Partial<Omit<Calendar, 'id' | 'user_id' | 'created_at'>>) {
  const user = await getCurrentUser();
  const { data, error } = await supabase
    .from('calendars')
    .update(updates)
    .eq('id', calendarId)
    .eq('user_id', user.id)
    .select()
    .single();
  if (error) throw error;
  return data as Calendar;
}

// Delete a calendar by id
export async function deleteCalendar(calendarId: string) {
  const user = await getCurrentUser();
  const { error } = await supabase
    .from('calendars')
    .delete()
    .eq('id', calendarId)
    .eq('user_id', user.id);
  if (error) throw error;
  return true;
}

export async function addEvent(event: {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  all_day: boolean;
  color: string;
  location?: string;
  calendar_id?: string;
}) {
  const user = await getCurrentUser();
  let calendarId = event.calendar_id;
  if (!calendarId) {
    const { data: calendar, error } = await supabase
      .from('calendars')
      .select('id')
      .eq('user_id', user.id)
      .eq('name', 'Study')
      .limit(1)
      .single();
    if (error || !calendar) throw new Error('No fallback Study calendar found for user');
    calendarId = calendar.id;
  }
  const { data, error } = await supabase
    .from('calendar_events')
    .insert([{
      user_id: user.id,
      title: event.title,
      description: event.description || '',
      start_time: event.start_time,
      end_time: event.end_time,
      all_day: event.all_day,
      color: event.color,
      location: event.location || '',
      calendar_id: calendarId,
    }])
    .select('*')
    .single();
  if (error) throw error;
  return data;
} 