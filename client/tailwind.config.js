/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  safelist: [
    { pattern: /from-(.*)-(400)\/(70)/ },
    { pattern: /border-(.*)-(500)/ },
    { pattern: /to-(.*)-(500)\/70/ },
    { pattern: /to-(.*)-(400)\/(.*)/ },
    {
      pattern: /to-(.*)-(950)\/(80)/,
      variants: ['hover'],
    },
    { pattern: /bg-(.*)-(400)/ },
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
          'background-color': 'rgba(57,64,80)',
        },
        '.mac-scrollbar::-webkit-scrollbar-track': {
          background: 'rgba(27,33,46)',
          position: 'absolute',
          'z-index': 10,
        },
        '.city-skyline': {
          background:
            "url('https://static.vecteezy.com/system/resources/previews/008/045/334/original/silhouette-of-the-city-city-skyline-silhouette-modern-cityscape-for-t-shirt-abstract-city-landscape-illustration-free-vector.jpg')",
          backgroundSize: 'cover',
          'z-index': 0,
          backgroundBlendMode: 'difference',
          backgroundColor: '#210a07',
        },
      }

      addUtilities(utilities)
    },
  ],
}
