import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

const modes: Array<{ key: 'default' | 'hacker' | 'retro' | 'calm'; label: string }> = [
  { key: 'default', label: 'Default' },
  { key: 'hacker', label: 'Hacker' },
  { key: 'retro', label: 'Retro' },
  { key: 'calm', label: 'Calm' },
];

export const ModeToggle: React.FC = () => {
  const mode = useAppStore((s) => s.mode);
  const setMode = useAppStore((s) => s.setMode);
  const autoTheme = useAppStore((s) => s.autoTheme);
  const setAutoTheme = useAppStore((s) => s.setAutoTheme);

  useEffect(() => {
    // apply mode as a data attribute on documentElement for CSS targeting
    document.documentElement.setAttribute('data-mode', mode);
  }, [mode]);

  // Auto-theme: simple time-based switch (day/night)
  useEffect(() => {
    if (!autoTheme) return;
    const applyBasedOnTime = () => {
      const h = new Date().getHours();
      if (h >= 19 || h < 6) setMode('retro');
      else setMode('default');
    };
    applyBasedOnTime();
    const tid = setInterval(applyBasedOnTime, 1000 * 60 * 5);
    return () => clearInterval(tid);
  }, [autoTheme, setMode]);

  const cycle = () => {
    const i = modes.findIndex((m) => m.key === mode as any);
    const next = modes[(i + 1) % modes.length].key;
    setMode(next);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
      <button onClick={cycle} className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/10">
        Mode: <span className="font-bold ml-2">{mode}</span>
      </button>
      <label className="flex items-center gap-2 bg-white/6 px-3 py-2 rounded-lg">
        <input type="checkbox" checked={autoTheme} onChange={(e) => setAutoTheme(e.target.checked)} />
        <span className="text-sm">Auto</span>
      </label>
    </div>
  );
};

export default ModeToggle;
