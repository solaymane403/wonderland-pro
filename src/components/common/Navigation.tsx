// src/components/common/Navigation.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Gamepad2, Sparkles, Trophy, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const { score, highScore } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/explore', icon: Compass, label: 'Explore' },
    { path: '/games', icon: Gamepad2, label: 'Games' },
    { path: '/lab', icon: Sparkles, label: 'Lab' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 border-b border-cyan-500/20 shadow-2xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 group"
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/50"
                >
                  <Sparkles className="text-white" size={24} />
                </motion.div>
                <div className="hidden sm:block">
                  <span className="text-2xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-blue-400 transition-all">
                    Wonderland
                  </span>
                  <div className="text-xs text-cyan-300/60 font-medium tracking-wide">Pro Edition</div>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Nav Items */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        px-5 py-3 rounded-xl flex items-center gap-2 transition-all font-semibold relative overflow-hidden group
                        ${isActive
                          ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-100 border border-cyan-400/50 shadow-lg shadow-cyan-500/20'
                          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-transparent'
                        }
                      `}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      <item.icon size={20} className="relative z-10" />
                      <span className="relative z-10 text-sm">{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Score Display */}
            <div className="hidden md:flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl px-5 py-3 rounded-xl border border-cyan-400/30 shadow-lg shadow-cyan-500/10"
              >
                <div className="flex items-center gap-2 text-white">
                  <Sparkles size={18} className="text-cyan-300" />
                  <span className="font-bold text-lg">{score}</span>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-xl px-5 py-3 rounded-xl border border-amber-500/30 shadow-lg shadow-amber-500/10"
              >
                <div className="flex items-center gap-2 text-white">
                  <Trophy size={18} className="text-amber-300" />
                  <span className="font-bold text-lg">{highScore}</span>
                </div>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden bg-gradient-to-r from-cyan-500/30 to-blue-500/30 p-3 rounded-xl text-white border border-cyan-400/30 hover:border-cyan-400/60 transition-all"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-40 md:hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl"
          >
            <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="w-full"
                >
                  <Link
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl p-6 rounded-2xl flex items-center gap-4 border border-cyan-400/30 hover:border-cyan-400/60 transition-all"
                    >
                      <item.icon size={32} className="text-cyan-300" />
                      <span className="text-2xl font-bold text-white">{item.label}</span>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}

              <div className="flex gap-4 mt-8 w-full">
                <div className="flex-1 bg-cyan-500/20 backdrop-blur-xl p-4 rounded-2xl text-center border border-cyan-400/30">
                  <Sparkles className="text-cyan-300 mx-auto mb-2" size={24} />
                  <div className="text-2xl font-bold text-white">{score}</div>
                  <div className="text-xs text-cyan-300/60">Score</div>
                </div>
                <div className="flex-1 bg-amber-500/20 backdrop-blur-xl p-4 rounded-2xl text-center border border-amber-400/30">
                  <Trophy className="text-amber-300 mx-auto mb-2" size={24} />
                  <div className="text-2xl font-bold text-white">{highScore}</div>
                  <div className="text-xs text-amber-300/60">Best</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};