// src/hooks/useMousePosition.ts
import { useState, useEffect } from 'react';

export const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
};

// src/hooks/useSound.ts
import { useCallback, useRef } from 'react';

export const useSound = () => {
  const audioContext = useRef<AudioContext | null>(null);

  const initAudio = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  const playTone = useCallback((frequency: number, duration: number = 0.1) => {
    initAudio();
    if (!audioContext.current) return;

    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration);

    oscillator.start();
    oscillator.stop(audioContext.current.currentTime + duration);
  }, [initAudio]);

  const playSuccess = useCallback(() => {
    playTone(523.25, 0.1);
    setTimeout(() => playTone(659.25, 0.15), 100);
  }, [playTone]);

  const playError = useCallback(() => {
    playTone(220, 0.2);
  }, [playTone]);

  const playClick = useCallback(() => {
    playTone(440, 0.05);
  }, [playTone]);

  return { playSuccess, playError, playClick, playTone };
};
