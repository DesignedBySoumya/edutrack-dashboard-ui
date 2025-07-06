export interface PomodoroSession {
  id: string;
  user_id: string;
  started_at: string;
  ended_at?: string;
  duration_minutes?: number;
  session_type: 'focus' | 'break';
}

export interface UserSubtopicProgress {
  user_id: string;
  is_completed: boolean;
  time_spent_minutes: number;
  last_studied_at: string;
}

export interface SessionResult {
  sessionId: string;
  addedMinutes: number;
  totalMinutes: number;
  isCompleted: boolean;
}

export interface PomodoroHookReturn {
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
  startSession: (sessionType?: 'focus' | 'break') => Promise<string>;
  endSession: (isCompleted?: boolean) => Promise<SessionResult>;
  getCurrentSession: () => Promise<PomodoroSession | null>;
  getProgress: () => Promise<UserSubtopicProgress | null>;
} 