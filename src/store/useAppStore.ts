// src/store/useAppStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Discovery {
  id: string;
  message: string;
  timestamp: number;
  type: 'info' | 'success' | 'special' | 'rare';
}

interface AppState {
  score: number;
  highScore: number;
  discoveries: Discovery[];
  weather: string;
  theme: string;
  mode: 'default' | 'hacker' | 'retro' | 'calm';
  autoTheme: boolean;
  customization: {
    primaryColor: string;
    particlesEnabled: boolean;
  };
  achievements: Achievement[];
  setPrimaryColor: (color: string) => void;
  toggleParticles: (enabled: boolean) => void;
  addScore: (points: number) => void;
  addDiscovery: (discovery: Omit<Discovery, 'id' | 'timestamp'>) => void;
  addAchievement: (achievement: Omit<Achievement, 'id' | 'unlockedAt'>) => void;
  setMode: (mode: 'default' | 'hacker' | 'retro' | 'calm') => void;
  setAutoTheme: (enabled: boolean) => void;
  setWeather: (weather: string) => void;
  setTheme: (theme: string) => void;
  reset: () => void;
}

interface Achievement {
  id: string;
  key: string;
  title: string;
  description?: string;
  unlockedAt: number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      score: 0,
      highScore: 0,
      discoveries: [],
      weather: 'sunny',
      theme: 'light',
      mode: 'default',
      autoTheme: true,
      customization: { primaryColor: '#7c3aed', particlesEnabled: true },
      achievements: [],

      addScore: (points: number) =>
        set((state) => ({
          score: state.score + points,
          highScore: Math.max(state.score + points, state.highScore),
        })),

      addDiscovery: (discovery) =>
        set((state) => ({
          discoveries: [
            {
              ...discovery,
              id: `discovery-${Date.now()}`,
              timestamp: Date.now(),
            },
            ...state.discoveries,
          ].slice(0, 10),
        })),

      addAchievement: (achievement) =>
        set((state) => {
          const exists = state.achievements.find((a) => a.key === achievement.key);
          if (exists) return state; // already unlocked
          const newA: Achievement = {
            id: `ach-${Date.now()}`,
            key: achievement.key,
            title: achievement.title,
            description: achievement.description,
            unlockedAt: Date.now(),
          };
          return { achievements: [newA, ...state.achievements] } as any;
        }),

      setPrimaryColor: (color: string) => set((state: any) => ({ customization: { ...state.customization, primaryColor: color } })),
      toggleParticles: (enabled: boolean) => set((state: any) => ({ customization: { ...state.customization, particlesEnabled: enabled } })),

      setMode: (mode) => set({ mode }),
      setAutoTheme: (enabled) => set({ autoTheme: enabled }),

      setWeather: (weather) => set({ weather }),
      setTheme: (theme) => set({ theme }),
      reset: () => set({ score: 0, discoveries: [] }),
    }),
    {
      name: 'wonderland-storage',
    }
  )
);

export default useAppStore;