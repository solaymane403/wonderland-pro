import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface DraggableElementProps {
  id: string;
  x: number;
  y: number;
  icon: LucideIcon;
  color: string;
  message: string;
  points: number;
  onDrag?: (id: string, x: number, y: number) => void;
  onClick?: (e: React.MouseEvent) => void;
}

export const DraggableElement: React.FC<DraggableElementProps> = ({
  id,
  x,
  y,
  icon: Icon,
  color,
  onDrag,
  onClick,
}) => {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      onDrag={(_e, info) => onDrag?.(id, info.point.x, info.point.y)}
      onClick={onClick}
      whileHover={{ scale: 1.3 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, rotate: -180 }}
      animate={{
        scale: 1,
        rotate: 0,
        y: [0, -15, 0],
      }}
      transition={{
        scale: { duration: 0.5 },
        rotate: { duration: 0.5 },
        y: {
          duration: 2 + Math.random() * 2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
      className="absolute cursor-grab active:cursor-grabbing z-20"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Icon
          size={64}
          className={`${color} drop-shadow-2xl`}
          style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.8))' }}
        />
      </motion.div>

      <motion.div
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-full blur-2xl bg-white/30"
      />
    </motion.div>
  );
};
