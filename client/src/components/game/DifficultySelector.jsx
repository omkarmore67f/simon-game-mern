const DIFFS = [
  {
    id: 'easy',
    label: 'EASY',
    sub: '500ms · ×1 pts',
    grad: 'linear-gradient(135deg, #10ffb0, #00cc55)',
    glow: 'rgba(16,255,176,0.4)',
    shadow: '0 0 20px rgba(16,255,176,0.3), 0 4px 0 rgba(0,140,60,0.8)',
  },
  {
    id: 'medium',
    label: 'MEDIUM',
    sub: '320ms · ×2 pts',
    grad: 'linear-gradient(135deg, #60d5ff, #0088ff)',
    glow: 'rgba(0,136,255,0.4)',
    shadow: '0 0 20px rgba(0,136,255,0.3), 0 4px 0 rgba(0,80,180,0.8)',
  },
  {
    id: 'hard',
    label: 'HARD',
    sub: '180ms · ×4 pts',
    grad: 'linear-gradient(135deg, #ff6b8a, #ff0044)',
    glow: 'rgba(255,0,68,0.4)',
    shadow: '0 0 20px rgba(255,0,68,0.3), 0 4px 0 rgba(160,0,30,0.8)',
  },
  {
    id: 'insane',
    label: '💀 INSANE',
    sub: '90ms · ×8 pts',
    grad: 'linear-gradient(135deg, #e879f9, #7c3aed)',
    glow: 'rgba(168,85,247,0.5)',
    shadow: '0 0 25px rgba(168,85,247,0.4), 0 4px 0 rgba(80,0,180,0.8)',
  },
];

export default function DifficultySelector({ selected, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 w-full sm:grid-cols-4">
      {DIFFS.map(({ id, label, sub, grad, glow, shadow }) => {
        const active = selected === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className="relative flex flex-col items-center gap-1.5 py-4 px-2 rounded-2xl font-ui font-bold text-sm transition-all duration-200 active:scale-95 focus:outline-none"
            style={{
              background: active ? grad : 'rgba(255,255,255,0.05)',
              color: active ? '#fff' : 'rgba(255,255,255,0.4)',
              border: active ? '2px solid rgba(255,255,255,0.3)' : '2px solid rgba(255,255,255,0.08)',
              boxShadow: active ? shadow : 'none',
              transform: active ? 'translateY(-2px)' : 'none',
              textShadow: active ? '0 1px 3px rgba(0,0,0,0.5)' : 'none',
            }}
          >
            {/* Active glow ring */}
            {active && (
              <div className="absolute inset-0 rounded-2xl pointer-events-none animate-pulse"
                style={{ boxShadow: `0 0 0 3px ${glow}`, borderRadius: 'inherit' }} />
            )}
            <span className="text-base">{label}</span>
            <span className="font-body text-xs opacity-80">{sub}</span>
          </button>
        );
      })}
    </div>
  );
}
