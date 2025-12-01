// src/pages/ExplorePage.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, Zap, Music, Smile, Coffee, Pizza, Sun, Moon, Cloud, CloudRain, Snowflake, Eye, Gift, Award } from 'lucide-react';
import { Navigation } from '../components/common/Navigation';
import { useAppStore } from '../store/useAppStore';
import { useSound } from '../hooks/useSound';

interface DraggableItem {
  id: string;
  x: number;
  y: number;
  icon: any;
  color: string;
  message: string;
  points: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  vx: number;
  vy: number;
}

const weatherConfig = {
  sunny: { gradient: 'from-cyan-400 via-blue-300 to-sky-200', icon: Sun, particles: '☀️' },
  cloudy: { gradient: 'from-slate-400 via-slate-300 to-blue-200', icon: Cloud, particles: '☁️' },
  night: { gradient: 'from-slate-900 via-slate-800 to-slate-900', icon: Moon, particles: '⭐' },
  sunset: { gradient: 'from-orange-400 via-pink-400 to-purple-500', icon: Sun, particles: '🌅' },
  rain: { gradient: 'from-slate-600 via-blue-500 to-slate-400', icon: CloudRain, particles: '💧' },
  snow: { gradient: 'from-blue-100 via-slate-50 to-blue-200', icon: Snowflake, particles: '❄️' },
};

export const ExplorePage: React.FC = () => {
  const [draggables, setDraggables] = useState<DraggableItem[]>([]);
  const [weather, setWeather] = useState<keyof typeof weatherConfig>('sunny');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [secretFound, setSecretFound] = useState(false);
  const [combo, setCombo] = useState(0);
  const { addScore, addDiscovery, discoveries } = useAppStore();
  const { playSuccess } = useSound();

  const icons = [Star, Heart, Zap, Music, Smile, Coffee, Pizza, Sun];
  const colors = ['text-cyan-400', 'text-pink-400', 'text-purple-400', 'text-blue-400', 'text-green-400', 'text-orange-400', 'text-red-400', 'text-yellow-400'];
  const messages = [
    { message: '⭐ Stellar discovery!', type: 'success' as const },
    { message: '💖 Love found!', type: 'info' as const },
    { message: '⚡ Electric energy!', type: 'special' as const },
    { message: '🎵 Musical vibes!', type: 'success' as const },
    { message: '😊 Pure happiness!', type: 'info' as const },
    { message: '☕ Coffee power!', type: 'rare' as const },
    { message: '🍕 Delicious!', type: 'success' as const },
    { message: '☀️ Sunshine boost!', type: 'special' as const },
  ];

  useEffect(() => {
    const items: DraggableItem[] = icons.map((Icon, i) => ({
      id: `item-${i}`,
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 15,
      icon: Icon,
      color: colors[i],
      message: messages[i].message,
      points: (i + 1) * 5,
    }));
    setDraggables(items);
  }, []);

  const createParticleBurst = (x: number, y: number) => {
    const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 1500);
  };

  const handleDrag = (id: string, clientX: number, clientY: number) => {
    const newX = (clientX / window.innerWidth) * 100;
    const newY = (clientY / window.innerHeight) * 100;
    setDraggables((prev) => prev.map((item) => (item.id === id ? { ...item, x: newX, y: newY } : item)));
  };

  const handleClick = (item: DraggableItem, e: React.MouseEvent) => {
    createParticleBurst(e.clientX, e.clientY);
    addScore(item.points + combo * 5);
    playSuccess();
    setCombo((prev) => prev + 1);

    const messageData = messages[icons.findIndex((icon) => icon === item.icon)];
    addDiscovery(messageData);

    setTimeout(() => setCombo(0), 2000);

    if (Math.random() > 0.6) {
      const weathers: (keyof typeof weatherConfig)[] = ['sunny', 'cloudy', 'night', 'sunset', 'rain', 'snow'];
      setWeather(weathers[Math.floor(Math.random() * weathers.length)]);
    }
  };

  const cycleWeather = () => {
    const weathers: (keyof typeof weatherConfig)[] = ['sunny', 'cloudy', 'night', 'sunset', 'rain', 'snow'];
    const currentIndex = weathers.indexOf(weather);
    setWeather(weathers[(currentIndex + 1) % weathers.length]);
  };

  const handleSecretClick = () => {
    setSecretFound(true);
    addScore(100);
    playSuccess();
    addDiscovery({ message: '🎁 SECRET FOUND! +100 points', type: 'rare' });
    setTimeout(() => setSecretFound(false), 3000);
  };

  const WeatherIcon = weatherConfig[weather].icon;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${weatherConfig[weather].gradient} transition-all duration-1000 relative overflow-hidden`}>
      <Navigation />

      {/* Weather particles */}
      {(weather === 'rain' || weather === 'snow') && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -50, x: `${Math.random() * 100}%` }}
              animate={{
                y: '110vh',
                x: weather === 'rain' ? `${Math.random() * 100 - 10}%` : `${Math.random() * 100}%`,
              }}
              transition={{
                duration: weather === 'rain' ? 1 : 3,
                delay: Math.random() * 2,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute text-2xl"
            >
              {weatherConfig[weather].particles}
            </motion.div>
          ))}
        </div>
      )}

      {/* Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ x: particle.x, y: particle.y, scale: 1, opacity: 1 }}
          animate={{
            x: particle.x + particle.vx * 50,
            y: particle.y + particle.vy * 50,
            scale: 0,
            opacity: 0,
          }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="fixed w-3 h-3 rounded-full pointer-events-none"
          style={{ backgroundColor: particle.color }}
        />
      ))}

      {/* Secret area */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        onClick={handleSecretClick}
        className="fixed bottom-1/3 right-1/4 w-24 h-24 rounded-full bg-white/5 hover:bg-white/20 transition-all cursor-pointer z-10 flex items-center justify-center group"
      >
        <Eye className="text-white/30 group-hover:text-white/80 transition-all" size={40} />
      </motion.div>

      {/* Secret found popup */}
      <AnimatePresence>
        {secretFound && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 180 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 p-12 rounded-3xl shadow-2xl text-center">
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Gift size={100} className="text-white mx-auto mb-4" />
              </motion.div>
              <h2 className="text-5xl font-bold text-white mb-2">SECRET!</h2>
              <p className="text-2xl text-white/90">+100 Points!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Draggable elements */}
      <div className="fixed inset-0 pt-24 w-full h-full pointer-events-none">
        {draggables.map((item) => (
          <motion.div
            key={item.id}
            drag
            dragMomentum={false}
            dragElastic={0.1}
            onDrag={(_e, info) => handleDrag(item.id, info.point.x, info.point.y)}
            onClick={(e) => handleClick(item, e as any)}
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
            className="absolute cursor-grab active:cursor-grabbing z-20 pointer-events-auto"
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <item.icon
                size={64}
                className={`${item.color} drop-shadow-2xl`}
                style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.8))' }}
              />
            </motion.div>

            {/* Glow */}
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full blur-2xl bg-white/30"
            />
          </motion.div>
        ))}
      </div>

      {/* Weather control */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed top-20 left-4 md:left-8 z-30"
      >
        <motion.button
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={cycleWeather}
          className="bg-white/20 backdrop-blur-2xl p-4 md:p-6 rounded-3xl hover:bg-white/30 transition-all shadow-2xl border border-white/20 group"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <WeatherIcon className="text-white group-hover:scale-110 transition-transform" size={32} />
          </motion.div>
        </motion.button>
        <div className="text-center mt-2 text-white font-bold text-xs md:text-sm bg-white/20 backdrop-blur px-3 md:px-4 py-2 rounded-full">
          {weather}
        </div>
      </motion.div>

      {/* Combo counter */}
      <AnimatePresence>
        {combo > 0 && (
          <motion.div
            initial={{ scale: 0, y: -50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -50 }}
            className="fixed top-20 right-4 md:right-8 z-30"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 md:px-8 py-3 md:py-4 rounded-2xl shadow-2xl">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-3xl md:text-4xl font-bold text-white text-center"
              >
                {combo}x
              </motion.div>
              <div className="text-white/80 text-xs md:text-sm text-center">COMBO!</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discoveries feed */}
      <div className="fixed top-20 right-4 md:right-8 max-w-xs md:max-w-sm space-y-2 z-20 pointer-events-none">
        <AnimatePresence>
          {discoveries.slice(0, 5).map((discovery) => (
            <motion.div
              key={discovery.id}
              initial={{ x: 400, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 400, opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className={`
                bg-gradient-to-r backdrop-blur-2xl p-3 md:p-4 rounded-xl md:rounded-2xl shadow-2xl border text-sm md:text-base
                ${discovery.type === 'rare' ? 'from-yellow-500/80 to-orange-500/80 border-yellow-400/50' : 
                  discovery.type === 'special' ? 'from-purple-500/80 to-pink-500/80 border-purple-400/50' :
                  discovery.type === 'success' ? 'from-green-500/80 to-emerald-500/80 border-green-400/50' :
                  'from-cyan-500/80 to-blue-500/80 border-cyan-400/50'}
              `}
            >
              <div className="flex items-center gap-2">
                {discovery.type === 'rare' && <Award className="text-white flex-shrink-0" size={20} />}
                {discovery.type === 'special' && <Star className="text-white flex-shrink-0" size={20} />}
                {discovery.type === 'success' && <Zap className="text-white flex-shrink-0" size={20} />}
                <p className="text-white font-bold flex-1">{discovery.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-30 w-full md:w-auto px-4"
      >
        <div className="bg-white/20 backdrop-blur-2xl px-4 md:px-8 py-4 md:py-5 rounded-2xl md:rounded-3xl border border-white/20 shadow-2xl">
          <p className="text-white text-center font-bold text-sm md:text-lg leading-relaxed">
            🎮 <span className="text-yellow-300">Drag</span> elements •{' '}
            <span className="text-pink-300">Click</span> for combos •{' '}
            <span className="text-cyan-300">Find</span> the secret 👁️
          </p>
        </div>
      </motion.div>
    </div>
  );
};