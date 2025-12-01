// src/pages/GamesPage.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Brain, Trophy, RotateCcw, ArrowLeft, Gamepad2, Crown, Zap as ZapIcon, Grid3x3, Palette } from 'lucide-react';
import { Navigation } from '../components/common/Navigation';
import { useSound } from '../hooks/useSound';

type GameType = 'click-speed' | 'memory' | 'reaction' | 'puzzle' | 'color-match' | null;

export const GamesPage: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [highScores, setHighScores] = useState<Record<string, number>>({});
  const { playSuccess, playError, playClick, playTone } = useSound();

  useEffect(() => {
    const stored = localStorage.getItem('game-highscores');
    if (stored) setHighScores(JSON.parse(stored));
  }, []);

  const saveHighScore = (game: string, score: number) => {
    const newScores = { ...highScores, [game]: Math.max(highScores[game] || 0, score) };
    setHighScores(newScores);
    localStorage.setItem('game-highscores', JSON.stringify(newScores));
  };

  const ClickSpeedGame = () => {
    const [clicks, setClicks] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [isActive, setIsActive] = useState(false);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
      if (isActive && timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else if (timeLeft === 0 && isActive) {
        setIsActive(false);
        setShowResult(true);
        saveHighScore('click-speed', clicks);
        if (clicks > (highScores['click-speed'] || 0)) playSuccess();
      }
    }, [isActive, timeLeft]);

    const startGame = () => {
      setClicks(0);
      setTimeLeft(10);
      setIsActive(true);
      setShowResult(false);
    };

    const handleClick = () => {
      if (!isActive) return;
      setClicks(clicks + 1);
      playClick();
    };

    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-2xl rounded-3xl p-12 shadow-2xl border border-yellow-500/30">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="inline-block mb-4">
            <Zap size={80} className="text-yellow-400 drop-shadow-2xl" />
          </motion.div>
          <h2 className="text-5xl font-bold text-white mb-4">Click Speed Test</h2>

          <AnimatePresence mode="wait">
            {!isActive && !showResult && (
              <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {(highScores['click-speed'] || 0) > 0 && (
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-3 mb-6">
                    <Trophy size={28} />
                    <span className="font-bold text-2xl">Best: {highScores['click-speed']}</span>
                  </div>
                )}
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startGame} className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-8 rounded-3xl font-bold text-3xl shadow-2xl">
                  START GAME
                </motion.button>
              </motion.div>
            )}

            {isActive && (
              <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                  <div className="text-9xl font-black text-white mb-2">{timeLeft}</div>
                  <div className="text-3xl text-white/70">seconds</div>
                </motion.div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleClick} className="w-full h-80 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white rounded-3xl font-bold text-5xl shadow-2xl relative overflow-hidden">
                  <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 0.3 }} key={clicks}>
                    <div>CLICK!</div>
                    <div className="text-9xl mt-6">{clicks}</div>
                  </motion.div>
                  <motion.div animate={{ scale: [0, 2], opacity: [0.5, 0] }} transition={{ duration: 0.6 }} key={`ripple-${clicks}`} className="absolute inset-0 bg-white rounded-3xl" />
                </motion.button>
              </motion.div>
            )}

            {showResult && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5, repeat: 3 }}>
                  {clicks > (highScores['click-speed'] || 0) ? <Crown size={120} className="text-yellow-400 mx-auto mb-6" /> : <Zap size={120} className="text-purple-400 mx-auto mb-6" />}
                </motion.div>
                <div className="text-8xl font-black text-white mb-4">{clicks}</div>
                <div className="text-3xl text-white/80 mb-6">clicks!</div>
                {clicks > (highScores['click-speed'] || 0) && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-3xl font-bold text-yellow-400 mb-6">
                    🎉 NEW RECORD! 🎉
                  </motion.div>
                )}
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startGame} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-6 rounded-3xl font-bold text-2xl flex items-center justify-center gap-3">
                  <RotateCcw size={28} />
                  Play Again
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  const MemoryGame = () => {
    const [sequence, setSequence] = useState<string[]>([]);
    const [userSeq, setUserSeq] = useState<string[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [level, setLevel] = useState(1);
    const [activeColor, setActiveColor] = useState<string | null>(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const colorClasses: Record<string, string> = { red: 'bg-red-500', blue: 'bg-blue-500', green: 'bg-green-500', yellow: 'bg-yellow-400', purple: 'bg-purple-500', orange: 'bg-orange-500' };

    const playSequence = async (seq: string[]) => {
      setIsPlaying(true);
      await new Promise((r) => setTimeout(r, 1000));
      for (const color of seq) {
        playTone([261.63, 293.66, 329.63, 349.23, 392.0, 440.0][colors.indexOf(color)], 0.3);
        setActiveColor(color);
        await new Promise((r) => setTimeout(r, 600));
        setActiveColor(null);
        await new Promise((r) => setTimeout(r, 200));
      }
      setIsPlaying(false);
    };

    const startGame = () => {
      const newSeq = [colors[Math.floor(Math.random() * colors.length)]];
      setSequence(newSeq);
      setUserSeq([]);
      setLevel(1);
      setGameStarted(true);
      setGameOver(false);
      playSequence(newSeq);
    };

    const handleColorClick = (color: string) => {
      if (isPlaying || gameOver) return;
      playTone([261.63, 293.66, 329.63, 349.23, 392.0, 440.0][colors.indexOf(color)], 0.3);
      setActiveColor(color);
      setTimeout(() => setActiveColor(null), 300);

      const newUserSeq = [...userSeq, color];
      setUserSeq(newUserSeq);

      if (newUserSeq[newUserSeq.length - 1] !== sequence[newUserSeq.length - 1]) {
        playError();
        setGameOver(true);
        saveHighScore('memory', level);
        return;
      }

      if (newUserSeq.length === sequence.length) {
        playSuccess();
        const newLevel = level + 1;
        setLevel(newLevel);
        const newSeq = [...sequence, colors[Math.floor(Math.random() * colors.length)]];
        setSequence(newSeq);
        setUserSeq([]);
        setTimeout(() => playSequence(newSeq), 1000);
      }
    };

    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-2xl rounded-3xl p-12 shadow-2xl border border-purple-500/30">
          <Brain size={80} className="text-purple-400 mb-4" />
          <h2 className="text-5xl font-bold text-white mb-4">Memory Master</h2>

          <AnimatePresence mode="wait">
            {!gameStarted && (
              <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {(highScores['memory'] || 0) > 0 && (
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-3 mb-6">
                    <Trophy size={28} />
                    <span className="font-bold text-2xl">Best: Level {highScores['memory']}</span>
                  </div>
                )}
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startGame} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8 rounded-3xl font-bold text-3xl">
                  START GAME
                </motion.button>
              </motion.div>
            )}

            {gameStarted && !gameOver && (
              <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="text-center mb-8">
                  <div className="text-6xl font-bold text-white mb-2">Level {level}</div>
                  <div className="text-2xl text-white/70">{isPlaying ? '👀 Watch!' : '🎮 Your turn!'}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {colors.map((color) => (
                    <motion.button key={color} whileHover={!isPlaying ? { scale: 1.05 } : {}} whileTap={!isPlaying ? { scale: 0.95 } : {}} onClick={() => handleColorClick(color)} disabled={isPlaying} className={`h-32 rounded-2xl ${colorClasses[color]} ${activeColor === color ? 'opacity-100 scale-105' : 'opacity-60'} transition-all shadow-2xl`} />
                  ))}
                </div>
              </motion.div>
            )}

            {gameOver && (
              <motion.div key="over" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                {level > (highScores['memory'] || 0) ? <Crown size={120} className="text-yellow-400 mx-auto mb-6" /> : <Brain size={120} className="text-purple-400 mx-auto mb-6" />}
                <div className="text-7xl font-bold text-white mb-4">Level {level}</div>
                {level > (highScores['memory'] || 0) && <div className="text-3xl font-bold text-yellow-400 mb-6">🎉 NEW RECORD! 🎉</div>}
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startGame} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-6 rounded-3xl font-bold text-2xl flex items-center justify-center gap-3">
                  <RotateCcw size={28} />
                  Try Again
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  const ReactionGame = () => {
    const [gameState, setGameState] = useState<'waiting' | 'ready' | 'go' | 'finished'>('waiting');
    const [reactionTime, setReactionTime] = useState(0);
    const [startTime, setStartTime] = useState(0);

    const startReactionTest = () => {
      setGameState('ready');
      setReactionTime(0);
      setTimeout(() => {
        setGameState('go');
        setStartTime(Date.now());
      }, Math.random() * 3000 + 1000);
    };

    const handleClick = () => {
      if (gameState === 'go') {
        const time = Date.now() - startTime;
        setReactionTime(time);
        setGameState('finished');
        saveHighScore('reaction', Math.round(1000 / (time + 1)));
        playSuccess();
      } else if (gameState === 'ready') {
        playError();
        setGameState('waiting');
      }
    };

    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-2xl rounded-3xl p-12 shadow-2xl border border-green-500/30">
          <ZapIcon size={80} className="text-green-400 mb-4" />
          <h2 className="text-5xl font-bold text-white mb-4">Reaction Time</h2>

          <AnimatePresence mode="wait">
            {gameState === 'waiting' && (
              <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {(highScores['reaction'] || 0) > 0 && (
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-3 mb-6">
                    <Trophy size={28} />
                    <span className="font-bold text-2xl">Best Score: {highScores['reaction']}</span>
                  </div>
                )}
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startReactionTest} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-8 rounded-3xl font-bold text-3xl">
                  START TEST
                </motion.button>
              </motion.div>
            )}

            {gameState === 'ready' && (
              <motion.div key="ready" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="text-9xl font-black text-white mb-6">
                  ⏱️
                </motion.div>
                <p className="text-3xl text-white/80 text-center mb-8">Wait for GREEN...</p>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleClick} className="w-full h-40 bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-3xl font-bold text-4xl shadow-2xl">
                  Click Now!
                </motion.button>
              </motion.div>
            )}

            {gameState === 'go' && (
              <motion.div key="go" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-9xl font-black text-green-400 mb-6">
                  GO!
                </motion.div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleClick} className="w-full h-40 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-3xl font-bold text-4xl shadow-2xl active:scale-95">
                  CLICK!
                </motion.button>
              </motion.div>
            )}

            {gameState === 'finished' && (
              <motion.div key="finished" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="text-7xl font-black text-white mb-4">{reactionTime}ms</div>
                <div className="text-3xl text-white/80 mb-6">
                  {reactionTime < 200 ? '⚡ Incredible!' : reactionTime < 300 ? '🔥 Great!' : reactionTime < 500 ? '👍 Good!' : '🐢 Keep practicing!'}
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startReactionTest} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-6 rounded-3xl font-bold text-2xl flex items-center justify-center gap-3">
                  <RotateCcw size={28} />
                  Try Again
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  const PuzzleGame = () => {
    const [numbers, setNumbers] = useState<number[]>([]);
    const [nextNumber, setNextNumber] = useState(1);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isActive, setIsActive] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
      const shuffled = Array.from({ length: 25 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
      setNumbers(shuffled);
    }, []);

    useEffect(() => {
      if (!isActive || timeLeft <= 0) return;
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }, [isActive, timeLeft]);

    useEffect(() => {
      if (timeLeft === 0 && isActive) {
        setIsActive(false);
        saveHighScore('puzzle', score);
        playSuccess();
      }
    }, [timeLeft, isActive]);

    const handleNumberClick = (num: number) => {
      if (!isActive) return;
      if (num === nextNumber) {
        setNextNumber(nextNumber + 1);
        setScore(score + 10);
        playSuccess();
      } else {
        playError();
      }
    };

    const startGame = () => {
      setNextNumber(1);
      setTimeLeft(60);
      setScore(0);
      setIsActive(true);
    };

    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-blue-500/30">
          <Grid3x3 size={80} className="text-blue-400 mb-4" />
          <h2 className="text-5xl font-bold text-white mb-4">Number Puzzle</h2>

          {!isActive ? (
            <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {score > 0 && (
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-3 mb-6">
                  <Trophy size={28} />
                  <span className="font-bold text-2xl">Last Score: {score}</span>
                </div>
              )}
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startGame} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-8 rounded-3xl font-bold text-3xl">
                START
              </motion.button>
            </motion.div>
          ) : (
            <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-6">
                <div className="text-4xl font-bold text-white">Score: {score}</div>
                <div className={`text-4xl font-bold ${timeLeft < 10 ? 'text-red-400' : 'text-cyan-300'}`}>{timeLeft}s</div>
              </div>
              <div className="grid grid-cols-5 gap-3 mb-6">
                {numbers.map((num) => (
                  <motion.button
                    key={num}
                    whileHover={num < nextNumber ? {} : { scale: 1.1 }}
                    whileTap={num < nextNumber ? {} : { scale: 0.9 }}
                    onClick={() => handleNumberClick(num)}
                    className={`h-16 rounded-xl font-bold text-2xl transition-all ${
                      num < nextNumber
                        ? 'bg-green-500 text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    disabled={num < nextNumber}
                  >
                    {num}
                  </motion.button>
                ))}
              </div>
              <p className="text-2xl text-white text-center">Tap {nextNumber} next!</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  const ColorMatchGame = () => {
    const [colors, setColors] = useState<string[]>([]);
    const [targetColor, setTargetColor] = useState('');
    const [gameActive, setGameActive] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const colorOptions = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-400', 'bg-purple-500', 'bg-pink-500'];
    const colorNames: Record<string, string> = {
      'bg-red-500': 'Red',
      'bg-blue-500': 'Blue',
      'bg-green-500': 'Green',
      'bg-yellow-400': 'Yellow',
      'bg-purple-500': 'Purple',
      'bg-pink-500': 'Pink',
    };

    useEffect(() => {
      if (!gameActive || timeLeft <= 0) return;
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }, [gameActive, timeLeft]);

    useEffect(() => {
      if (timeLeft === 0 && gameActive) {
        setGameActive(false);
        saveHighScore('color-match', score);
      }
    }, [timeLeft, gameActive]);

    const startGame = () => {
      const shuffled = colorOptions.sort(() => Math.random() - 0.5);
      setColors(shuffled);
      setTargetColor(shuffled[Math.floor(Math.random() * shuffled.length)]);
      setScore(0);
      setTimeLeft(30);
      setGameActive(true);
    };

    const handleColorClick = (color: string) => {
      if (!gameActive) return;
      if (color === targetColor) {
        setScore(score + 10);
        playSuccess();
        const shuffled = colorOptions.sort(() => Math.random() - 0.5);
        setColors(shuffled);
        setTargetColor(shuffled[Math.floor(Math.random() * shuffled.length)]);
      } else {
        playError();
      }
    };

    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-pink-500/30">
          <Palette size={80} className="text-pink-400 mb-4" />
          <h2 className="text-5xl font-bold text-white mb-4">Color Match</h2>

          {!gameActive ? (
            <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {score > 0 && (
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-3 mb-6">
                  <Trophy size={28} />
                  <span className="font-bold text-2xl">Last Score: {score}</span>
                </div>
              )}
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startGame} className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-8 rounded-3xl font-bold text-3xl">
                START GAME
              </motion.button>
            </motion.div>
          ) : (
            <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-8">
                <div className="text-4xl font-bold text-white">Score: {score}</div>
                <div className={`text-4xl font-bold ${timeLeft < 5 ? 'text-red-400 animate-pulse' : 'text-pink-300'}`}>{timeLeft}s</div>
              </div>
              <p className="text-2xl text-white text-center mb-8">Find the <span className="font-bold">{colorNames[targetColor]}</span> color!</p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {colors.map((color, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleColorClick(color)}
                    className={`h-32 rounded-2xl ${color} shadow-2xl transition-all`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  const games = [
    { id: 'click-speed', title: 'Click Speed', description: 'How fast can you click in 10 seconds?', icon: Zap, gradient: 'from-yellow-500 to-orange-500' },
    { id: 'memory', title: 'Memory Master', description: 'Remember and repeat the sequence', icon: Brain, gradient: 'from-purple-500 to-pink-500' },
    { id: 'reaction', title: 'Reaction Time', description: 'Click as soon as the box turns green', icon: ZapIcon, gradient: 'from-green-500 to-emerald-500' },
    { id: 'puzzle', title: 'Number Puzzle', description: 'Tap numbers in sequence from 1 to 25', icon: Grid3x3, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'color-match', title: 'Color Match', description: 'Match the color blocks before time runs out', icon: Palette, gradient: 'from-pink-500 to-rose-500' },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden">
      <Navigation />

      <div className="w-full pt-32 px-4 sm:px-6 lg:px-8 pb-12">
        {!activeGame ? (
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12 sm:mb-16">
              <motion.div animate={{ rotate: [0, 10, -10, 0], y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Gamepad2 size={80} className="text-white mx-auto mb-4 sm:mb-6 w-16 h-16 sm:w-24 sm:h-24" />
              </motion.div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-3 sm:mb-4">🎮 Game Arcade</h1>
              <p className="text-lg sm:text-2xl lg:text-3xl text-white/80">Challenge yourself and break records!</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {games.map((game, i) => (
                <motion.div 
                  key={game.id} 
                  initial={{ opacity: 0, scale: 0.8, y: 50 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                  transition={{ delay: i * 0.1 }} 
                  whileHover={{ scale: 1.05, y: -10 }} 
                  onClick={() => setActiveGame(game.id as GameType)} 
                  className={`bg-gradient-to-br ${game.gradient} rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 cursor-pointer shadow-2xl relative overflow-hidden min-h-[300px] flex flex-col justify-between`}
                >
                  <motion.div animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                    <game.icon size={64} className="text-white mb-4 sm:mb-6 w-12 h-12 sm:w-16 sm:h-16" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3">{game.title}</h3>
                    <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-4 sm:mb-6">{game.description}</p>
                    {(highScores[game.id] || 0) > 0 && (
                      <div className="bg-white/20 backdrop-blur px-3 sm:px-4 py-2 rounded-full text-white font-bold inline-flex items-center gap-2 text-xs sm:text-sm">
                        <Trophy size={16} />
                        Best: {highScores[game.id]}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <motion.button 
              initial={{ x: -100, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              whileHover={{ scale: 1.05 }} 
              onClick={() => setActiveGame(null)} 
              className="mb-6 sm:mb-8 bg-white/20 backdrop-blur-2xl px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-white font-bold flex items-center gap-3 hover:bg-white/30 transition-all text-sm sm:text-base"
            >
              <ArrowLeft size={20} className="sm:size-6" />
              Back to Games
            </motion.button>

            <div className="overflow-x-hidden">
              {activeGame === 'click-speed' && <ClickSpeedGame />}
              {activeGame === 'memory' && <MemoryGame />}
              {activeGame === 'reaction' && <ReactionGame />}
              {activeGame === 'puzzle' && <PuzzleGame />}
              {activeGame === 'color-match' && <ColorMatchGame />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};