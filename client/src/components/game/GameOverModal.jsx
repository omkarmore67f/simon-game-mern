import { useEffect } from 'react';

export default function GameOverModal({ score, level, difficulty, highScore, isNewHighScore, onRestart, onGoHome }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const diffLabel = { easy: 'Easy', medium: 'Medium', hard: 'Hard', insane: '💀 Insane' }[difficulty] || difficulty;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(7,8,15,0.85)', backdropFilter: 'blur(24px)' }}>

      {/* Red ambient */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,0,68,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      <div className="relative w-full max-w-sm animate-bounce-in">
        {/* Card */}
        <div className="glass-deep rounded-3xl overflow-hidden">

          {/* Red top bar */}
          <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #ff0044, #ff6b8a, #ff0044)' }} />

          <div className="p-7 text-center">
            {/* Skull icon */}
            <div className="text-6xl mb-3 animate-float">💀</div>
            <h2 className="font-display text-4xl mb-1"
              style={{ color: '#ff0044', textShadow: '0 0 30px rgba(255,0,68,0.6)' }}>
              GAME OVER
            </h2>
            <p className="font-body text-base text-white/40 mb-6">Better luck next time</p>

            {/* Stat grid */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { label: 'SCORE', value: score.toLocaleString(), color: '#fff' },
                { label: 'LEVEL', value: level, color: '#60d5ff' },
                { label: 'MODE',  value: diffLabel, color: '#a78bfa' },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-2xl py-3"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="label mb-1.5">{label}</div>
                  <div className="font-display text-xl" style={{ color }}>{value}</div>
                </div>
              ))}
            </div>

            {/* High score banner */}
            {isNewHighScore ? (
              <div className="mb-5 py-3 px-4 rounded-2xl"
                style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)' }}>
                <div className="font-display text-xl rank-gold">🏆 NEW HIGH SCORE!</div>
              </div>
            ) : (
              <div className="mb-5">
                <span className="label">BEST </span>
                <span className="font-ui font-bold text-white/50">{highScore.toLocaleString()}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button onClick={onGoHome}
                className="btn-ghost-3d flex-1 rounded-xl py-3">HOME</button>
              <button onClick={onRestart}
                className="flex-1 py-3 rounded-xl font-ui font-bold text-sm text-white transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #ff6b8a, #ff0044)',
                  boxShadow: '0 0 20px rgba(255,0,68,0.4), 0 4px 0 rgba(140,0,30,0.8)',
                }}>
                RETRY ▶
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
