/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        calmLavender: '#E9E5F8',
        calmMint: '#D9F2E6',
        calmPeach: '#FFE8DF',
        calmSky: '#E5F1FC',
        calmSoftWhite: '#FCFCFE',
        calmPurpleDark: '#5E548E',
        calmGreenDark: '#2D6A4F',
        calmOrangeDark: '#BC6C25',
        calmBlueDark: '#3A6B88'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        urdu: ['Noto Nastaliq Urdu', 'system-ui', 'sans-serif'],
        arabic: ['Noto Sans Arabic', 'system-ui', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'system-ui', 'sans-serif'],
        persian: ['Vazirmatn', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
