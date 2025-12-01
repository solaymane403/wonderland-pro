import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Cloud, Moon, CloudRain, Snowflake } from 'lucide-react';

interface WeatherSystemProps {
  weather: string;
  onWeatherChange: (weather: string) => void;
}

const weatherConfig: Record<string, any> = {
  sunny: { icon: Sun, particles: '☀️' },
  cloudy: { icon: Cloud, particles: '☁️' },
  night: { icon: Moon, particles: '⭐' },
  sunset: { icon: Sun, particles: '🌅' },
  rain: { icon: CloudRain, particles: '💧' },
  snow: { icon: Snowflake, particles: '❄️' },
};

export const WeatherSystem: React.FC<WeatherSystemProps> = ({ weather, onWeatherChange }) => {
  const WeatherIcon = weatherConfig[weather]?.icon || Sun;

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed top-24 left-8 z-30"
    >
      <motion.button
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onWeatherChange(weather)}
        className="bg-white/20 backdrop-blur-2xl p-6 rounded-3xl hover:bg-white/30 transition-all shadow-2xl border border-white/20 group"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <WeatherIcon className="text-white group-hover:scale-110 transition-transform" size={40} />
        </motion.div>
      </motion.button>
      <div className="text-center mt-3 text-white font-bold text-sm bg-white/20 backdrop-blur px-4 py-2 rounded-full">
        {weather}
      </div>
    </motion.div>
  );
};
