import { supabase } from './supabaseClient';

export interface DashboardStats {
  // Performance Insights
  last10DaysAvg: string;
  todayStudy: string;
  focusScore: number;
  consistency: number;
  mocksDone: number;
  currentStreak: number;
  
  // Subject Breakdown
  subjectData: Array<{
    name: string;
    hours: number;
    color: string;
  }>;
  
  // Weekly Progress
  weeklyData: Array<{
    day: string;
    hours: number;
    sessions: number;
    date: string;
  }>;
  
  // Monthly Progress
  monthlyData: Array<{
    day: string;
    hours: number;
    sessions: number;
    date: string;
  }>;
  
  // Yearly Progress
  yearlyData: Array<{
    month: string;
    hours: number;
  }>;
  
  // Flashcard Stats
  flashcardStats: {
    totalXP: number;
    currentLevel: number;
    currentStreak: number;
    longestStreak: number;
    totalSessions: number;
    cardsReviewed: number;
    accuracy: number;
    lastSession: string;
    lastSessionXP: number;
    recentActivity: Array<{
      action: string;
      detail: string;
      time: string;
    }>;
    hasFlashcards?: boolean;
  };
  
  // Pomodoro Stats
  pomodoroStats: {
    totalSessions: number;
    focusRatio: number;
    totalTime: number;
    sessionTypes: Array<{
      type: string;
      count: number;
      color: string;
    }>;
    subjectTime: Array<{
      subject: string;
      minutes: number;
    }>;
  };
  
  // Mock Test Analytics
  mockStats: {
    totalMocks: number;
    avgScore: number;
    highestScore: number;
    lowestScore: number;
    accuracy: number;
    currentStreak: number;
    bestStreak: number;
    pending: number;
  };
  
  // Mock Speed Data
  mockSpeedData: Array<{
    category: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  
  // Mock Trend
  mockTrend: Array<{
    day: string;
    score: number;
    questions: number;
  }>;
  
  // Recent Mocks
  recentMocks: Array<{
    name: string;
    score: number;
    date: string;
  }>;
}

export class DashboardService {
  private userId: string;
  private examId: number | null;

  constructor(userId: string, examId: number | null = null) {
    this.userId = userId;
    this.examId = examId;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const [
        studySessions,
        mockTests,
        battleLogs,
        reviewSessions,
        subjectStats,
        flashcards
      ] = await Promise.all([
        this.fetchStudySessions(),
        this.fetchMockTests(),
        this.fetchBattleLogs(),
        this.fetchReviewSessions(),
        this.fetchSubjectStats(),
        this.fetchFlashcards()
      ]);

      const performanceInsights = this.calculatePerformanceInsights(studySessions, mockTests, reviewSessions);
      const weeklyProgress = this.calculateWeeklyProgress(studySessions);
      const monthlyProgress = this.calculateMonthlyProgress(studySessions);
      const yearlyProgress = this.calculateYearlyProgress(studySessions);
      const flashcardStats = this.calculateFlashcardStats(reviewSessions, flashcards);
      const pomodoroStats = await this.calculatePomodoroStats(studySessions);
      const mockStats = this.calculateMockStats(mockTests, battleLogs);

      const subjectData = await this.calculateSubjectBreakdown(studySessions);

      return {
        ...performanceInsights,
        ...weeklyProgress,
        ...monthlyProgress,
        ...yearlyProgress,
        subjectData,
        flashcardStats,
        pomodoroStats,
        mockStats: {
          totalMocks: mockStats.totalMocks,
          avgScore: mockStats.avgScore,
          highestScore: mockStats.highestScore,
          lowestScore: mockStats.lowestScore,
          accuracy: mockStats.accuracy,
          currentStreak: mockStats.currentStreak,
          bestStreak: mockStats.bestStreak,
          pending: mockStats.pending
        },
        mockSpeedData: mockStats.mockSpeedData,
        mockTrend: mockStats.mockTrend,
        recentMocks: mockStats.recentMocks
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  private async fetchStudySessions() {
    const { data, error } = await supabase
      .from('user_daily_study_sessions')
      .select('*')
      .eq('user_id', this.userId)
      .order('started_at', { ascending: false });

    if (error) throw error;
    
    // If exam is specified, filter by subject's exam_id
    if (this.examId && data) {
      const filteredData = [];
      for (const session of data) {
        if (session.subject_id) {
          const { data: subject } = await supabase
            .from('subjects')
            .select('exam_id')
            .eq('id', session.subject_id)
            .single();
          
          if (subject && subject.exam_id === this.examId) {
            filteredData.push(session);
          }
        }
      }
      return filteredData;
    }
    
    return data || [];
  }

  private async fetchMockTests() {
    const { data, error } = await supabase
      .from('mock_tests')
      .select('*')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Filter by exam if specified
    if (this.examId && data) {
      return data.filter(mock => mock.exam_id === this.examId);
    }
    
    return data || [];
  }

  private async fetchBattleLogs() {
    const { data, error } = await supabase
      .from('battle_logs')
      .select('*')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // For now, return all battle logs without filtering by exam
    // This can be enhanced later when we have better data structure
    return data || [];
  }

  private async fetchReviewSessions() {
    const { data, error } = await supabase
      .from('review_sessions')
      .select('*')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // If exam is specified, filter by flashcard's subject's exam_id
    if (this.examId && data) {
      const filteredData = [];
      for (const session of data) {
        // For now, include all review sessions as they might not be tied to specific subjects
        // This can be enhanced later when we have better data structure
        filteredData.push(session);
      }
      return filteredData;
    }
    
    return data || [];
  }

  private async fetchSubjectStats() {
    const { data, error } = await supabase
      .from('user_subject_stats')
      .select('*')
      .eq('user_id', this.userId);

    if (error) throw error;
    
    // If exam is specified, filter by subject's exam_id
    if (this.examId && data) {
      const filteredData = [];
      for (const stat of data) {
        if (stat.subject_id) {
          const { data: subject } = await supabase
            .from('subjects')
            .select('exam_id')
            .eq('id', stat.subject_id)
            .single();
          
          if (subject && subject.exam_id === this.examId) {
            filteredData.push(stat);
          }
        }
      }
      return filteredData;
    }
    
    return data || [];
  }

  private async fetchFlashcards() {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', this.userId);

    if (error) throw error;
    
    // If exam is specified, filter by subject's exam_id
    if (this.examId && data) {
      const filteredData = [];
      for (const flashcard of data) {
        if (flashcard.subject_id) {
          const { data: subject } = await supabase
            .from('subjects')
            .select('exam_id')
            .eq('id', flashcard.subject_id)
            .single();
          
          if (subject && subject.exam_id === this.examId) {
            filteredData.push(flashcard);
          }
        }
      }
      return filteredData;
    }
    
    return data || [];
  }

  private calculatePerformanceInsights(studySessions: any[], mockTests: any[], reviewSessions: any[]) {
    const now = new Date();
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    // Last 10 days average
    const last10DaysSessions = studySessions.filter(session => 
      new Date(session.started_at) >= tenDaysAgo
    );
    const totalMinutes = last10DaysSessions.reduce((sum, session) => 
      sum + (session.duration_minutes || 0), 0
    );
    const last10DaysAvg = totalMinutes / 10;

    // Today's study
    const todaySessions = studySessions.filter(session => 
      new Date(session.started_at) >= today
    );
    const todayMinutes = todaySessions.reduce((sum, session) => 
      sum + (session.duration_minutes || 0), 0
    );

    // Focus score (based on completed sessions vs total sessions)
    const completedSessions = studySessions.filter(session => 
      session.status === 'completed' && new Date(session.started_at) >= tenDaysAgo
    );
    const focusScore = studySessions.length > 0 ? 
      Math.round((completedSessions.length / studySessions.length) * 100) : 0;

    // Consistency (days studied in last 15 days)
    const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
    const recentSessions = studySessions.filter(session => 
      new Date(session.started_at) >= fifteenDaysAgo
    );
    const uniqueDays = new Set(
      recentSessions.map(session => 
        new Date(session.started_at).toDateString()
      )
    ).size;
    let consistency = Math.round((uniqueDays / 15) * 100);

    // If no sessions, show 0% consistency
    if (recentSessions.length === 0) {
      consistency = 0;
    }

    // Mocks done this month
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const mocksThisMonth = mockTests.filter(mock => 
      new Date(mock.created_at) >= thisMonth
    ).length;

    // Current streak (consecutive days with study sessions)
    const currentStreak = this.calculateStreak(studySessions);

    return {
      last10DaysAvg: this.formatTime(last10DaysAvg),
      todayStudy: this.formatTime(todayMinutes),
      focusScore,
      consistency,
      mocksDone: mocksThisMonth,
      currentStreak
    };
  }

  private async calculateSubjectBreakdown(studySessions: any[]) {
    // Group sessions by subject_id and calculate total hours
    const subjectHours = new Map<number, number>();
    
    studySessions.forEach(session => {
      if (session.subject_id) {
        const currentHours = subjectHours.get(session.subject_id) || 0;
        const sessionHours = (session.duration_minutes || 0) / 60;
        subjectHours.set(session.subject_id, currentHours + sessionHours);
      }
    });

    // Convert to array and sort by hours
    const subjectData = Array.from(subjectHours.entries()).map(([subjectId, hours]) => ({
      subjectId,
      hours: Math.round(hours * 10) / 10
    })).sort((a, b) => b.hours - a.hours);

    // Fetch subject names from database
    const subjectIds = subjectData.map(s => s.subjectId);
    const { data: subjects, error } = await supabase
      .from('subjects')
      .select('id, name, color')
      .in('id', subjectIds);

    if (error) {
      console.error('Error fetching subjects:', error);
      return [];
    }

    const subjectMap = new Map();
    subjects?.forEach(subject => {
      subjectMap.set(subject.id, subject);
    });

    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

    return subjectData.slice(0, 5).map((subject, index) => {
      const subjectInfo = subjectMap.get(subject.subjectId);
      return {
        name: subjectInfo?.name || `Subject ${subject.subjectId}`,
        hours: subject.hours,
        color: subjectInfo?.color || colors[index] || "#6B7280"
      };
    });
  }

  private calculateWeeklyProgress(studySessions: any[]) {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const daySessions = studySessions.filter(session => {
        const sessionDate = new Date(session.started_at);
        return sessionDate >= dayStart && sessionDate < dayEnd;
      });
      
      const hours = daySessions.reduce((sum, session) => 
        sum + (session.duration_minutes || 0), 0
      ) / 60;
      
      weeklyData.push({
        day: weekDays[date.getDay()],
        hours: Math.round(hours * 10) / 10,
        sessions: daySessions.length,
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    
    return { weeklyData };
  }

  private calculateMonthlyProgress(studySessions: any[]) {
    const monthlyData = [];
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(now.getFullYear(), now.getMonth(), day);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const daySessions = studySessions.filter(session => {
        const sessionDate = new Date(session.started_at);
        return sessionDate >= dayStart && sessionDate < dayEnd;
      });
      
      const hours = daySessions.reduce((sum, session) => 
        sum + (session.duration_minutes || 0), 0
      ) / 60;
      
      monthlyData.push({
        day: day.toString(),
        hours: Math.round(hours * 10) / 10,
        sessions: daySessions.length,
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    
    return { monthlyData };
  }

  private calculateYearlyProgress(studySessions: any[]) {
    const yearlyData = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    
    for (let month = 0; month < 12; month++) {
      const monthStart = new Date(now.getFullYear(), month, 1);
      const monthEnd = new Date(now.getFullYear(), month + 1, 0);
      
      const monthSessions = studySessions.filter(session => {
        const sessionDate = new Date(session.started_at);
        return sessionDate >= monthStart && sessionDate <= monthEnd;
      });
      
      const hours = monthSessions.reduce((sum, session) => 
        sum + (session.duration_minutes || 0), 0
      ) / 60;
      
      yearlyData.push({
        month: months[month],
        hours: Math.round(hours * 10) / 10
      });
    }
    
    return { yearlyData };
  }

  private calculateFlashcardStats(reviewSessions: any[], flashcards: any[]) {
    const hasFlashcards = flashcards.length > 0;
    const hasRecentActivity = reviewSessions.length > 0;

    // If no recent activity, create appropriate message based on whether user has flashcards
    if (!hasRecentActivity) {
      if (hasFlashcards) {
        // User has flashcards but no recent activity
        return {
          totalXP: 0,
          currentLevel: 1,
          currentStreak: 0,
          longestStreak: 0,
          totalSessions: 0,
          cardsReviewed: 0,
          accuracy: 0,
          lastSession: 'Never',
          lastSessionXP: 0,
          recentActivity: [{
            action: 'Not Practice',
            detail: 'Please go ahead and revise the flashcard and practice',
            time: 'Now'
          }]
        };
      } else {
        // User has no flashcards and no recent activity
        return {
          totalXP: 0,
          currentLevel: 1,
          currentStreak: 0,
          longestStreak: 0,
          totalSessions: 0,
          cardsReviewed: 0,
          accuracy: 0,
          lastSession: 'Never',
          lastSessionXP: 0,
          recentActivity: [{
            action: 'Add Flashcards',
            detail: 'Please add your hard topics and mistakes to regularly revise them',
            time: 'Now'
          }]
        };
      }
    }

    const latestSession = reviewSessions[0];
    const totalXP = latestSession.total_xp_earned || 0;
    const currentLevel = latestSession.level || 1;
    const currentStreak = latestSession.streak_count || 0;
    
    // Calculate longest streak
    const longestStreak = Math.max(...reviewSessions.map(s => s.streak_count || 0));
    
    // Calculate total cards reviewed
    const cardsReviewed = reviewSessions.reduce((sum, session) => 
      sum + (session.cards_reviewed || 0), 0
    );
    
    // Calculate accuracy
    const totalCorrect = reviewSessions.reduce((sum, session) => 
      sum + (session.correct_count || 0), 0
    );
    const totalIncorrect = reviewSessions.reduce((sum, session) => 
      sum + (session.incorrect_count || 0), 0
    );
    const accuracy = totalCorrect + totalIncorrect > 0 ? 
      Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100) : 0;
    
    // Last session time
    const lastSession = this.formatTimeAgo(new Date(latestSession.created_at));

    // Generate recent activity from review sessions
    const recentActivity = reviewSessions.slice(0, 3).map(session => ({
      action: `XP +${session.total_xp_earned || 40}`,
      detail: `${session.cards_reviewed || 0} cards reviewed`,
      time: this.formatTimeAgo(new Date(session.created_at))
    }));

    return {
      totalXP,
      currentLevel,
      currentStreak,
      longestStreak,
      totalSessions: reviewSessions.length,
      cardsReviewed,
      accuracy,
      lastSession,
      lastSessionXP: latestSession.total_xp_earned || 0,
      recentActivity
    };
  }

  private async calculatePomodoroStats(studySessions: any[]) {
    const pomodoroSessions = studySessions.filter(session => 
      session.session_type === 'focus'
    );
    
    const sessionTypes = [
      { type: 'Focus', count: pomodoroSessions.length, color: '#3B82F6' },
      { type: 'Short Break', count: studySessions.filter(s => s.session_type === 'short_break').length, color: '#10B981' },
      { type: 'Long Break', count: studySessions.filter(s => s.session_type === 'long_break').length, color: '#F59E0B' }
    ];
    
    const totalSessions = sessionTypes.reduce((sum, type) => sum + type.count, 0);
    const focusRatio = totalSessions > 0 ? Math.round((sessionTypes[0].count / totalSessions) * 100) : 0;
    
    const totalMinutes = studySessions.reduce((sum, session) => 
      sum + (session.duration_minutes || 0), 0
    );
    
    // Calculate real subject time breakdown from study sessions
    const subjectTimeMap = new Map<number, number>();
    
    // Group sessions by subject_id and calculate total minutes
    studySessions.forEach(session => {
      if (session.subject_id && session.duration_minutes) {
        const currentMinutes = subjectTimeMap.get(session.subject_id) || 0;
        subjectTimeMap.set(session.subject_id, currentMinutes + session.duration_minutes);
      }
    });

    // Fetch subject names from database
    const subjectIds = Array.from(subjectTimeMap.keys());
    const { data: subjects, error } = await supabase
      .from('subjects')
      .select('id, name')
      .in('id', subjectIds);

    if (error) {
      console.error('Error fetching subjects for Pomodoro stats:', error);
    }

    const subjectMap = new Map();
    subjects?.forEach(subject => {
      subjectMap.set(subject.id, subject);
    });

    // Convert to array, ensure unique subjects, and sort by minutes
    const subjectTime = Array.from(subjectTimeMap.entries())
      .map(([subjectId, minutes]) => {
        const subjectInfo = subjectMap.get(subjectId);
        return {
          subject: subjectInfo?.name || `Subject ${subjectId}`,
          minutes: Math.round(minutes)
        };
      })
      .filter((item, index, self) => 
        // Remove duplicates based on subject name
        index === self.findIndex(t => t.subject === item.subject)
      )
      .sort((a, b) => b.minutes - a.minutes)
      .slice(0, 5); // Show top 5 subjects

    return {
      totalSessions,
      focusRatio,
      totalTime: Math.round(totalMinutes / 60),
      sessionTypes,
      subjectTime
    };
  }

  private calculateMockStats(mockTests: any[], battleLogs: any[]) {
    if (mockTests.length === 0) {
      return {
        totalMocks: 0,
        avgScore: 0,
        highestScore: 0,
        lowestScore: 0,
        accuracy: 0,
        currentStreak: 0,
        bestStreak: 0,
        pending: 0,
        mockSpeedData: [],
        mockTrend: [],
        recentMocks: []
      };
    }

    const scores = mockTests.map(mock => mock.total_score || 0).filter(score => score > 0);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
    const highestScore = Math.max(...scores, 0);
    const lowestScore = Math.min(...scores, 0);
    
    // Calculate accuracy from battle logs
    const correctAnswers = battleLogs.filter(log => log.is_correct).length;
    const totalAnswers = battleLogs.length;
    const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;
    
    // Calculate streaks
    const currentStreak = this.calculateStreak(mockTests.map(mock => ({ started_at: mock.created_at })));
    const bestStreak = Math.max(...mockTests.map(mock => mock.streak || 0), 0);
    
    // Speed analysis from battle logs
    const fastQuestions = battleLogs.filter(log => (log.time_spent || 0) <= 30).length;
    const slowQuestions = battleLogs.filter(log => (log.time_spent || 0) >= 80).length;
    const normalQuestions = totalAnswers - fastQuestions - slowQuestions;
    
    const mockSpeedData = [
      { category: 'Fast (≤30s)', count: fastQuestions, percentage: Math.round((fastQuestions / totalAnswers) * 100) || 0, color: '#3B82F6' },
      { category: 'Normal', count: normalQuestions, percentage: Math.round((normalQuestions / totalAnswers) * 100) || 0, color: '#10B981' },
      { category: 'Slow (≥80s)', count: slowQuestions, percentage: Math.round((slowQuestions / totalAnswers) * 100) || 0, color: '#F59E0B' }
    ];
    
    // Mock trend (last 7 days)
    const mockTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const dayMocks = mockTests.filter(mock => {
        const mockDate = new Date(mock.created_at);
        return mockDate >= dayStart && mockDate < dayEnd;
      });
      
      const avgScore = dayMocks.length > 0 ? 
        Math.round(dayMocks.reduce((sum, mock) => sum + (mock.total_score || 0), 0) / dayMocks.length) : 0;
      
      mockTrend.push({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][date.getDay()],
        score: avgScore,
        questions: dayMocks.length * 100 // Assuming 100 questions per mock
      });
    }
    
    // Recent mocks
    const recentMocks = mockTests.slice(0, 3).map((mock, index) => ({
      name: `Mock ${mockTests.length - index}`,
      score: mock.total_score || 0,
      date: this.formatTimeAgo(new Date(mock.created_at))
    }));

    return {
      totalMocks: mockTests.length,
      avgScore,
      highestScore,
      lowestScore,
      accuracy,
      currentStreak,
      bestStreak,
      pending: 0, // You can calculate this based on your logic
      mockSpeedData,
      mockTrend,
      recentMocks
    };
  }

  private calculateStreak(sessions: any[]): number {
    if (sessions.length === 0) return 0;
    
    const sortedSessions = sessions
      .map(s => new Date(s.started_at || s.created_at))
      .sort((a, b) => b.getTime() - a.getTime());
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) { // Check last 30 days
      const dayStart = new Date(currentDate.getTime() - i * 24 * 60 * 60 * 1000);
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const hasSession = sortedSessions.some(sessionDate => 
        sessionDate >= dayStart && sessionDate < dayEnd
      );
      
      if (hasSession) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  private formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins.toString().padStart(2, '0')}m`;
  }

  private formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return 'Just now';
    }
  }
} 