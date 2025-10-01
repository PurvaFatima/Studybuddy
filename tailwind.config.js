// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        'cosmic-drift': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(50px, -30px) scale(1.1)' },
        },
        'cosmic-drift-reverse': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-60px, 40px) scale(0.9)' },
        },
        'cosmic-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-40px)' },
        },
      },
      animation: {
        'cosmic-drift': 'cosmic-drift 20s ease-in-out infinite',
        'cosmic-drift-reverse': 'cosmic-drift-reverse 25s ease-in-out infinite',
        'cosmic-float': 'cosmic-float 12s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
