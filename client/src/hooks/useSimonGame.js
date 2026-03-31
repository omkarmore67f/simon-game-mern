import { useState, useCallback, useRef, useEffect } from 'react';

export const COLORS = ['red', 'blue', 'green', 'yellow'];

// ─── DIABOLICAL per-level config ──────────────────────────────────────────────
// Every level: faster flash, shorter pause, PLUS chaos mechanics kick in
// Level 1-3:   Normal — learn the ropes
// Level 4-6:   Buttons SHUFFLE positions each round
// Level 7-9:   Double-flash trap — same color flashes twice rapidly (easy to miscount)
// Level 10+:   GHOST MODE — buttons dim to 15% opacity during playback (barely visible)
// Level 15+:   SPEED DEMON — flash so short your brain can't register it

const DIFFICULTY_CONFIG = {
  easy: {
    flashDuration: 500, pauseBetween: 150, nextLevelDelay: 900,
    speedDecay: 0.93, diffMult: 1,
  },
  medium: {
    flashDuration: 320, pauseBetween: 90, nextLevelDelay: 650,
    speedDecay: 0.90, diffMult: 2,
  },
  hard: {
    flashDuration: 180, pauseBetween: 50, nextLevelDelay: 400,
    speedDecay: 0.86, diffMult: 4,
  },
  insane: {
    flashDuration: 90, pauseBetween: 20, nextLevelDelay: 250,
    speedDecay: 0.80, diffMult: 8,
  },
};

const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

const getLevelFlash = (base, decay, level) =>
  clamp(Math.round(base * Math.pow(decay, level - 1)), 55, base);
const getLevelPause = (base, decay, level) =>
  clamp(Math.round(base * Math.pow(decay, level - 1)), 15, base);

export const GAME_STATES = {
  IDLE: 'idle', SHOWING: 'showing', WAITING: 'waiting',
  GAME_OVER: 'game_over', LEVEL_UP: 'level_up',
};

// ─── Chaos mechanics per level ────────────────────────────────────────────────
export const getChaosFlags = (level) => ({
  shuffle:     level >= 4,   // buttons move positions each round
  doubleTrap:  level >= 7,   // 30% chance same color flashes twice
  ghostMode:   level >= 10,  // buttons dimmed during playback
  turbo:       level >= 15,  // no pause between flashes
  blindMode:   level >= 20,  // labels hidden, pure memory
});

// Fisher-Yates shuffle
const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ─── Web Audio ────────────────────────────────────────────────────────────────
const TONES = {
  red:    { freq: 261, type: 'sine' },
  blue:   { freq: 329, type: 'sine' },
  green:  { freq: 392, type: 'sine' },
  yellow: { freq: 523, type: 'sine' },
};

let _ctx = null;
const getCtx = () => {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
  return _ctx;
};

const playTone = (color, ms = 200) => {
  try {
    const ctx = getCtx();
    const { freq, type } = TONES[color];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = type; osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + ms / 1000);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + ms / 1000);
  } catch (_) {}
};

const playError = () => {
  try {
    const ctx = getCtx();
    [200, 160, 120, 80].forEach((freq, i) => {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sawtooth'; osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.07;
      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.start(t); osc.stop(t + 0.12);
    });
  } catch (_) {}
};

const playSuccess = () => {
  try {
    const ctx = getCtx();
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine'; osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.05;
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.start(t); osc.stop(t + 0.1);
    });
  } catch (_) {}
};

// ─── Main Hook ────────────────────────────────────────────────────────────────
export function useSimonGame() {
  const [gameState,    setGameState]    = useState(GAME_STATES.IDLE);
  const [sequence,     setSequence]     = useState([]);
  const [playerInput,  setPlayerInput]  = useState([]);
  const [activeColor,  setActiveColor]  = useState(null);
  const [score,        setScore]        = useState(0);
  const [level,        setLevel]        = useState(0);
  const [difficulty,   setDifficulty]   = useState('medium');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [finalScore,   setFinalScore]   = useState(0);
  const [streak,       setStreak]       = useState(0);
  // Shuffled button order — changes each round when shuffle mechanic is active
  const [buttonOrder,  setButtonOrder]  = useState(COLORS);
  const [chaosFlags,   setChaosFlags]   = useState({});

  const abortRef = useRef(false);
  const scoreRef = useRef(0);
  scoreRef.current = score;

  useEffect(() => () => { abortRef.current = true; }, []);

  const flashColor = useCallback((color, ms) =>
    new Promise(resolve => {
      setActiveColor(color);
      if (soundEnabled) playTone(color, ms);
      setTimeout(() => { setActiveColor(null); resolve(); }, ms);
    }), [soundEnabled]);

  const playSequence = useCallback(async (seq, diff, lvl) => {
    abortRef.current = false;
    const cfg   = DIFFICULTY_CONFIG[diff];
    const chaos = getChaosFlags(lvl);
    setChaosFlags(chaos);

    // Shuffle button positions for this round
    if (chaos.shuffle) setButtonOrder(shuffleArray(COLORS));
    else setButtonOrder(COLORS);

    setGameState(GAME_STATES.SHOWING);
    await new Promise(r => setTimeout(r, chaos.turbo ? 200 : 500));

    for (let i = 0; i < seq.length; i++) {
      if (abortRef.current) return;

      const flash = getLevelFlash(cfg.flashDuration, cfg.speedDecay, lvl);
      const pause = chaos.turbo ? 10 : getLevelPause(cfg.pauseBetween, cfg.speedDecay, lvl);

      // Double-trap: 25% chance this step flashes the color twice
      const doDouble = chaos.doubleTrap && Math.random() < 0.25;

      await flashColor(seq[i], flash);
      if (abortRef.current) return;

      if (doDouble) {
        await new Promise(r => setTimeout(r, 40));
        if (abortRef.current) return;
        await flashColor(seq[i], flash * 0.7);
        if (abortRef.current) return;
      }

      await new Promise(r => setTimeout(r, pause));
      if (abortRef.current) return;
    }

    setGameState(GAME_STATES.WAITING);
    setPlayerInput([]);
  }, [flashColor]);

  const startGame = useCallback((diff = difficulty) => {
    abortRef.current = true;
    setDifficulty(diff);
    setScore(0); setLevel(1); setStreak(0);
    setPlayerInput([]); setFinalScore(0);
    setButtonOrder(COLORS);
    const first = COLORS[Math.floor(Math.random() * 4)];
    const seq   = [first];
    setSequence(seq);
    setTimeout(() => playSequence(seq, diff, 1), 200);
  }, [difficulty, playSequence]);

  const handleColorPress = useCallback((color) => {
    if (gameState !== GAME_STATES.WAITING) return;

    if (soundEnabled) playTone(color, 180);
    setActiveColor(color);
    setTimeout(() => setActiveColor(null), 180);

    const newInput = [...playerInput, color];
    setPlayerInput(newInput);
    const idx = newInput.length - 1;

    if (color !== sequence[idx]) {
      if (soundEnabled) playError();
      setFinalScore(scoreRef.current);
      setStreak(0);
      setGameState(GAME_STATES.GAME_OVER);
      return;
    }

    if (newInput.length === sequence.length) {
      const cfg = DIFFICULTY_CONFIG[difficulty];
      const mult = cfg.diffMult;
      // Bonus for longer sequences, bonus for higher level
      const earned = Math.round(sequence.length * 15 * mult * (1 + level * 0.1));
      const newScore = scoreRef.current + earned;
      setScore(newScore);
      setStreak(s => s + 1);
      if (soundEnabled) playSuccess();
      setGameState(GAME_STATES.LEVEL_UP);

      const nextLevel = level + 1;
      setTimeout(() => {
        if (abortRef.current) return;
        const next = COLORS[Math.floor(Math.random() * 4)];
        const newSeq = [...sequence, next];
        setSequence(newSeq);
        setLevel(nextLevel);
        playSequence(newSeq, difficulty, nextLevel);
      }, cfg.nextLevelDelay);
    }
  }, [gameState, playerInput, sequence, difficulty, soundEnabled, level, playSequence]);

  return {
    gameState, GAME_STATES, sequence, playerInput, activeColor,
    score, level, difficulty, soundEnabled, finalScore, streak,
    buttonOrder, chaosFlags,
    startGame, handleColorPress, setSoundEnabled, setDifficulty,
  };
}
