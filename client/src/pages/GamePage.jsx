import { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimonGame, getChaosFlags } from '../hooks/useSimonGame';
import { useAuth } from '../context/AuthContext';
import { gameAPI } from '../services/api';
import SimonBoard from '../components/game/SimonBoard';
import GameStatus from '../components/game/GameStatus';
import DifficultySelector from '../components/game/DifficultySelector';
import GameOverModal from '../components/game/GameOverModal';

export default function GamePage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [shaking, setShaking] = useState(false);

  const {
    gameState, GAME_STATES, activeColor,
    score, level, difficulty, soundEnabled, finalScore, streak,
    buttonOrder, chaosFlags,
    startGame, handleColorPress, setSoundEnabled, setDifficulty,
  } = useSimonGame();

  const isIdle     = gameState === GAME_STATES.IDLE;
  const isGameOver = gameState === GAME_STATES.GAME_OVER;
  const isShowing  = gameState === GAME_STATES.SHOWING;
  const isLevelUp  = gameState === GAME_STATES.LEVEL_UP;
  const boardDisabled = isShowing || isIdle || isLevelUp;

  // Screen shake on game over
  useEffect(() => {
    if (isGameOver) { setShaking(true); setTimeout(() => setShaking(false), 600); }
  }, [isGameOver]);

  // Submit score
  useEffect(() => {
    if (!isGameOver || finalScore === 0) return;
    gameAPI.submitScore({ score: finalScore, level, difficulty })
      .then(r => {
        if (r.data.isNewHighScore) updateUser({ highScore: r.data.highScore });
        updateUser({ gamesPlayed: r.data.gamesPlayed });
      }).catch(() => {});
  }, [isGameOver]);

  const handleRestart = useCallback(() => startGame(difficulty), [startGame, difficulty]);

  // Ghost mode during showing if level >= 10
  const ghostMode = chaosFlags.ghostMode && isShowing;

  // Chaos notice for current level
  const nextChaos = !isIdle && level > 0 && getChaosFlags(level + 1);
  const upcomingChaos = nextChaos && !getChaosFlags(level).ghostMode && nextChaos.ghostMode
    ? '👻 GHOST MODE activates next level!'
    : nextChaos && !getChaosFlags(level).turbo && nextChaos.turbo
    ? '⚡ TURBO MODE activates next level!'
    : null;

  return (
    <div className={`page pt-14 pb-20 sm:pb-8 items-center justify-center ${shaking ? 'animate-shake' : ''}`}>

      {/* Dynamic background color bleed from active button */}
      <div className="fixed inset-0 pointer-events-none transition-all duration-300"
        style={{
          background: activeColor ? (
            activeColor === 'red'    ? 'radial-gradient(ellipse at center, rgba(255,0,68,0.07) 0%, transparent 70%)' :
            activeColor === 'blue'   ? 'radial-gradient(ellipse at center, rgba(0,136,255,0.07) 0%, transparent 70%)' :
            activeColor === 'green'  ? 'radial-gradient(ellipse at center, rgba(0,204,85,0.07) 0%, transparent 70%)' :
                                       'radial-gradient(ellipse at center, rgba(255,204,0,0.07) 0%, transparent 70%)'
          ) : 'none',
          zIndex: 0,
        }}
      />

      <div className="relative z-10 w-full max-w-sm mx-auto px-4 flex flex-col items-center gap-5">

        {/* Top controls */}
        <div className="w-full flex items-center justify-between animate-slide-up">
          <span className="font-display text-xs text-white/30 tracking-widest">SIMON 3D</span>
          <div className="flex gap-2">
            <button onClick={() => setSoundEnabled(s => !s)} className="btn-ghost-3d text-xs py-2 px-3">
              {soundEnabled ? '🔊' : '🔇'}
            </button>
            {!isIdle && !isGameOver && (
              <button onClick={handleRestart} className="btn-ghost-3d text-xs py-2 px-3">↺</button>
            )}
          </div>
        </div>

        {/* Status */}
        <GameStatus
          gameState={gameState} GAME_STATES={GAME_STATES}
          level={level} score={score} difficulty={isIdle ? null : difficulty} streak={streak}
        />

        {/* The board */}
        <div className={`transition-opacity duration-300 ${isGameOver ? 'opacity-25 pointer-events-none' : ''}`}>
          <SimonBoard
            activeColor={activeColor}
            onColorPress={handleColorPress}
            disabled={boardDisabled}
            buttonOrder={buttonOrder}
            ghostMode={ghostMode}
            isShowing={isShowing}
          />
        </div>

        {/* Warning if chaos is about to escalate */}
        {upcomingChaos && (
          <div className="font-ui text-xs font-bold px-4 py-2 rounded-full animate-fade-in"
            style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}>
            ⚠ {upcomingChaos}
          </div>
        )}

        {/* Shuffle notice */}
        {chaosFlags.shuffle && !isIdle && (
          <div className="font-ui text-xs font-bold px-4 py-2 rounded-full animate-fade-in"
            style={{ background: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.25)' }}>
            ⇄ Buttons shuffled this round!
          </div>
        )}

        {/* Idle start screen */}
        {isIdle && (
          <div className="w-full space-y-4 animate-slide-up">
            <DifficultySelector selected={difficulty} onChange={setDifficulty} />

            {/* Chaos preview */}
            <div className="glass rounded-2xl p-4">
              <div className="label mb-3 text-center">CHAOS UNLOCKS</div>
              <div className="grid grid-cols-2 gap-2 text-xs font-ui font-semibold">
                {[
                  { lvl: 4,  icon: '⇄', label: 'Shuffle positions', color: '#a78bfa' },
                  { lvl: 7,  icon: '2×', label: 'Double-flash trap', color: '#f59e0b' },
                  { lvl: 10, icon: '👻', label: 'Ghost mode',        color: '#ec4899' },
                  { lvl: 15, icon: '⚡', label: 'Turbo speed',       color: '#10ffb0' },
                ].map(({ lvl, icon, label, color }) => (
                  <div key={lvl} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ background: `${color}10`, border: `1px solid ${color}22` }}>
                    <span>{icon}</span>
                    <div>
                      <div style={{ color }} className="text-[10px] font-bold">LVL {lvl}+</div>
                      <div className="text-white/40 text-[10px]">{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => startGame(difficulty)}
              className="btn-neon-green w-full text-base py-4 rounded-2xl">
              ▶ START GAME
            </button>
          </div>
        )}

        {/* Progress dots */}
        {gameState === GAME_STATES.WAITING && level > 0 && (
          <div className="flex flex-wrap gap-1.5 justify-center max-w-xs animate-fade-in">
            {Array.from({ length: Math.min(level, 32) }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full"
                style={{ background: 'rgba(99,102,241,0.4)', boxShadow: '0 0 4px rgba(99,102,241,0.3)' }} />
            ))}
            {level > 32 && <span className="font-ui text-xs text-white/30">+{level - 32}</span>}
          </div>
        )}
      </div>

      {isGameOver && (
        <GameOverModal
          score={finalScore} level={level} difficulty={difficulty}
          highScore={user?.highScore ?? 0}
          isNewHighScore={finalScore > (user?.highScore ?? 0)}
          onRestart={handleRestart}
          onGoHome={() => navigate('/dashboard')}
        />
      )}
    </div>
  );
}
