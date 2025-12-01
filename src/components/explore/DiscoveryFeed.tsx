import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Trophy, Gift } from 'lucide-react';
import type { Discovery } from '@/types';

interface DiscoveryFeedProps {
  discoveries: Discovery[];
}

const typeIcons = {
  info: Sparkles,
  success: Star,
  special: Trophy,
  rare: Gift,
};

export const DiscoveryFeed: React.FC<DiscoveryFeedProps> = ({ discoveries }) => {
  return (
    <div className="fixed top-24 right-8 max-w-sm space-y-3 z-30">
      <AnimatePresence>
        {discoveries.slice(0, 5).map((discovery) => {
          const IconComponent = typeIcons[discovery.type as keyof typeof typeIcons];
          return (
            <motion.div
              key={discovery.id}
              initial={{ x: 400, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 400, opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className={`
                bg-gradient-to-r backdrop-blur-2xl p-4 rounded-2xl shadow-2xl border
                ${discovery.type === 'rare' ? 'from-yellow-500/80 to-orange-500/80 border-yellow-400/50' :
                  discovery.type === 'special' ? 'from-purple-500/80 to-pink-500/80 border-purple-400/50' :
                  discovery.type === 'success' ? 'from-green-500/80 to-emerald-500/80 border-green-400/50' :
                  'from-cyan-500/80 to-blue-500/80 border-cyan-400/50'}
              `}
            >
              <div className="flex items-center gap-3">
                {IconComponent && <IconComponent className="text-white" size={24} />}
                <p className="text-white font-bold flex-1">{discovery.message}</p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
