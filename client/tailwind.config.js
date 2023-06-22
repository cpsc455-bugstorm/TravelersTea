/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  safelist: [
    { pattern: /from-(.*)-(400)\/70/ },
    { pattern: /to-(.*)-(500)\/70/ },
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const utilities = {
        '.mac-scrollbar::-webkit-scrollbar': {
          width: '12px',
          height: '12px',
        },
        '.mac-scrollbar::-webkit-scrollbar-thumb': {
          'border-radius': '6px',
          'background-color': 'rgba(65,73,89,0.8)',
        },
        '.mac-scrollbar::-webkit-scrollbar-track': {
          background: 'rgba(40,44,49,0.5)',
          position: 'absolute',
          'z-index': 10,
        },
      }

      addUtilities(utilities)
    },
  ],
}
