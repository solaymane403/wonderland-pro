export interface Position {
  x: number;
  y: number;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

export interface DraggableItem {
  id: string;
  x: number;
  y: number;
  icon: string;
  color: string;
  message: string;
}

export interface Discovery {
  id: string;
  message: string;
  timestamp: number;
  type: 'info' | 'success' | 'special' | 'rare';
}

export type WeatherType = 'sunny' | 'cloudy' | 'night' | 'sunset' | 'rain' | 'snow';
export type ThemeType = 'light' | 'dark' | 'neon' | 'pastel';

export interface AppState {
  score: number;
  highScore: number;
  discoveries: Discovery[];
  theme: ThemeType;
  weather: WeatherType;
  addScore: (points: number) => void;
  addDiscovery: (discovery: Omit<Discovery, 'id' | 'timestamp'>) => void;
  setTheme: (theme: ThemeType) => void;
  setWeather: (weather: WeatherType) => void;
  reset: () => void;
}