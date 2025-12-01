// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { GamesPage } from './pages/GamesPage';
import { LabPage } from './pages/LabPage';
import { EasterEgg } from './components/common/EasterEgg';
import AchievementsPanel from './components/common/AchievementsPanel';
import ModeToggle from './components/common/ModeToggle';
import HelperBubble from './components/common/HelperBubble';
import CustomizationPanel from './components/common/CustomizationPanel';
import useAppStore from '@/store/useAppStore';

const LoadingScreen: React.FC = () => (
  <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.3, 1],
        }}
        transition={{
          rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
          scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="mb-8"
      >
        <Sparkles size={100} className="text-cyan-400 mx-auto drop-shadow-2xl" style={{ filter: 'drop-shadow(0 0 20px #00d4ff)' }} />
      </motion.div>

      <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-400 to-blue-300 mb-6">
        Loading Wonderland...
      </h2>

      <div className="flex gap-3 justify-center">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -25, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
            className="w-4 h-4 rounded-full bg-cyan-400"
          />
        ))}
      </div>

      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-cyan-300/70 mt-8 text-xl"
      >
        Preparing your magical experience...
      </motion.p>
    </motion.div>
  </div>
);

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  // customization read from ApplyPrimaryColor component

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <LoadingScreen />
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && (
        <Router>
            <EasterEgg />
          <AchievementsPanel />
          <ModeToggle />
          <CustomizationPanel />
          <HelperBubble />
            {/* apply primary color as CSS variable */}
            <ApplyPrimaryColor />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/lab" element={<LabPage />} />
          </Routes>
        </Router>
      )}
    </>
  );
};

const ApplyPrimaryColor: React.FC = () => {
  const customization = useAppStore((s: any) => s.customization);
  useEffect(() => {
    try {
      document.documentElement.style.setProperty('--primary-color', customization.primaryColor || '#7c3aed');
    } catch (e) {
      // ignore
    }
  }, [customization.primaryColor]);
  return null;
};

export default App;