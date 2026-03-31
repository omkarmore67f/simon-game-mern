/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Orbitron"', 'sans-serif'],
        ui:      ['"Exo 2"', 'sans-serif'],
        body:    ['"Rajdhani"', 'sans-serif'],
      },
      colors: {
        base: '#07080f',
        surface: '#0e1020',
        card: '#131628',
      },
      animation: {
        'fade-in':    'fadeIn 0.35s ease both',
        'slide-up':   'slideUp 0.45s cubic-bezier(0.16,1,0.3,1) both',
        'scale-in':   'scaleIn 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'shake':      'shake 0.55s cubic-bezier(.36,.07,.19,.97)',
        'bounce-in':  'bounceIn 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'float':      'float 3s ease-in-out infinite',
        'spin-slow':  'spin 8s linear infinite',
        'pulse-ring': 'pulseRing 1.8s ease-out infinite',
        'glow-r':     'glowR 0.3s ease',
        'glow-b':     'glowB 0.3s ease',
        'glow-g':     'glowG 0.3s ease',
        'glow-y':     'glowY 0.3s ease',
      },
      keyframes: {
        fadeIn:   { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:  { from: { opacity: 0, transform: 'translateY(30px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn:  { from: { opacity: 0, transform: 'scale(0.85)' }, to: { opacity: 1, transform: 'scale(1)' } },
        bounceIn: { '0%': { opacity: 0, transform: 'scale(0.7)' }, '60%': { transform: 'scale(1.05)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        shake: {
          '0%,100%': { transform: 'translate(0,0) rotate(0)' },
          '10%': { transform: 'translate(-8px,-4px) rotate(-2deg)' },
          '20%': { transform: 'translate(8px,4px) rotate(2deg)' },
          '30%': { transform: 'translate(-8px,4px) rotate(0deg)' },
          '40%': { transform: 'translate(8px,-4px) rotate(2deg)' },
          '50%': { transform: 'translate(-5px,3px) rotate(-1deg)' },
          '60%': { transform: 'translate(5px,5px) rotate(0deg)' },
          '70%': { transform: 'translate(-5px,-3px) rotate(-1deg)' },
          '80%': { transform: 'translate(5px,-5px) rotate(1deg)' },
          '90%': { transform: 'translate(-2px,2px) rotate(0deg)' },
        },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        pulseRing: { '0%': { transform: 'scale(1)', opacity: 0.8 }, '100%': { transform: 'scale(2)', opacity: 0 } },
      },
    },
  },
  plugins: [],
};
