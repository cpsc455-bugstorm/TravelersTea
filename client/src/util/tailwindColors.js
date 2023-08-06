/**
 * A list of -400 level tailwind colors.
 */
const tailwindColorsMap = {
  red: '#f87171',
  orange: '#fb923c',
  amber: '#fbbf24',
  lime: '#a3e635',
  green: '#34d399',
  emerald: '#10b981',
  teal: '#14b8a6',
  cyan: '#22d3ee',
  sky: '#60a5fa',
  blue: '#60a5fa',
  indigo: '#818cf8',
  violet: '#818cf8',
  purple: '#a855f7',
  fuchsia: '#e879f9',
  pink: '#f879a8',
  rose: '#fecdd3',
  gray: '#9ca3af',
}

export const tailwindColorNames = Object.keys(tailwindColorsMap)

/**
 * Given a color's number, return the color name
 * @param colorNumber
 * @return {string}
 */
export function getTailwindName(colorNumber) {
  return tailwindColorNames[colorNumber]
}

/**
 * Given a tailwind name, get the corresponding hex code.
 * @param colorNumber - a key from tailwindColors
 * @return {string} - a hex code
 */
export function getHexCode(colorNumber) {
  return tailwindColorsMap[getTailwindName(colorNumber)]
}

export function getBg400(colorNumber) {
  return `bg-${getTailwindName(colorNumber)}-400`
}
