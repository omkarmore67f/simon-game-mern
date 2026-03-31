import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { gameAPI } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const DIFF_STYLE = {
  easy:   { label: 'Easy',       color: '#10ffb0', bg: 'rgba(16,255,176,0.1)'  },
  medium: { label: 'Medium',     color: '#60d5ff', bg: 'rgba(96,213,255,0.1)'  },
  hard:   { label: 'Hard',       color: '#ff6b8a', bg: 'rgba(255,107,138,0.1)' },
  insane: { label: '💀 Insane',  color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gameAPI.getHistory().then(r => setHistory(r.data.history.slice(0, 5))).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const avg = user?.gamesPlayed > 0 ? Math.round((user.totalScore || 0) / user.gamesPlayed) : 0;

  return (
    <div className="page pt-14 pb-20 sm:pb-8 px-4">
      <div className="max-w-lg mx-auto pt-6">

        {/* Hero greeting */}
        <div className="mb-6 animate-slide-up">
          <p className="label mb-2">WELCOME BACK</p>
          <h1 className="font-display text-5xl sm:text-6xl text-white" style={{ letterSpacing: '0.05em' }}>
            {(user?.name || 'PLAYER').split(' ')[0].toUpperCase()}
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          {[
            { label: 'HIGH SCORE', value: (user?.highScore ?? 0).toLocaleString(), grad: 'linear-gradient(135deg,#ffd700,#ff8c00)', glow: 'rgba(255,215,0,0.3)' },
            { label: 'GAMES',      value: user?.gamesPlayed ?? 0,                  grad: 'linear-gradient(135deg,#60d5ff,#a78bfa)', glow: 'rgba(96,213,255,0.2)' },
            { label: 'AVG SCORE',  value: avg.toLocaleString(),                    grad: 'linear-gradient(135deg,#10ffb0,#00cc55)', glow: 'rgba(16,255,176,0.2)' },
          ].map(({ label, value, grad, glow }) => (
            <div key={label} className="glass rounded-2xl p-4 text-center" style={{ boxShadow: `0 0 20px ${glow}, 0 8px 20px rgba(0,0,0,0.3)` }}>
              <div className="label mb-2">{label}</div>
              <div className="font-display text-2xl sm:text-3xl tabular-nums"
                style={{ background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Play CTA card */}
        <div className="glass-deep rounded-3xl p-6 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 animate-slide-up"
          style={{ animationDelay: '0.08s', borderColor: 'rgba(16,255,176,0.15)', boxShadow: '0 0 40px rgba(16,255,176,0.05), 0 16px 40px rgba(0,0,0,0.4)' }}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full animate-ping" style={{ background: '#10ffb0', boxShadow: '0 0 8px #10ffb0' }} />
              <span className="font-ui font-bold text-xs tracking-widest" style={{ color: '#10ffb0' }}>LIVE</span>
            </div>
            <h2 className="font-display text-3xl text-white mb-1" style={{ letterSpacing: '0.05em' }}>PLAY NOW</h2>
            <p className="font-body text-white/40">4 difficulty modes • chaos mechanics • live leaderboard</p>
          </div>
          <Link to="/game" className="btn-neon-green shrink-0 rounded-2xl text-sm px-7 py-4">
            START ▶
          </Link>
        </div>

        {/* History */}
        <div className="glass rounded-3xl overflow-hidden animate-slide-up" style={{ animationDelay: '0.12s' }}>
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <h3 className="font-display text-base text-white" style={{ letterSpacing: '0.08em' }}>RECENT GAMES</h3>
            <Link to="/leaderboard" className="font-ui font-semibold text-xs text-white/30 hover:text-white/70 transition-colors">
              LEADERBOARD →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-10"><LoadingSpinner color="muted" /></div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🎮</div>
              <p className="font-ui text-white/30 text-sm">No games yet — play your first!</p>
              <Link to="/game" className="font-ui font-bold text-sm mt-2 inline-block" style={{ color: '#10ffb0' }}>Play now →</Link>
            </div>
          ) : history.map((g, i) => {
            const ds = DIFF_STYLE[g.difficulty] || DIFF_STYLE.medium;
            return (
              <div key={i} className="flex items-center gap-4 px-6 py-3.5 border-b last:border-0 transition-colors hover:bg-white/3"
                style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                <span className="font-ui text-xs text-white/20 w-4">{i + 1}</span>
                <div className="w-1.5 h-9 rounded-full" style={{ background: ds.color, boxShadow: `0 0 8px ${ds.color}88` }} />
                <div className="flex-1">
                  <span className="font-ui font-bold text-sm" style={{ color: ds.color }}>{ds.label}</span>
                  <span className="font-body text-xs text-white/30 ml-2">· Lvl {g.level}</span>
                </div>
                <div className="font-display text-2xl text-white/80">{g.score.toLocaleString()}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
