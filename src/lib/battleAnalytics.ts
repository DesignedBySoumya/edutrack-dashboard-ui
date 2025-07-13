import { supabase } from './supabaseClient';

export interface BattleQuestion {
  isCorrect: boolean;
  timeSpent: number;
  confidence: 'low' | 'medium' | 'high';
  questionId: number;
  questionNumber: number;
  selectedAnswer: number;
  correctAnswer: number;
  answeredAt: string;
}

export interface BattleSession {
  startTime: string;
  questions: BattleQuestion[];
  totalQuestions: number;
  totalTimeSpent: number;
  correctAnswers: number;
  accuracy: number;
  averageTimePerQuestion: number;
  beastModeCount: number;
  beastModePercentage: number;
  tooSlowCount: number;
  tooSlowPercentage: number;
}

export interface AnalyticsData {
  sessions: BattleSession[];
  totalSessions: number;
  totalQuestions: number;
  overallAccuracy: number;
  overallAverageTime: number;
  overallBeastModePercentage: number;
  overallTooSlowPercentage: number;
  improvementTrend: {
    recentAccuracy: number;
    earlyAccuracy: number;
    accuracyImprovement: number;
    recentBeastMode: number;
    earlyBeastMode: number;
    beastModeImprovement: number;
  };
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  lastActivityDate: string | null;
  streakHistory: {
    date: string;
    sessionsCount: number;
    totalQuestions: number;
  }[];
}

export class BattleAnalyticsService {
  /**
   * Fetch all battle logs for the current user
   */
  static async fetchBattleLogs(userId: string): Promise<BattleSession[]> {
    try {
      const { data, error } = await supabase
        .from('battle_logs')
        .select('*')
        .eq('user_id', userId)
        .order('battle_started_at', { ascending: false })
        .order('question_number', { ascending: true });

      if (error) {
        console.error('Error fetching battle logs:', error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      // Group by battle_started_at to create sessions
      const sessionsMap = new Map<string, BattleQuestion[]>();

      data.forEach((log) => {
        const sessionKey = log.battle_started_at;
        if (!sessionsMap.has(sessionKey)) {
          sessionsMap.set(sessionKey, []);
        }

        sessionsMap.get(sessionKey)!.push({
          isCorrect: log.is_correct,
          timeSpent: log.time_spent,
          confidence: log.confidence,
          questionId: log.question_id,
          questionNumber: log.question_number,
          selectedAnswer: log.selected_answer,
          correctAnswer: log.correct_answer,
          answeredAt: log.answered_at
        });
      });

      // Convert to BattleSession array with calculated metrics
      const sessions: BattleSession[] = Array.from(sessionsMap.entries()).map(([startTime, questions]) => {
        const totalQuestions = questions.length;
        const totalTimeSpent = questions.reduce((sum, q) => sum + q.timeSpent, 0);
        const correctAnswers = questions.filter(q => q.isCorrect).length;
        const beastModeCount = questions.filter(q => q.timeSpent <= 30).length;
        const tooSlowCount = questions.filter(q => q.timeSpent > 80).length;

        return {
          startTime,
          questions,
          totalQuestions,
          totalTimeSpent,
          correctAnswers,
          accuracy: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
          averageTimePerQuestion: totalQuestions > 0 ? Math.round(totalTimeSpent / totalQuestions) : 0,
          beastModeCount,
          beastModePercentage: totalQuestions > 0 ? Math.round((beastModeCount / totalQuestions) * 100) : 0,
          tooSlowCount,
          tooSlowPercentage: totalQuestions > 0 ? Math.round((tooSlowCount / totalQuestions) * 100) : 0
        };
      });

      return sessions;
    } catch (error) {
      console.error('Error in fetchBattleLogs:', error);
      return [];
    }
  }

  /**
   * Get comprehensive analytics data
   */
  static async getAnalyticsData(userId: string): Promise<AnalyticsData> {
    const sessions = await this.fetchBattleLogs(userId);

    if (sessions.length === 0) {
      return {
        sessions: [],
        totalSessions: 0,
        totalQuestions: 0,
        overallAccuracy: 0,
        overallAverageTime: 0,
        overallBeastModePercentage: 0,
        overallTooSlowPercentage: 0,
        improvementTrend: {
          recentAccuracy: 0,
          earlyAccuracy: 0,
          accuracyImprovement: 0,
          recentBeastMode: 0,
          earlyBeastMode: 0,
          beastModeImprovement: 0
        }
      };
    }

    // Calculate overall metrics
    const totalQuestions = sessions.reduce((sum, session) => sum + session.totalQuestions, 0);
    const totalCorrect = sessions.reduce((sum, session) => sum + session.correctAnswers, 0);
    const totalTimeSpent = sessions.reduce((sum, session) => sum + session.totalTimeSpent, 0);
    const totalBeastMode = sessions.reduce((sum, session) => sum + session.beastModeCount, 0);
    const totalTooSlow = sessions.reduce((sum, session) => sum + session.tooSlowCount, 0);

    // Calculate improvement trend (last 3 vs first 3 sessions)
    const recentSessions = sessions.slice(0, 3);
    const earlySessions = sessions.slice(-3);

    const recentAccuracy = recentSessions.length > 0 
      ? Math.round(recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length)
      : 0;

    const earlyAccuracy = earlySessions.length > 0
      ? Math.round(earlySessions.reduce((sum, s) => sum + s.accuracy, 0) / earlySessions.length)
      : 0;

    const recentBeastMode = recentSessions.length > 0
      ? Math.round(recentSessions.reduce((sum, s) => sum + s.beastModePercentage, 0) / recentSessions.length)
      : 0;

    const earlyBeastMode = earlySessions.length > 0
      ? Math.round(earlySessions.reduce((sum, s) => sum + s.beastModePercentage, 0) / earlySessions.length)
      : 0;

    return {
      sessions,
      totalSessions: sessions.length,
      totalQuestions,
      overallAccuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
      overallAverageTime: totalQuestions > 0 ? Math.round(totalTimeSpent / totalQuestions) : 0,
      overallBeastModePercentage: totalQuestions > 0 ? Math.round((totalBeastMode / totalQuestions) * 100) : 0,
      overallTooSlowPercentage: totalQuestions > 0 ? Math.round((totalTooSlow / totalQuestions) * 100) : 0,
      improvementTrend: {
        recentAccuracy,
        earlyAccuracy,
        accuracyImprovement: recentAccuracy - earlyAccuracy,
        recentBeastMode,
        earlyBeastMode,
        beastModeImprovement: recentBeastMode - earlyBeastMode
      }
    };
  }

  /**
   * Get streak data
   */
  static async getStreakData(userId: string): Promise<StreakData> {
    try {
      const { data, error } = await supabase
        .from('battle_logs')
        .select('battle_started_at')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching streak data:', error);
        return {
          currentStreak: 0,
          longestStreak: 0,
          totalActiveDays: 0,
          lastActivityDate: null,
          streakHistory: []
        };
      }

      if (!data || data.length === 0) {
        return {
          currentStreak: 0,
          longestStreak: 0,
          totalActiveDays: 0,
          lastActivityDate: null,
          streakHistory: []
        };
      }

      // Extract unique dates from battle_started_at
      const uniqueDates = [...new Set(data.map((log: any) => {
        const date = new Date(log.battle_started_at);
        return date.toISOString().split('T')[0]; // YYYY-MM-DD format
      }))].sort() as string[];

      // Group sessions by date
      const sessionsByDate = new Map<string, number>();
      const questionsByDate = new Map<string, number>();

      data.forEach((log: any) => {
        const date = new Date(log.battle_started_at).toISOString().split('T')[0];
        sessionsByDate.set(date, (sessionsByDate.get(date) || 0) + 1);
        questionsByDate.set(date, (questionsByDate.get(date) || 0) + 1);
      });

      // Create streak history
      const streakHistory = uniqueDates.map((date: string) => ({
        date,
        sessionsCount: sessionsByDate.get(date) || 0,
        totalQuestions: questionsByDate.get(date) || 0
      }));

      // Calculate current streak
      const today = new Date().toISOString().split('T')[0];
      
      let currentStreak = 0;
      let checkDate = today;

      while (uniqueDates.includes(checkDate)) {
        currentStreak++;
        const checkDateObj = new Date(checkDate);
        checkDateObj.setDate(checkDateObj.getDate() - 1);
        checkDate = checkDateObj.toISOString().split('T')[0];
      }

      // Calculate longest streak
      let longestStreak = 0;
      let tempStreak = 0;
      let previousDate: string | null = null;

      for (const date of uniqueDates) {
        if (previousDate === null) {
          tempStreak = 1;
        } else {
          const prevDate = new Date(previousDate);
          const currDate = new Date(date);
          const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (dayDiff === 1) {
            tempStreak++;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
        previousDate = date;
      }
      
      longestStreak = Math.max(longestStreak, tempStreak);

      return {
        currentStreak,
        longestStreak,
        totalActiveDays: uniqueDates.length,
        lastActivityDate: uniqueDates.length > 0 ? uniqueDates[uniqueDates.length - 1] : null,
        streakHistory
      };
    } catch (error) {
      console.error('Error in getStreakData:', error);
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalActiveDays: 0,
        lastActivityDate: null,
        streakHistory: []
      };
    }
  }

  /**
   * Get session data in the exact format you requested
   */
  static async getSessionData(userId: string): Promise<{
    startTime: string;
    questions: {
      isCorrect: boolean;
      timeSpent: number;
      confidence: string;
      questionId: number;
    }[];
  }[]> {
    const sessions = await this.fetchBattleLogs(userId);
    
    return sessions.map(session => ({
      startTime: session.startTime,
      questions: session.questions.map(q => ({
        isCorrect: q.isCorrect,
        timeSpent: q.timeSpent,
        confidence: q.confidence,
        questionId: q.questionId
      }))
    }));
  }
} 