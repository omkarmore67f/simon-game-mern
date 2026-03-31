import { useMemo } from 'react';

// Static color configs per button identity
const COLOR_STYLES = {
  red: {
    base: 'linear-gradient(145deg, #3d0015 0%, #1a000a 100%)',
    glow: 'rgba(255,0,68,0.25)',
    border: 'rgba(255,0,68,0.3)',
    activeClass: 'simon-red-active',
    lit: '#ff0044',
    shimmer: 'rgba(255,100,130,0.15)',
  },
  blue: {
    base: 'linear-gradient(145deg, #001a3d 0%, #000d1a 100%)',
    glow: 'rgba(0,136,255,0.25)',
    border: 'rgba(0,136,255,0.3)',
    activeClass: 'simon-blue-active',
    lit: '#0088ff',
    shimmer: 'rgba(100,200,255,0.15)',
  },
  green: {
    base: 'linear-gradient(145deg, #003320 0%, #001a10 100%)',
    glow: 'rgba(0,204,85,0.25)',
    border: 'rgba(0,204,85,0.3)',
    activeClass: 'simon-green-active',
    lit: '#00cc55',
    shimmer: 'rgba(100,255,180,0.15)',
  },
  yellow: {
    base: 'linear-gradient(145deg, #332800 0%, #1a1400 100%)',
    glow: 'rgba(255,204,0,0.25)',
    border: 'rgba(255,204,0,0.3)',
    activeClass: 'simon-yellow-active',
    lit: '#ffcc00',
    shimmer: 'rgba(255,240,100,0.15)',
  },
};

// Corner rounding: top-left, top-right, bottom-left, bottom-right
// (position in grid, not color — so always fixed per quadrant)
const CORNER_CLASSES = [
  'rounded-tl-[44%]',
  'rounded-tr-[44%]',
  'rounded-bl-[44%]',
  'rounded-br-[44%]',
];

export default function SimonBoard({
  activeColor,
  onColorPress,
  disabled,
  buttonOrder,   // shuffled array like ['green','red','yellow','blue']
  ghostMode,     // dim everything during sequence
  isShowing,
}) {
  return (
    <div className="relative select-none" style={{ width: 'min(85vw, 380px)', height: 'min(85vw, 380px)' }}>

      {/* Ambient glow behind the whole board */}
      <div className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          boxShadow: activeColor
            ? `0 0 100px ${COLOR_STYLES[activeColor].glow.replace('0.25','0.6')}, 0 0 200px ${COLOR_STYLES[activeColor].glow}`
            : '0 0 60px rgba(99,102,241,0.08)',
          transition: 'box-shadow 0.15s ease',
        }}
      />

      {/* 4 buttons in 2×2 grid */}
      <div className="grid grid-cols-2 gap-3 w-full h-full">
        {buttonOrder.map((color, quadrantIdx) => {
          const style   = COLOR_STYLES[color];
          const isActive = activeColor === color;
          const corner   = CORNER_CLASSES[quadrantIdx];

          return (
            <button
              key={`${color}-${quadrantIdx}`}
              aria-label={color}
              disabled={disabled}
              onClick={() => onColorPress(color)}
              className={`
                simon-btn-base
                ${corner}
                ${isActive ? style.activeClass : ''}
                ${ghostMode && !isActive ? 'ghost-mode' : ''}
                relative overflow-hidden
                focus:outline-none
                border-2
                cursor-pointer disabled:cursor-default
              `}
              style={{
                background: isActive ? undefined : style.base,
                borderColor: style.border,
                boxShadow: isActive ? undefined :
                  `0 0 25px ${style.glow}, inset 0 1px 0 ${style.shimmer}, 0 8px 20px rgba(0,0,0,0.5)`,
                transition: isActive ? 'all 0.04s ease-in' : 'all 0.2s ease-out',
              }}
            >
              {/* Top highlight stripe — gives 3D plastic look */}
              {!isActive && (
                <>
                  <div className="absolute top-0 left-0 right-0 h-1/3 pointer-events-none"
                    style={{
                      background: `linear-gradient(180deg, ${style.shimmer} 0%, transparent 100%)`,
                    }}
                  />
                  {/* Small lit LED dot in corner */}
                  <div className="absolute w-3 h-3 rounded-full"
                    style={{
                      background: style.lit,
                      boxShadow: `0 0 8px ${style.lit}, 0 0 16px ${style.lit}66`,
                      opacity: 0.7,
                      top: quadrantIdx < 2 ? '12px' : undefined,
                      bottom: quadrantIdx >= 2 ? '12px' : undefined,
                      left: quadrantIdx % 2 === 0 ? '12px' : undefined,
                      right: quadrantIdx % 2 === 1 ? '12px' : undefined,
                    }}
                  />
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Center hub — 3D raised disc */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div style={{
          width: '78px', height: '78px',
          borderRadius: '50%',
          background: 'linear-gradient(145deg, #1a1d35 0%, #07080f 100%)',
          border: '3px solid rgba(255,255,255,0.08)',
          boxShadow:
            '0 0 0 1px rgba(0,0,0,0.8), 0 6px 20px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -2px 4px rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(145deg, #0e1020, #07080f)',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)',
          }} />
        </div>
      </div>
    </div>
  );
}
