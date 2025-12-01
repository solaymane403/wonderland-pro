import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
  highScore?: number;
  index: number;
}

export const GameCard: React.FC<GameCardProps> = ({
  title,
  description,
  icon: Icon,
  color,
  onClick,
  highScore,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: 'spring' }}
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-3xl p-8 cursor-pointer
        bg-gradient-to-br ${color}
        shadow-2xl hover:shadow-[0_0_50px_rgba(255,255,255,0.3)]
        transition-all duration-300
      `}
    >
      <motion.div
        animate={{
          rotate: [0, 10, -10, 0],
          y: [0, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="mb-6"
      >
        <Icon size={80} className="text-white drop-shadow-2xl mx-auto" />
      </motion.div>

      <h3 className="text-3xl font-bold text-white text-center mb-3">
        {title}
      </h3>
      <p className="text-white/90 text-center text-lg mb-4">{description}</p>

      {highScore !== undefined && highScore > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white font-bold text-center"
        >
          Best: {highScore}
        </motion.div>
      )}

      {/* Shine effect */}
      <motion.div
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{ width: '50%' }}
      />
    </motion.div>
  );
};