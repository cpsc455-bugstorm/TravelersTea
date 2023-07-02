/** @type {import('tailwindcss').Config}
 * Credits for .dot-matrix, .paper-background, and .torn-paper to https://www.jhu.edu/
 * */
module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  safelist: [
    { pattern: /from-(.*)-(400)\/70/ },
    { pattern: /to-(.*)-(500)\/70/ },
    { pattern: /to-(.*)-(400)\/(.*)/ },
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
        '.dot-matrix': {
          background:
            "url('https://www.jhu.edu/assets/themes/machado/assets/images/dot-matrix_03-1b37f2ee63.png') repeat",
          bottom: 0,
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0,
          'z-index': 0,
        },
        '.paper-background': {
          background:
            "url('https://www.jhu.edu/assets/themes/machado/assets/images/textures/textured_paper_increased_contrast@2X-4d6c820937.jpg')",
          'background-color': '#dddbd9',
          'background-position': 'center',
          'background-repeat': 'repeat',
          'background-size': '320px 320px',
          display: 'block',
          height: '100%',
          left: 0,
          'mix-blend-mode': 'multiply',
          position: 'absolute',
          top: 0,
          width: '100%',
          'z-index': 0,
        },
        '.torn-paper': {
          background:
            "url('https://www.jhu.edu/assets/themes/shared/assets/images/textures/torn-paper-lap-3b32c1effb.png')",
          top: '-66px',
          'background-position': 'center',
          'background-repeat': 'no-repeat',
          display: 'block',
          left: 0,
          position: 'absolute',
          visibility: 'visible',
          width: '100%',
          'z-index': 5,
          'background-size': '100% 2rem',
          height: '100%',
        },
      }

      addUtilities(utilities)
    },
  ],
}
