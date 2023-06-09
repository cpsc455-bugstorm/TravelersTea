const tailwindColorsMap = {
  'bg-red-400': '#f87171',
  'bg-orange-400': '#fb923c',
  'bg-amber-400': '#fbbf24',
  'bg-lime-400': '#a3e635',
  'bg-green-400': '#34d399',
  'bg-emerald-400': '#10b981',
  'bg-teal-400': '#14b8a6',
  'bg-cyan-400': '#22d3ee',
  'bg-sky-400': '#60a5fa',
  'bg-blue-400': '#60a5fa',
  'bg-indigo-400': '#818cf8',
  'bg-violet-400': '#818cf8',
  'bg-purple-400': '#a855f7',
  'bg-fuchsia-400': '#a855f7',
  'bg-pink-400': '#f879a8',
  'bg-rose-400': '#fecdd3',
  'bg-yellow-700': '#b45309',
  'bg-yellow-300': '#fcd34d',
  'bg-gray-400': '#9ca3af',
  'bg-black': '#000000',
  'bg-white': '#ffffff',
}

/**
 * Given a tailwind name, get the corresponding hex code.
 * @param tailwindName - a key from tailwindColorsMap
 * @return string - a hex code
 */
export function getHexCode(tailwindName) {
  return tailwindColorsMap[tailwindName]
}

export function getColorName(tailwindName) {
  return tailwindName.slice(3).slice(0, -4)
}
