import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function RegisterPage() {
  const [form, setForm]     = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const onChange = e => { const { name, value } = e.target; setForm(p => ({ ...p, [name]: value })); if (errors[name]) setErrors(p => ({ ...p, [name]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.length < 2) e.name = 'Min 2 characters';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.password || form.password.length < 6) e.password = 'Min 6 characters';
    return e;
  };

  const onSubmit = async e => {
    e.preventDefault();
    const v = validate(); if (Object.keys(v).length) { setErrors(v); return; }
    setLoading(true);
    try {
      const res = await authAPI.register(form);
      login(res.data.token, res.data.user);
      toast.success(`Welcome, ${res.data.user.name}! 🎮`);
      navigate('/dashboard');
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Registration failed' });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-slide-up">
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
          <p className="font-body text-sm text-white/30 tracking-widest">CREATE ACCOUNT</p>
        </div>

        <div className="glass-deep rounded-3xl p-7">
          <h2 className="font-display text-2xl text-white mb-6 text-center" style={{ letterSpacing: '0.08em' }}>REGISTER</h2>

          {errors.general && (
            <div className="mb-4 px-4 py-3 rounded-xl font-ui text-sm font-semibold"
              style={{ background: 'rgba(255,0,68,0.1)', border: '1px solid rgba(255,0,68,0.25)', color: '#ff6b8a' }}>
              ⚠ {errors.general}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            {[
              { name: 'name',     type: 'text',     label: 'Name',     ph: 'Your name' },
              { name: 'email',    type: 'email',    label: 'Email',    ph: 'you@example.com' },
              { name: 'password', type: 'password', label: 'Password', ph: 'Min 6 characters' },
            ].map(({ name, type, label, ph }) => (
              <div key={name}>
                <div className="label mb-2">{label}</div>
                <input type={type} name={name} value={form[name]} onChange={onChange}
                  className="input" placeholder={ph} autoComplete={name}
                  style={errors[name] ? { borderColor: 'rgba(255,0,68,0.5)', boxShadow: '0 0 0 2px rgba(255,0,68,0.15)' } : {}} />
                {errors[name] && <p className="font-ui text-xs text-red-400 mt-1.5">⚠ {errors[name]}</p>}
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="btn-neon-green w-full rounded-xl h-12 text-sm mt-2 flex items-center justify-center gap-2">
              {loading ? <LoadingSpinner size="sm" color="dark" /> : '▶ JOIN NOW'}
            </button>
          </form>
        </div>

        <p className="text-center font-body text-sm text-white/30 mt-5">
          Have an account?{' '}
          <Link to="/login" className="font-ui font-semibold"
            style={{ color: '#60d5ff' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
