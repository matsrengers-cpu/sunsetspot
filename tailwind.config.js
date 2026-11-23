/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: { 950: '#0b0814', 900: '#120d1f', 800: '#1b142d', 700: '#271d3f', 600: '#372a57' },
        sun: { orange: '#ff8a3d', pink: '#ff4f8b', purple: '#8b5cf6', gold: '#ffc857' },
      },
      backgroundImage: {
        'sun-gradient': 'linear-gradient(135deg, #ffc857 0%, #ff8a3d 30%, #ff4f8b 65%, #8b5cf6 100%)',
        'dawn-gradient': 'linear-gradient(135deg, #8b5cf6 0%, #ff4f8b 45%, #ffc857 100%)',
      },
      fontFamily: { sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'] },
    },
  },
  plugins: [],
}
