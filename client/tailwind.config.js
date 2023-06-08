/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  safelist: [
    { pattern: /from-(.*)-(400)\/70/ },
    { pattern: /to-(.*)-(500)\/70/ },
  ],
  theme: {
    extend: {
      backgroundColor: {
        'slate-light': '#7a8c99',
        'slate-dark': '#2e3d49',
      },
      backgroundImage: {
        'gradient-slate': 'linear-gradient(to right, #cdd5e0, #f2f5f9)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const utilities = {
        '.mac-scrollbar::-webkit-scrollbar': {
          width: '4px',
          height: '12px',
        },
        '.mac-scrollbar::-webkit-scrollbar-thumb': {
          'border-radius': '6px',
          'background-color': 'rgba(51,65,85,0.5)',
        },
        '.mac-scrollbar::-webkit-scrollbar-track': {
          background: 'rgba(51,65,85,0.1)',
          position: 'absolute',
          'z-index': 10,
        },
      }

      addUtilities(utilities)
    },
  ],
}
