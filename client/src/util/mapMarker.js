// Credit for downward triangle svg: https://www.svgrepo.com/svg/108052/arrow-down-filled-triangle?edit=true
import mapboxgl from 'mapbox-gl'
import { getHexCode } from './tailwindColors'

export function createMapMarker(stage) {
  const {
    stageLongitude: longitude,
    stageLatitude: latitude,
    emoji,
    stageLocation: label,
    colorNumber,
  } = stage
  const colorHex = getHexCode(colorNumber)
  const markerElement = document.createElement('div')
  markerElement.innerHTML = `<div style='display: flex; flex-direction: column; align-items: center;'><p style='height: 40px; font-size: 40px; opacity: 1; '>${emoji}</p><svg fill='${colorHex}' style='height: 20px' id='Capa_1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96.154 96.154' xml:space='preserve' stroke='#000000'><g id='SVGRepo_bgCarrier' stroke-width='0'></g><g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g><g id='SVGRepo_iconCarrier'> <g> <path d='M0.561,20.971l45.951,57.605c0.76,0.951,2.367,0.951,3.127,0l45.956-57.609c0.547-0.689,0.709-1.716,0.414-2.61 c-0.061-0.187-0.129-0.33-0.186-0.437c-0.351-0.65-1.025-1.056-1.765-1.056H2.093c-0.736,0-1.414,0.405-1.762,1.056 c-0.059,0.109-0.127,0.253-0.184,0.426C-0.15,19.251,0.011,20.28,0.561,20.971z'></path> </g> </g></svg></div>`

  const marker = new mapboxgl.Marker({
    element: markerElement,
    occludedOpacity: 1,
  })
    .setLngLat([longitude, latitude])
    .setPopup(
      new mapboxgl.Popup({ closeOnMove: true }).setHTML(`<p>${label}</p>`),
    )

  return marker
}
