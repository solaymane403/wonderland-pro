export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  level: number;
  lives: number;
  timeLeft: number;
}

export interface ClickGameState extends GameState {
  clicks: number;
  targetClicks: number;
}

export interface MemoryGameState extends GameState {
  sequence: string[];
  userSequence: string[];
  showingSequence: boolean;
}

export interface ReactionGameState extends GameState {
  targets: Target[];
  score: number;
  combo: number;
}

export interface Target {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  points: number;
}