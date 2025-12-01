import { useState, useCallback } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

export const useParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const createBurst = useCallback((x: number, y: number, count: number = 12) => {
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      size: Math.random() * 6 + 2,
      life: 1,
    }));

    setParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 1000);
  }, []);

  const clearParticles = useCallback(() => {
    setParticles([]);
  }, []);

  return { particles, createBurst, clearParticles };
};