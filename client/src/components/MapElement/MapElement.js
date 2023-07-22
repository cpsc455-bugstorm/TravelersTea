import mapboxgl from '!mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { AppView } from '../../constants/enums'
import {
  VANCOUVER_LATITUDE,
  VANCOUVER_LONGITUDE,
  ZOOM_GLOBE_LEVEL,
} from '../../constants/mapDefaultInfo'
import { EditTripForm, NewTripForm } from '../TripElement'
import { EditStageForm } from '../TripElement/EditStageForm'

MapElement.propTypes = {
  className: PropTypes.string,
}

export function MapElement({ className }) {
  const appView = useSelector((state) => state.view.appView)
  const activeTripId = useSelector((state) => state.view.activeTripId)
  const mapData = useSelector((state) => state.map.mapData)
  const markersWithProps = useSelector((state) => state.map.markers)
  const [map, setMap] = useState(null)
  const mapContainerRef = useRef(null)
  const [markersOnMap, setMarkersOnMap] = useState([])
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

  const mapContent = useMemo(() => {
    if (appView === AppView.NEW_TRIP) {
      return <NewTripForm />
    }
    return (
      <span className='mt-4 inline-flex w-full flex-row justify-center'>
        <h1 className='w-fit rounded-md bg-slate-900 bg-opacity-40 p-4 text-5xl'>
          Map (placeholder #{activeTripId})
        </h1>
        <EditTripForm />
        <EditStageForm />
      </span>
    )
  }, [appView, activeTripId])

  const addMarkerOnMap = useCallback(
    (longitude, latitude, emoji, label) => {
      if (map) {
        const markerElement = document.createElement('div')
        markerElement.innerHTML = `<p style='width: 40px; height: 40px; font-size: 40px; opacity: 1; '> ${emoji} <p>`
        const marker = new mapboxgl.Marker({
          element: markerElement,
          occludedOpacity: 1,
        })
          .setLngLat([longitude, latitude])
          .setPopup(
            new mapboxgl.Popup({ closeOnMove: true }).setHTML(
              `<p>${label}</p>`,
            ),
          )
          .addTo(map)

        setMarkersOnMap((prevMarkers) => [...prevMarkers, marker])
      }
    },
    [map],
  )

  const clearMarkersOnMap = useCallback(() => {
    markersOnMap.forEach((marker) => marker.remove())
    setMarkersOnMap([])
  }, [markersOnMap])

  useEffect(() => {
    clearMarkersOnMap()
    for (let markerWithProps of markersWithProps) {
      addMarkerOnMap(
        markerWithProps.longitude,
        markerWithProps.latitude,
        markerWithProps.emoji,
        markerWithProps.label,
      )
    }
    // tracking 'markersOnMap' in this useEffect would trigger constant reruns.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markersWithProps, map])

  const flyToLocation = useCallback(
    (longitude, latitude, zoom, speed) => {
      map.flyTo({
        center: [longitude, latitude],
        zoom,
        essential: true,
        speed,
      })
    },
    [map],
  )

  useEffect(() => {
    const { longitude, latitude, zoom, speed } = mapData
    if (map) {
      flyToLocation(longitude, latitude, zoom, speed)
    }
  }, [mapData, flyToLocation, map])

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      center: [VANCOUVER_LONGITUDE, VANCOUVER_LATITUDE],
      zoom: ZOOM_GLOBE_LEVEL,
      projection: 'globe',
    })

    map.on('style.load', () => {
      // Custom atmosphere styling
      map.setFog({
        color: 'rgba(255,220,195,0.87)', // Pink fog / lower atmosphere
        'high-color': 'rgb(36, 92, 223)', // Blue sky / upper atmosphere
        'space-color': '#141d41',
        'horizon-blend': 0.15, // Exaggerate atmosphere (default is .1)
      })

      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.terrain-rgb',
      })

      map.setTerrain({
        source: 'mapbox-dem',
        exaggeration: 1.5,
      })
    })

    setMap(map)
    return () => map.remove()
  }, [])

  return (
    <div className={`fixed left-0 top-0 ${className}`}>
      <div ref={mapContainerRef} className='h-screen' />
      {mapContent}
    </div>
  )
}
