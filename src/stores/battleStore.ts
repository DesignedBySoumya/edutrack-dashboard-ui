
import { create } from 'zustand';

export type BattlePhase = 'config' | 'active' | 'completed';

interface BattleState {
  phase: BattlePhase;
  isActive: boolean;
  currentSession: any;
  setPhase: (phase: BattlePhase) => void;
  setActive: (active: boolean) => void;
  setCurrentSession: (session: any) => void;
}

export const useBattleStore = create<BattleState>((set) => ({
  phase: 'config',
  isActive: false,
  currentSession: null,
  setPhase: (phase) => set({ phase }),
  setActive: (isActive) => set({ isActive }),
  setCurrentSession: (currentSession) => set({ currentSession }),
}));
