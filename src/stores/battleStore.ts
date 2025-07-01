
import { create } from 'zustand';

export type BattlePhase = 'config' | 'active' | 'completed';

interface BattleSession {
  selectedSubjects: string[];
  timeLimit: number;
  questionCount: number;
  startTime: string;
}

interface BattleState {
  phase: BattlePhase;
  isActive: boolean;
  currentSession: BattleSession | null;
  setPhase: (phase: BattlePhase) => void;
  setActive: (active: boolean) => void;
  setCurrentSession: (session: BattleSession | null) => void;
  resetBattle: () => void;
}

export const useBattleStore = create<BattleState>((set) => ({
  phase: 'config',
  isActive: false,
  currentSession: null,
  setPhase: (phase) => set({ phase }),
  setActive: (isActive) => set({ isActive }),
  setCurrentSession: (currentSession) => set({ currentSession }),
  resetBattle: () => set({ 
    phase: 'config', 
    isActive: false, 
    currentSession: null 
  }),
}));
