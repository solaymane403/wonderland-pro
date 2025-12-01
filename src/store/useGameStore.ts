import { create } from 'zustand';

interface GameStore {
  activeGame: string | null;
  gameScore: number;
  gameHighScores: Record<string, number>;
  setActiveGame: (game: string | null) => void;
  setGameScore: (score: number) => void;
  updateHighScore: (game: string, score: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  activeGame: null,
  gameScore: 0,
  gameHighScores: {},
  
  setActiveGame: (game) => set({ activeGame: game, gameScore: 0 }),
  setGameScore: (score) => set({ gameScore: score }),
  
  updateHighScore: (game, score) =>
    set((state) => ({
      gameHighScores: {
        ...state.gameHighScores,
        [game]: Math.max(state.gameHighScores[game] || 0, score),
      },
    })),
  
  resetGame: () => set({ activeGame: null, gameScore: 0 }),
}));