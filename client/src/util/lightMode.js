export function shouldUseLightMode() {
  const localStoragePreference = localStorage.getItem('isLightMode')

  if (localStoragePreference !== null) return localStoragePreference === 'true'

  const userOSPreference =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: light)').matches

  return userOSPreference || false
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
