// src/pages/HomePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Compass, Gamepad2, Sparkles, Beaker, Zap, Star, Heart, Rocket, Crown } from 'lucide-react';
import { Navigation } from '../components/common/Navigation';
import { useAppStore } from '../store/useAppStore';
import { useMousePosition } from '../hooks/useMousePosition';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const mousePos = useMousePosition();
  const { addScore } = useAppStore();
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  const createRipple = (e: React.MouseEvent<HTMLDivElement>) => {
    const ripple = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
    };
    setRipples((prev) => [...prev, ripple]);
    addScore(1);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
    }, 1000);
  };

  const features = [
    {
      title: 'Explore Universe',
      description: 'Drag, interact, and discover hidden elements in a living world',
      icon: Compass,
      gradient: 'from-cyan-500 via-blue-500 to-blue-600',
      path: '/explore',
      emoji: '🌍',
    },
    {
      title: 'Epic Games',
      description: 'Challenge yourself with addictive mini-games and beat records',
      icon: Gamepad2,
      gradient: 'from-blue-500 via-purple-500 to-indigo-600',
      path: '/games',
      emoji: '🎮',
    },
    {
      title: 'Creative Lab',
      description: 'Experiment with particles, colors, and interactive art',
      icon: Beaker,
      gradient: 'from-cyan-500 via-teal-500 to-green-600',
      path: '/lab',
      emoji: '🧪',
    },
  ];

  const stats = [
    { icon: Zap, label: 'Interactive Elements', value: '100+', color: 'text-cyan-400' },
    { icon: Star, label: 'Hidden Secrets', value: '50+', color: 'text-blue-400' },
    { icon: Heart, label: 'User Favorites', value: '10K+', color: 'text-purple-400' },
    { icon: Rocket, label: 'Active Players', value: '25K+', color: 'text-indigo-400' },
  ];

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-y-auto overflow-x-hidden relative"
      onClick={createRipple}
    >
      <Navigation />

      {/* Animated background orbs - Modern cyan and blue */}
      <motion.div
        animate={{
          x: mousePos.x * 0.02,
          y: mousePos.y * 0.02,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        className="fixed top-0 left-0 w-[800px] h-[800px] bg-cyan-500/15 rounded-full blur-3xl"
        style={{ y: y1 }}
      />
      <motion.div
        animate={{
          x: -mousePos.x * 0.03,
          y: -mousePos.y * 0.03,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/15 rounded-full blur-3xl"
        style={{ y: y2 }}
      />

      {/* Ripples */}
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 4, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="fixed w-20 h-20 border-4 border-white/40 rounded-full pointer-events-none"
          style={{
            left: ripple.x - 40,
            top: ripple.y - 40,
          }}
        />
      ))}

      {/* Cursor trail */}
      <motion.div
        animate={{
          x: mousePos.x - 10,
          y: mousePos.y - 10,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        className="fixed w-5 h-5 bg-white/30 rounded-full blur-sm pointer-events-none z-50"
      />

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            {/* Floating crown */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="inline-block mb-8"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="absolute inset-0 bg-yellow-400/30 rounded-full blur-3xl"
                />
                <Crown size={100} className="text-yellow-300 drop-shadow-2xl relative z-10" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-7xl md:text-9xl font-black mb-6 leading-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-blue-200 drop-shadow-2xl">
                Welcome to
              </span>
              <br />
              <motion.span
                animate={{
                  backgroundPosition: ['0%', '100%', '0%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-400 to-blue-300 bg-[length:200%_auto]"
              >
                Wonderland
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-3xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-8 font-light"
            >
              A living, breathing{' '}
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                digital universe
              </span>{' '}
              where every click reveals magic, every interaction tells a story, and every moment is unforgettable.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl px-6 py-3 rounded-full border border-cyan-400/30"
              >
                <span className="text-white/80 font-medium">💡 Click anywhere for magic</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl px-6 py-3 rounded-full border border-cyan-400/30"
              >
                <span className="text-white/80 font-medium">🎨 Drag elements around</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl px-6 py-3 rounded-full border border-cyan-400/30"
              >
                <span className="text-white/80 font-medium">🎮 Beat your high scores</span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.05, y: -10 }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(feature.path);
                }}
                className="group relative overflow-hidden rounded-3xl p-8 cursor-pointer backdrop-blur-2xl bg-white/5 border border-white/10 shadow-2xl hover:shadow-[0_0_80px_rgba(0,212,255,0.2)] transition-all duration-500"
              >
                {/* Gradient overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.2 }}
                  transition={{ duration: 0.3 }}
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient}`}
                />

                {/* Shine effect */}
                <motion.div
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-1/2"
                />

                {/* Content */}
                <div className="relative z-10">
                  <div className="mb-6 flex items-center gap-4">
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="group-hover:scale-110 transition-transform"
                    >
                      <feature.icon size={64} className="text-white drop-shadow-2xl" />
                    </motion.div>
                    <span className="text-5xl">{feature.emoji}</span>
                  </div>

                  <h3 className="text-3xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/80 text-lg leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Arrow indicator */}
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 10 }}
                    className="mt-6 inline-flex items-center text-white font-bold"
                  >
                    Explore →
                  </motion.div>
                </div>

                {/* Glow effect */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.5, opacity: 0.2 }}
                  transition={{ duration: 0.5 }}
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} blur-3xl`}
                />
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-2xl rounded-3xl p-8 border border-cyan-400/20"
          >
            <h2 className="text-4xl font-bold text-white text-center mb-8">
              Join the Adventure 🚀
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.3 + index * 0.1, type: 'spring' }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center p-6 bg-white/5 rounded-2xl border border-white/10"
                >
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  >
                    <stat.icon size={48} className={`${stat.color} mx-auto mb-3`} />
                  </motion.div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/60 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-20 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                navigate('/explore');
              }}
              className="bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 text-white text-2xl font-bold px-12 py-6 rounded-2xl shadow-2xl hover:shadow-[0_0_50px_rgba(0,212,255,0.5)] transition-all"
            >
              <span className="flex items-center gap-3">
                Start Exploring
                <Sparkles size={28} />
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};