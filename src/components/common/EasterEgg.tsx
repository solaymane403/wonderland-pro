import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSound } from '@/hooks/useSound';
import { generateConfetti } from '@/utils/particles';
import { ParticleSystem } from './ParticleSystem';
import { useAppStore } from '@/store/useAppStore';

const SECRET = ['w', 'o', 'n', 'd', 'e', 'r'];

export const EasterEgg: React.FC = () => {
  const [_progress, setProgress] = useState<string[]>([]);
  const [active, setActive] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);
  const hintTimeout = useRef<number | null>(null);
  const { playSuccess } = useSound();
  const addDiscovery = useAppStore((s) => s.addDiscovery);
  const addScore = useAppStore((s) => s.addScore);
  const addAchievement = useAppStore((s) => s.addAchievement);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      setProgress((p) => {
        const next = [...p, k].slice(-SECRET.length);
        if (next.join('') === SECRET.join('')) {
          triggerEgg();
        }
        return next;
      });
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const triggerEgg = () => {
    if (active) return;
    setActive(true);
    playSuccess();
    addDiscovery({ message: '✨ You found a secret! +200 points', type: 'rare' });
    addScore(200);
    addAchievement({ key: 'secret_finder', title: 'Secret Finder', description: 'Discovered the hidden Easter egg' });
    // generate confetti at center
    const confetti = generateConfetti(window.innerWidth / 2, window.innerHeight / 3, 80);
    setParticles(confetti);

    // remove particles after 3s
    setTimeout(() => setParticles([]), 3000);

    // auto-hide active overlay
    hintTimeout.current = window.setTimeout(() => setActive(false), 3500);
  };

  useEffect(() => {
    return () => {
      if (hintTimeout.current) window.clearTimeout(hintTimeout.current);
    };
  }, []);

  return (
    <>
      <ParticleSystem particles={particles} className="pointer-events-none" />

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-40 pointer-events-none"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-pink-400 text-white px-8 py-6 rounded-3xl shadow-2xl">
              <div className="text-3xl font-bold">🎉 Secret Discovered!</div>
              <div className="text-sm opacity-90 mt-2">You've unlocked a special surprise.</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EasterEgg;
