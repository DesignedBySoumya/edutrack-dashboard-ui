import { create } from "zustand";

export type BattleConfig = {
  studentId: string;
  dobPassword: string;
  testType: 'full-length' | 'subject-wise';
  duration: number;
};

type BattleStore = {
  // Timer and battle state
  timeLeft: number;
  totalDuration: number;
  isActive: boolean;
  isPaused: boolean;
  phase: 'idle' | 'active' | 'completed';
  config: BattleConfig | null;

  // Actions
  setConfig: (config: BattleConfig) => void;
  startBattle: () => void;
  endBattle: () => void;
  updateTimeLeft: (time: number) => void;
  pauseBattle: () => void;
  resumeBattle: () => void;
};

export const useBattleStore = create<BattleStore>((set, get) => ({
  timeLeft: 0,
  totalDuration: 0,
  isActive: false,
  isPaused: false,
  phase: 'idle',
  config: null,

  setConfig: (config) => set({ config, timeLeft: config.duration * 60, totalDuration: config.duration * 60 }),
  startBattle: () => set({ isActive: true, isPaused: false, phase: 'active' }),
  endBattle: () => set({ isActive: false, isPaused: false, phase: 'completed' }),
  updateTimeLeft: (time) => set({ timeLeft: time }),
  pauseBattle: () => set({ isPaused: true }),
  resumeBattle: () => set({ isPaused: false }),
})); 