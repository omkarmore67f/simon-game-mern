import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const LINKS = [
  { to: '/dashboard', label: 'HOME' },
  { to: '/game',      label: 'PLAY' },
  { to: '/leaderboard', label: 'RANKS' },
];

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();

  if (!isAuthenticated) return null;

  const handleLogout = () => { logout(); toast.success('See you soon!'); navigate('/login'); };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(7,8,15,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <nav className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="grid grid-cols-2 gap-0.5 w-6 h-6">
              {[
                { bg: 'linear-gradient(135deg,#ff6b8a,#ff0044)', s: 'rgba(255,0,68,0.6)' },
                { bg: 'linear-gradient(135deg,#60d5ff,#0088ff)', s: 'rgba(0,136,255,0.6)' },
                { bg: 'linear-gradient(135deg,#80ffb0,#00cc55)', s: 'rgba(0,204,85,0.6)' },
                { bg: 'linear-gradient(135deg,#fff07a,#ffcc00)', s: 'rgba(255,204,0,0.6)' },
              ].map((c, i) => (
                <div key={i} className="rounded-[3px] transition-transform group-hover:scale-110"
                  style={{ background: c.bg, boxShadow: `0 0 6px ${c.s}` }} />
              ))}
            </div>
            <span className="font-display text-base text-white" style={{ letterSpacing: '0.15em' }}>SIMON</span>
          </Link>

          {/* Nav links */}
          <div className="hidden sm:flex items-center gap-1">
            {LINKS.map(({ to, label }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to}
                  className="px-4 py-2 rounded-xl font-ui font-semibold text-xs tracking-widest transition-all"
                  style={{
                    background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: active ? '#fff' : 'rgba(255,255,255,0.35)',
                    border: active ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
                    boxShadow: active ? '0 2px 10px rgba(0,0,0,0.3)' : 'none',
                  }}>
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.15)' }}>
              <span className="rank-gold text-sm">▲</span>
              <span className="font-ui font-bold text-sm rank-gold">{user?.highScore ?? 0}</span>
            </div>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-display text-sm text-black"
              style={{ background: 'linear-gradient(135deg,#10ffb0,#0088ff)' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <button onClick={handleLogout}
              className="font-ui text-xs tracking-widest text-white/25 hover:text-red-400 transition-colors">
              EXIT
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile bottom bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex h-16"
        style={{ background: 'rgba(7,8,15,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {LINKS.map(({ to, label }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-colors"
              style={{ color: active ? '#10ffb0' : 'rgba(255,255,255,0.25)' }}>
              <span className="font-ui text-[11px] font-bold tracking-widest">{label}</span>
              {active && <div className="w-6 h-0.5 rounded-full" style={{ background: '#10ffb0', boxShadow: '0 0 8px #10ffb0' }} />}
            </Link>
          );
        })}
      </div>
    </>
  );
}
