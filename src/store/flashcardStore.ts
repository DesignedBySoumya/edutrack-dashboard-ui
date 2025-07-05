import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabaseClient';
import { markCardCorrect as supabaseMarkCardCorrect, markCardIncorrect as supabaseMarkCardIncorrect } from '@/lib/spacedRepetition';

// Interface updated to use consistent camelCase for all properties.
export interface Flashcard {
  id: string;
  userId: string; // Changed from user_id
  question: string;
  answer: string;
  subject?: string;
  week?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  lastReviewed?: number;
  nextReview?: number;
  correctCount: number;
  incorrectCount: number;
  isStarred: boolean;
  createdAt?: string; // Changed from created_at
}

interface FlashcardStore {
  stage: number;
  cards: Flashcard[];
  currentCardIndex: number;
  points: number;
  streak: number;
  level: number;
  lastStudyDate: string;
  nextReviewTime: number | null;
  studySession: {
    correct: number;
    incorrect: number;
    total: number;
  };
  setStage: (stage: number) => void;
  // Omit updated to match the new camelCase properties in the Flashcard interface
  addCard: (card: Omit<Flashcard, 'id' | 'userId' | 'correctCount' | 'incorrectCount' | 'isStarred' | 'createdAt'>) => Promise<void>;
  updateCard: (id: string, updates: Partial<Flashcard>) => void;
  deleteCard: (id: string) => void;
  markCardCorrect: (id: string) => void;
  markCardIncorrect: (id: string) => void;
  toggleStar: (id: string) => void;
  nextCard: () => void;
  resetSession: () => void;
  updateStreak: () => void;
  addPoints: (points: number) => void;
  setNextReviewTime: (time: number) => void;
  generateCardsFromContent: (content: any) => void;
        fetchCards: () => Promise<void>;
      fetchUserStats: () => Promise<void>;
      syncUserStats: () => Promise<void>;
}

export const useFlashcardStore = create<FlashcardStore>()(
  persist(
    (set, get) => ({
      stage: 1,
      cards: [],
      currentCardIndex: 0,
      points: 0, // Will be fetched from Supabase
      streak: 0, // Will be fetched from Supabase
      level: 1, // Will be fetched from Supabase
      lastStudyDate: '',
      nextReviewTime: null,
      studySession: {
        correct: 0,
        incorrect: 0,
        total: 0,
      },

      setStage: (stage) => set({ stage }),

      addCard: async (cardData) => {
        const user = await supabase.auth.getUser();
        const userId = user?.data?.user?.id;

        if (!userId) {
          console.error("User not authenticated. Cannot create flashcard.");
          return;
        }

        const difficulty = cardData.difficulty || 'medium';

        const newCard = {
          id: crypto.randomUUID(),
          user_id: userId,
          question: cardData.question,
          answer: cardData.answer,
          subject: cardData.subject || '',
          difficulty,
          correct_count: 0,
          incorrect_count: 0,
          created_at: new Date().toISOString(),
        };

        const { error } = await supabase.from('flashcards').insert(newCard);

        if (error) {
          console.error("❌ Failed to insert card to Supabase:", error.message);
          return;
        }

        // Add to local Zustand store
        set((state) => ({
          cards: [
            ...state.cards,
            {
              id: newCard.id,
              userId: newCard.user_id,
              question: newCard.question,
              answer: newCard.answer,
              subject: newCard.subject,
              difficulty: newCard.difficulty,
              correctCount: 0,
              incorrectCount: 0,
              isStarred: false,
              createdAt: newCard.created_at,
            },
          ],
        }));
      },

      fetchCards: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          set({ cards: [] });
          return;
        }
        const { data, error } = await supabase
          .from('flashcards')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (error) {
          console.error('Error fetching cards:', error.message);
          set({ cards: [] });
          return;
        }
        // FIX: Explicitly map from snake_case (DB) to camelCase (app state)
        set({
          cards: (data || []).map((card): Flashcard => ({
            id: card.id,
            userId: card.user_id,
            question: card.question,
            answer: card.answer,
            subject: card.subject,
            difficulty: card.difficulty,
            correctCount: card.correct_count,
            incorrectCount: card.incorrect_count,
            isStarred: card.is_starred || false, // Handle potential null from DB
            createdAt: card.created_at,
            lastReviewed: card.last_reviewed,
            nextReview: card.next_review,
          })),
        });
      },

      fetchUserStats: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('No authenticated user found');
          return;
        }

        try {
          // Fetch the most recent session to get current stats
          const { data, error } = await supabase
            .from('review_sessions')
            .select('total_xp_earned, streak_count, level')
            .eq('user_id', user.id)
            .order('ended_at', { ascending: false })
            .limit(1)
            .single();

          if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error('Error fetching user stats:', error);
            return;
          }

          // Update store with fetched data or defaults
          set({
            points: data?.total_xp_earned || 0,
            streak: data?.streak_count || 0,
            level: data?.level || 1,
          });

          console.log('✅ Fetched user stats from Supabase:', {
            points: data?.total_xp_earned || 0,
            streak: data?.streak_count || 0,
            level: data?.level || 1,
          });
        } catch (error) {
          console.error('Error in fetchUserStats:', error);
        }
      },

      updateCard: (id, updates) => {
        // This function will need a similar mapping if it ever updates the DB directly.
        // For now, it only updates local state, which is fine.
        set((state) => ({
          cards: state.cards.map((card) =>
            card.id === id ? { ...card, ...updates } : card
          ),
        }));
      },

      deleteCard: (id) => {
        // Remember to also call supabase.from('flashcards').delete().eq('id', id) here!
        set((state) => ({
          cards: state.cards.filter((card) => card.id !== id),
        }));
      },

      markCardCorrect: async (id) => {
        await supabaseMarkCardCorrect(id);
        const state = get();
        const now = Date.now();
        const nextReview = now + (5 * 24 * 60 * 60 * 1000); // 5 days later
        const card = state.cards.find(c => c.id === id);
        if (!card) return;

        state.updateCard(id, {
          correctCount: card.correctCount + 1,
          lastReviewed: now,
          nextReview,
        });
        state.addPoints(30);
        set((s) => ({
          studySession: {
            ...s.studySession,
            correct: s.studySession.correct + 1,
            total: s.studySession.total + 1,
          },
        }));
      },

      markCardIncorrect: async (id) => {
        await supabaseMarkCardIncorrect(id);
        const state = get();
        const now = Date.now();
        const nextReview = now + (24 * 60 * 60 * 1000); // 1 day later
        const card = state.cards.find(c => c.id === id);
        if (!card) return;
        
        state.updateCard(id, {
          incorrectCount: card.incorrectCount + 1,
          lastReviewed: now,
          nextReview,
        });
        state.addPoints(-10);
        set((s) => ({
          studySession: {
            ...s.studySession,
            incorrect: s.studySession.incorrect + 1,
            total: s.studySession.total + 1,
          },
        }));
      },

      toggleStar: (id) => {
        const state = get();
        const card = state.cards.find(c => c.id === id);
        if (card) {
          state.updateCard(id, { isStarred: !card.isStarred });
          // Also update in DB: supabase.from('flashcards').update({ is_starred: !card.isStarred }).eq('id', id)
        }
      },

      nextCard: () => {
        set((state) => ({
          currentCardIndex: (state.currentCardIndex + 1) % state.cards.length,
        }));
      },

      resetSession: () => {
        set({
          currentCardIndex: 0,
          studySession: {
            correct: 0,
            incorrect: 0,
            total: 0,
          },
        });
      },

      updateStreak: () => {
        const today = new Date().toDateString();
        const state = get();
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
        if (state.lastStudyDate === yesterday) {
          set((s) => ({ 
            streak: s.streak + 1,
            lastStudyDate: today 
          }));
        } else if (state.lastStudyDate !== today) {
          set({ streak: 1, lastStudyDate: today });
        }
      },

      addPoints: (pointsToAdd) => {
        set((state) => {
          const newPoints = Math.max(0, state.points + pointsToAdd);
          const newLevel = Math.floor(newPoints / 500) + 1;
          return { 
            points: newPoints,
            level: newLevel
          };
        });
      },

      setNextReviewTime: (time) => {
        set({ nextReviewTime: time });
      },

      generateCardsFromContent: (content) => {
        const sampleCards = [
          {
            question: "What is the main concept discussed?",
            answer: "The main concept relates to the uploaded content analysis.",
            subject: "General",
            difficulty: 'medium' as 'medium',
          },
          {
            question: "What are the key points to remember?",
            answer: "Key points include the primary themes and supporting details.",
            subject: "General",
            difficulty: 'medium' as 'medium',
          },
          {
            question: "How does this relate to broader topics?",
            answer: "This connects to wider subject areas through shared principles.",
            subject: "General",
            difficulty: 'hard' as 'hard',
          },
        ];
        sampleCards.forEach(async (card) => {
          await get().addCard(card);
        });
      },

      syncUserStats: async () => {
        try {
          const { getUserStats } = await import('@/lib/reviewSessions');
          const stats = await getUserStats();
          set({
            points: stats.total_xp_earned,
            streak: stats.streak_count,
            level: stats.level,
          });
        } catch (error) {
          console.error('Error syncing user stats:', error);
          // Keep default values if sync fails
        }
      },
    }),
    {
      name: 'flashcard-storage',
    }
  )
);