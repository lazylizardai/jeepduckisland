import { useCallback, useRef } from "react";

type SoundType = "quack" | "hit" | "miss" | "levelUp" | "gameOver" | "combo";

const SOUND_FREQUENCIES: Record<SoundType, { freq: number; duration: number; type: OscillatorType }> = {
  quack: { freq: 440, duration: 0.15, type: "sawtooth" },
  hit: { freq: 660, duration: 0.1, type: "square" },
  miss: { freq: 200, duration: 0.2, type: "sawtooth" },
  levelUp: { freq: 880, duration: 0.3, type: "sine" },
  gameOver: { freq: 150, duration: 0.5, type: "sawtooth" },
  combo: { freq: 770, duration: 0.2, type: "triangle" },
};

export const useGameSounds = (enabled: boolean = true) => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback((soundType: SoundType) => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      const { freq, duration, type } = SOUND_FREQUENCIES[soundType];
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

      if (soundType === "levelUp") {
        oscillator.frequency.exponentialRampToValueAtTime(freq * 2, ctx.currentTime + duration);
      } else if (soundType === "gameOver") {
        oscillator.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + duration);
      }

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (error) {
      // Silently fail if audio is not available
    }
  }, [enabled, getAudioContext]);

  const playQuack = useCallback(() => playSound("quack"), [playSound]);
  const playHit = useCallback(() => playSound("hit"), [playSound]);
  const playMiss = useCallback(() => playSound("miss"), [playSound]);
  const playLevelUp = useCallback(() => playSound("levelUp"), [playSound]);
  const playGameOver = useCallback(() => playSound("gameOver"), [playSound]);
  const playCombo = useCallback(() => playSound("combo"), [playSound]);

  return { playQuack, playHit, playMiss, playLevelUp, playGameOver, playCombo, playSound };
};
