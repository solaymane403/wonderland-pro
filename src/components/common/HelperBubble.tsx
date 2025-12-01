import React, { useEffect, useState } from 'react';
import useAppStore from '@/store/useAppStore';

const TIPS = [
  'Tip: Try pressing W O N D E R to find secrets.',
  'You can toggle visual modes from the top-right.',
  'Earn points by exploring and unlock achievements.',
  'Open the customization panel to tweak colors.',
];

const HelperBubble: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);
  const customization = useAppStore((s: any) => s.customization);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((i) => (i + 1) % TIPS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 left-6 max-w-xs z-50 p-3 rounded-lg shadow-lg bg-white/90 backdrop-blur"
      style={{ borderLeft: `4px solid ${customization.primaryColor}` }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 text-sm text-gray-900">{TIPS[tipIndex]}</div>
        <div className="flex flex-col gap-2">
          <button
            className="text-xs text-gray-600 hover:text-gray-900"
            onClick={() => setVisible(false)}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelperBubble;
