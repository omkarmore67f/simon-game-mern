import { getChaosFlags } from '../../hooks/useSimonGame';

const STATE_INFO = {
  idle:      { label: 'READY',      color: 'rgba(255,255,255,0.4)', bg: 'rgba(255,255,255,0.06)' },
  showing:   { label: 'WATCH…',     color: '#60d5ff',               bg: 'rgba(0,136,255,0.12)'  },
  waiting:   { label: 'YOUR TURN',  color: '#10ffb0',               bg: 'rgba(16,255,176,0.12)' },
  level_up:  { label: '✓ CORRECT!', color: '#ffd700',               bg: 'rgba(255,215,0,0.12)'  },
  game_over: { label: 'GAME OVER',  color: '#ff0044',               bg: 'rgba(255,0,68,0.12)'   },
};

const CHAOS_BADGES = [
  { key: 'shuffle',    label: '⇄ SHUFFLE',   color: '#a78bfa', bg: 'rgba(167,139,250,0.15)' },
  { key: 'doubleTrap', label: '2× TRAP',     color: '#f59e0b', bg: 'rgba(245,158,11,0.15)'  },
  { key: 'ghostMode',  label: '👻 GHOST',    color: '#ec4899', bg: 'rgba(236,72,153,0.15)'  },
  { key: 'turbo',      label: '⚡ TURBO',    color: '#10ffb0', bg: 'rgba(16,255,176,0.15)'  },
  { key: 'blindMode',  label: '🙈 BLIND',    color: '#f87171', bg: 'rgba(248,113,113,0.15)' },
];

export default function GameStatus({ gameState, GAME_STATES, level, score, difficulty, streak }) {
  const info   = STATE_INFO[gameState] || STATE_INFO.idle;
  const chaos  = level > 0 ? getChaosFlags(level) : {};
  const active = CHAOS_BADGES.filter(b => chaos[b.key]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">

      {/* Score + Level row */}
      <div className="flex items-center gap-6">
        {[
          { label: 'SCORE', value: score.toLocaleString(), grad: 'linear-gradient(135deg,#fff,#c4b5fd)' },
          { label: 'LEVEL', value: level || '—',           grad: 'linear-gradient(135deg,#60d5ff,#a78bfa)' },
          ...(streak >= 3 ? [{ label: 'STREAK', value: `${streak}🔥`, grad: 'linear-gradient(135deg,#ffd700,#ff8c00)' }] : []),
        ].map(({ label, value, grad }, i, arr) => (
          <div key={label} className="flex items-center gap-6">
            <div className="text-center">
              <div className="label mb-1.5">{label}</div>
              <div className="font-display text-4xl tabular-nums"
                style={{ background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {value}
              </div>
            </div>
            {i < arr.length - 1 && (
              <div className="w-px h-10" style={{ background: 'rgba(255,255,255,0.08)' }} />
            )}
          </div>
        ))}
      </div>

      {/* State badge */}
      <div className="flex items-center gap-2.5 px-5 py-2 rounded-full font-ui font-bold text-sm"
        style={{ background: info.bg, color: info.color, border: `1px solid ${info.color}33` }}>
        <span className="w-2 h-2 rounded-full animate-ping"
          style={{ background: info.color, boxShadow: `0 0 6px ${info.color}` }} />
        {info.label}
      </div>

      {/* Chaos mechanic badges */}
      {active.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {active.map(({ key, label, color, bg }) => (
            <div key={key}
              className="font-ui text-xs font-bold px-3 py-1 rounded-full"
              style={{ color, background: bg, border: `1px solid ${color}44` }}>
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
