import React from 'react';
import { motion } from 'framer-motion';

interface BadgeProps {
  title?: string;
  label?: string;
  description?: string;
  icon?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ title, label, description, icon }) => {
  const text = label || title || '';
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="bg-gradient-to-r from-cyan-500/30 to-blue-500/30 backdrop-blur-xl px-4 py-2 rounded-full border border-cyan-400/30 inline-flex flex-col items-start gap-1"
    >
      {icon && <span>{icon}</span>}
      <span className="text-white font-semibold text-sm">{text}</span>
      {description && <span className="text-white/60 text-xs">{description}</span>}
    </motion.div>
  );
};

export default Badge;
