/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
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
          background: 'transparent',
          position: 'absolute',
          'z-index': 10,
        },
      }

      addUtilities(utilities)
    },
  ],
}
