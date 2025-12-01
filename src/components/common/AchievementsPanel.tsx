import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import Badge from './Badge';

export const AchievementsPanel: React.FC = () => {
  const achievements = useAppStore((s) => s.achievements);

  if (!achievements || achievements.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 space-y-3">
      {achievements.slice(0, 5).map((a) => (
        <div key={a.id}>
          <Badge title={a.title} description={a.description} />
        </div>
      ))}
    </div>
  );
};

export default AchievementsPanel;
