import { useEffect, useState } from 'react';
import { leaderboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [board,   setBoard]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    leaderboardAPI.getLeaderboard().then(r => setBoard(r.data.leaderboard)).catch(() => setError('Failed to load')).finally(() => setLoading(false));
  }, []);

  const myRank = board.findIndex(p => p._id === user?._id) + 1;
  const rankStyle = r => r === 1 ? 'rank-gold' : r === 2 ? 'rank-silver' : r === 3 ? 'rank-bronze' : 'text-white/40';
  const rankBg   = r => r === 1 ? 'rgba(255,215,0,0.08)' : r === 2 ? 'rgba(192,200,224,0.05)' : r === 3 ? 'rgba(255,140,64,0.06)' : 'transparent';

  return (
    <div className="page pt-14 pb-20 sm:pb-8 px-4">
      <div className="max-w-lg mx-auto pt-6">

        {/* Header */}
        <div className="mb-6 animate-slide-up">
          <p className="label mb-2">GLOBAL RANKINGS</p>
          <h1 className="font-display text-5xl text-white" style={{ letterSpacing: '0.05em' }}>LEADERBOARD</h1>
        </div>

        {/* Your rank */}
        {myRank > 0 && (
          <div className="glass-deep rounded-2xl p-5 mb-4 flex items-center justify-between animate-slide-up"
            style={{ animationDelay: '0.05s', borderColor: 'rgba(16,255,176,0.15)', boxShadow: '0 0 30px rgba(16,255,176,0.05)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-display text-base"
                style={{ background: 'linear-gradient(135deg, #10ffb0, #0088ff)', color: '#07080f' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-ui font-bold text-white">{user?.name}</p>
                <p className="font-body text-xs" style={{ color: '#10ffb0' }}>Rank #{myRank}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-display text-3xl rank-gold">{user?.highScore?.toLocaleString()}</p>
              <p className="label">HIGH SCORE</p>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="glass rounded-3xl overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {/* Column headers */}
          <div className="grid grid-cols-[40px_1fr_80px_50px] gap-2 px-5 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            {['#', 'PLAYER', 'SCORE', 'GAMES'].map(h => (
              <div key={h} className="label text-right first:text-left">{h}</div>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><LoadingSpinner size="lg" color="muted" /></div>
          ) : error ? (
            <div className="text-center py-12 font-ui text-red-400 text-sm">{error}</div>
          ) : board.length === 0 ? (
            <div className="text-center py-14">
              <div className="text-5xl mb-3">🏆</div>
              <p className="font-ui text-white/30">No scores yet — be first!</p>
            </div>
          ) : board.map(p => {
            const isMe = p._id === user?._id;
            return (
              <div key={p._id}
                className="grid grid-cols-[40px_1fr_80px_50px] gap-2 items-center px-5 py-3.5 border-b last:border-0 transition-colors"
                style={{
                  borderColor: 'rgba(255,255,255,0.04)',
                  background: isMe ? 'rgba(16,255,176,0.05)' : rankBg(p.rank),
                  borderLeft: isMe ? '2px solid rgba(16,255,176,0.4)' : '2px solid transparent',
                }}>
                {/* Rank */}
                <div className={`font-display text-xl ${rankStyle(p.rank)}`}>
                  {p.rank <= 3 ? `0${p.rank}` : p.rank}
                </div>

                {/* Name */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center font-display text-xs shrink-0"
                    style={isMe
                      ? { background: 'linear-gradient(135deg,#10ffb0,#0088ff)', color: '#07080f' }
                      : { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-ui font-bold text-sm truncate"
                    style={{ color: isMe ? '#10ffb0' : 'rgba(255,255,255,0.8)' }}>
                    {p.name}
                    {isMe && <span className="font-normal text-white/30 ml-1">(you)</span>}
                  </span>
                </div>

                {/* Score */}
                <div className={`font-display text-xl text-right tabular-nums ${rankStyle(p.rank)}`}
                  style={{ color: isMe ? '#10ffb0' : undefined }}>
                  {p.highScore.toLocaleString()}
                </div>

                {/* Games */}
                <div className="font-ui text-xs text-white/25 text-right">{p.gamesPlayed}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
