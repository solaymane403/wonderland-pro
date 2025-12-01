import React, { useState } from 'react';
import useAppStore from '@/store/useAppStore';

const PRESET_COLORS = ['#7c3aed', '#06b6d4', '#f97316', '#ef4444', '#10b981'];

const CustomizationPanel: React.FC = () => {
  const customization = useAppStore((s: any) => s.customization);
  const setPrimaryColor = useAppStore((s: any) => s.setPrimaryColor);
  const toggleParticles = useAppStore((s: any) => s.toggleParticles);

  const [open, setOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen((v) => !v)}
          className="px-3 py-2 rounded-md bg-white/90 shadow hover:scale-105 transition-transform"
          aria-expanded={open}
        >
          Customize
        </button>
      </div>

      {open && (
        <div className="mt-2 w-64 bg-white/95 p-4 rounded-lg shadow-lg">
          <h4 className="font-semibold mb-2">Appearance</h4>

          <div className="mb-3">
            <label className="text-xs text-gray-600">Primary color</label>
            <div className="flex gap-2 mt-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setPrimaryColor(c)}
                  className="w-8 h-8 rounded-full border-2"
                  style={{ background: c, borderColor: customization.primaryColor === c ? '#00000020' : 'transparent' }}
                />
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="text-xs text-gray-600">Particles</label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="checkbox"
                checked={customization.particlesEnabled}
                onChange={(e) => toggleParticles(e.target.checked)}
              />
              <span className="text-sm text-gray-700">Enable particle effects</span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              className="text-sm text-gray-600"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizationPanel;
