import { useCallback, useRef } from "react";

type SoundType = "quack" | "win" | "gameStart" | "cardFlip" | "match" | "tileMove";

const SOUND_CONFIGS: Record<SoundType, { frequency: number; duration: number; type: OscillatorType; pattern?: number[] }> = {
  quack: { frequency: 600, duration: 0.15, type: "sine", pattern: [1, 0.5] },
  win: { frequency: 523, duration: 0.8, type: "sine", pattern: [1, 1.25, 1.5, 2] },
  gameStart: { frequency: 440, duration: 0.6, type: "square", pattern: [1, 1.2, 1.5] },
  cardFlip: { frequency: 800, duration: 0.08, type: "triangle" },
  match: { frequency: 660, duration: 0.4, type: "sine", pattern: [1, 1.5] },
  tileMove: { frequency: 400, duration: 0.06, type: "square" },
};

export const useGameSounds = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef(true);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback((soundType: SoundType) => {
    if (!enabledRef.current) return;

    try {
      const ctx = getAudioContext();
      const config = SOUND_CONFIGS[soundType];
      const { pattern } = config;

      if (pattern) {
        pattern.forEach((multiplier, i) => {
          const oscillator = ctx.createOscillator();
          const gainNode = ctx.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);

          oscillator.type = config.type;
          oscillator.frequency.setValueAtTime(config.frequency * multiplier, ctx.currentTime + i * 0.1);

          gainNode.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.1);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + config.duration);

          oscillator.start(ctx.currentTime + i * 0.1);
          oscillator.stop(ctx.currentTime + i * 0.1 + config.duration);
        });
      } else {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = config.type;
        oscillator.frequency.setValueAtTime(config.frequency, ctx.currentTime);

        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.duration);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + config.duration);
      }
    } catch (e) {
      // Silently fail if audio context is not available
    }
  }, [getAudioContext]);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    enabledRef.current = enabled;
  }, []);

  return { playSound, setSoundEnabled };
};
