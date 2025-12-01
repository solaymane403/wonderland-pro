// src/pages/LabPage.tsx
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Beaker, Palette, Wand2, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { Navigation } from '../components/common/Navigation';

export const LabPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particleCount, setParticleCount] = useState(150);
  const [particleColor, setParticleColor] = useState('#00d4ff');
  const [particleSize, setParticleSize] = useState(3);
  const [connectionDistance, setConnectionDistance] = useState(100);
  const [isActive, setIsActive] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const colorPresets = [
    { name: 'Cyber Cyan', color: '#00d4ff' },
    { name: 'Electric Blue', color: '#0ea5e9' },
    { name: 'Purple Haze', color: '#a78bfa' },
    { name: 'Neon Pink', color: '#f472b6' },
    { name: 'Toxic Green', color: '#10b981' },
    { name: 'Sunset Glow', color: '#f59e0b' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }

    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * particleSize + 1,
      });
    }

    let animationId: number;

    const animate = () => {
      if (!isActive) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        const dx = mousePos.x - particle.x;
        const dy = mousePos.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          particle.vx += dx * 0.0001;
          particle.vy += dy * 0.0001;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();

        particles.slice(i + 1).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `${particleColor}${Math.floor((1 - distance / connectionDistance) * 100).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [particleCount, particleColor, particleSize, connectionDistance, isActive, mousePos]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const playTone = (frequency: number) => {
    if (!soundEnabled) return;
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.3);

    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + 0.3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />

      <div className="pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <Beaker size={100} className="text-emerald-400 mx-auto mb-6" />
            </motion.div>
            <h1 className="text-7xl font-black text-white mb-4">🧪 Creative Lab</h1>
            <p className="text-3xl text-white/80">Experiment with particles and create art</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Canvas */}
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Sparkles size={28} className="text-cyan-400" />
                    Particle System
                  </h3>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsActive(!isActive)} className={`px-6 py-3 rounded-xl font-bold text-white ${isActive ? 'bg-red-500' : 'bg-green-500'}`}>
                    {isActive ? 'Pause' : 'Play'}
                  </motion.button>
                </div>

                <canvas ref={canvasRef} onMouseMove={handleMouseMove} className="w-full h-[500px] bg-black rounded-2xl shadow-2xl cursor-crosshair" />

                <div className="mt-4 text-center text-white/60 text-sm">
                  💡 Move your mouse over the canvas to interact with particles
                </div>
              </motion.div>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              {/* Particle Count */}
              <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white/5 backdrop-blur-2xl p-6 rounded-2xl border border-white/10">
                <label className="block text-white font-bold mb-3 text-lg">
                  <Wand2 className="inline mr-2" size={20} />
                  Particle Count: {particleCount}
                </label>
                <input type="range" min="10" max="300" value={particleCount} onChange={(e) => setParticleCount(Number(e.target.value))} className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer" />
              </motion.div>

              {/* Particle Size */}
              <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white/5 backdrop-blur-2xl p-6 rounded-2xl border border-white/10">
                <label className="block text-white font-bold mb-3 text-lg">
                  Particle Size: {particleSize}
                </label>
                <input type="range" min="1" max="8" value={particleSize} onChange={(e) => setParticleSize(Number(e.target.value))} className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer" />
              </motion.div>

              {/* Connection Distance */}
              <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white/5 backdrop-blur-2xl p-6 rounded-2xl border border-white/10">
                <label className="block text-white font-bold mb-3 text-lg">
                  Connection Distance: {connectionDistance}
                </label>
                <input type="range" min="50" max="200" value={connectionDistance} onChange={(e) => setConnectionDistance(Number(e.target.value))} className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer" />
              </motion.div>

              {/* Color Picker */}
              <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-white/5 backdrop-blur-2xl p-6 rounded-2xl border border-white/10">
                <label className="block text-white font-bold mb-3 text-lg">
                  <Palette className="inline mr-2" size={20} />
                  Particle Color
                </label>
                <input type="color" value={particleColor} onChange={(e) => setParticleColor(e.target.value)} className="w-full h-16 rounded-xl cursor-pointer bg-transparent" />

                <div className="grid grid-cols-3 gap-2 mt-4">
                  {colorPresets.map((preset) => (
                    <motion.button key={preset.name} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => {
                      setParticleColor(preset.color);
                      playTone(440 + Math.random() * 200);
                    }} className="h-12 rounded-xl shadow-lg border-2 border-white/20 hover:border-white/40 transition-all" style={{ backgroundColor: preset.color }} title={preset.name} />
                  ))}
                </div>
              </motion.div>

              {/* Sound Toggle */}
              <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="bg-white/5 backdrop-blur-2xl p-6 rounded-2xl border border-white/10">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSoundEnabled(!soundEnabled)} className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-3 ${soundEnabled ? 'bg-green-500' : 'bg-gray-500'}`}>
                  {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                  {soundEnabled ? 'Sound On' : 'Sound Off'}
                </motion.button>
              </motion.div>

              {/* Presets */}
              <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="bg-white/5 backdrop-blur-2xl p-6 rounded-2xl border border-white/10">
                <h4 className="text-white font-bold mb-3 text-lg">Quick Presets</h4>
                <div className="space-y-2">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => {
                    setParticleCount(100);
                    setParticleSize(2);
                    setConnectionDistance(80);
                  }} className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-white py-3 rounded-xl font-medium transition-all">
                    Minimal
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => {
                    setParticleCount(200);
                    setParticleSize(4);
                    setConnectionDistance(120);
                  }} className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-white py-3 rounded-xl font-medium transition-all">
                    Dense
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => {
                    setParticleCount(50);
                    setParticleSize(6);
                    setConnectionDistance(150);
                  }} className="w-full bg-pink-500/20 hover:bg-pink-500/30 text-white py-3 rounded-xl font-medium transition-all">
                    Cosmic
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};