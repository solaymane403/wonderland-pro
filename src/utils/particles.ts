import type { Particle } from '@/types';

export const updateParticle = (particle: Particle, deltaTime: number): Particle => {
  return {
    ...particle,
    x: particle.x + particle.vx * deltaTime,
    y: particle.y + particle.vy * deltaTime,
    vy: particle.vy + 0.2, // Gravity
    life: particle.life - deltaTime * 0.02,
  };
};

export const generateConfetti = (x: number, y: number, count: number = 20): Particle[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: Date.now() + i,
    x,
    y,
    vx: (Math.random() - 0.5) * 15,
    vy: Math.random() * -15 - 5,
    color: `hsl(${Math.random() * 360}, 80%, 60%)`,
    size: Math.random() * 8 + 4,
    life: 1,
  }));
};