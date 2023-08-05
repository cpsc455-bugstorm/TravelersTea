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

// Since we support both light mode and dark mode, need an easy way to
//   define text / bkg colours for both modes (e.g. bg-slate-900/40 becomes bg-slate-100/40)
// Note: shade is a number
export function getSlate(isLightMode, prefix, shade, opacity) {
  const shadeForMode = isLightMode ? 1000 - shade : shade
  const opacitySuffix = opacity ? `/${opacity}` : ''

  return `${prefix}-slate-${shadeForMode}${opacitySuffix}`
}

export function getBlackWhite(isLightMode, prefix, color, opacity) {
  const oppositeColor = color === 'black' ? 'white' : 'black'
  const opacitySuffix = opacity ? `/${opacity}` : ''

  return `${prefix}-${isLightMode ? oppositeColor : color}${opacitySuffix}`
}
