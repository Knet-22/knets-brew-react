export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          main: '#1C1C1C',
          deep: '#111111',
          surface: '#1E1E1E',
        },
        gold: {
          DEFAULT: '#A67C52',
          light: '#C49A6C',
          dark: '#7A5A38',
        },
        cream: '#F5E6C8',
        creamMuted: 'rgba(245, 230, 200, 0.55)',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'ui-serif', 'Georgia', 'serif'],
        sans: ['DM Sans', 'Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        soft: '0 18px 70px rgba(0, 0, 0, 0.25)',
        glow: '0 24px 120px rgba(166, 124, 82, 0.12)',
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at top left, rgba(166,124,82,0.16), transparent 42%), radial-gradient(circle at bottom right, rgba(196,154,108,0.12), transparent 36%)',
      },
    },
  },
  plugins: [],
}
