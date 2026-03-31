import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function LoginPage() {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const onChange = e => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError(''); };

  const onSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('All fields required'); return; }
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      login(res.data.token, res.data.user);
      toast.success('Welcome back! 🎮');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-slide-up">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-grid grid-cols-2 gap-1.5 p-3 rounded-2xl mb-5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {[
              { bg: 'linear-gradient(135deg,#ff6b8a,#ff0044)', shadow: 'rgba(255,0,68,0.5)' },
              { bg: 'linear-gradient(135deg,#60d5ff,#0088ff)', shadow: 'rgba(0,136,255,0.5)' },
              { bg: 'linear-gradient(135deg,#80ffb0,#00cc55)', shadow: 'rgba(0,204,85,0.5)' },
              { bg: 'linear-gradient(135deg,#fff07a,#ffcc00)', shadow: 'rgba(255,204,0,0.5)' },
            ].map((s, i) => (
              <div key={i} className="w-7 h-7 rounded-lg"
                style={{ background: s.bg, boxShadow: `0 0 14px ${s.shadow}`, border: '1px solid rgba(255,255,255,0.2)' }} />
            ))}
          </div>
          <h1 className="font-display text-5xl text-white mb-1" style={{ letterSpacing: '0.1em' }}>SIMON</h1>
          <p className="font-body text-sm text-white/30 tracking-widest">MEMORY CHALLENGE</p>
        </div>

        <div className="glass-deep rounded-3xl p-7">
          <h2 className="font-display text-2xl text-white mb-6 text-center" style={{ letterSpacing: '0.08em' }}>SIGN IN</h2>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl font-ui text-sm font-semibold"
              style={{ background: 'rgba(255,0,68,0.1)', border: '1px solid rgba(255,0,68,0.25)', color: '#ff6b8a' }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div>
              <div className="label mb-2">Email</div>
              <input type="email" name="email" value={form.email} onChange={onChange}
                className="input" placeholder="you@example.com" autoComplete="email" autoFocus />
            </div>
            <div>
              <div className="label mb-2">Password</div>
              <input type="password" name="password" value={form.password} onChange={onChange}
                className="input" placeholder="••••••••" autoComplete="current-password" />
            </div>
            <button type="submit" disabled={loading}
              className="btn-neon-green w-full rounded-xl h-12 text-sm mt-2 flex items-center justify-center gap-2">
              {loading ? <LoadingSpinner size="sm" color="dark" /> : '▶ ENTER GAME'}
            </button>
          </form>
        </div>

        <p className="text-center font-body text-sm text-white/30 mt-5">
          No account?{' '}
          <Link to="/register" className="font-ui font-semibold text-gradient-cyan" style={{ WebkitTextFillColor: '' }}
            onMouseEnter={e => e.target.style.textDecoration = 'underline'}
            onMouseLeave={e => e.target.style.textDecoration = 'none'}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
