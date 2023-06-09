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
import { NewTripForm } from '../TripElement'

MapElement.propTypes = {
  className: PropTypes.string,
}

export function MapElement({ className }) {
  const appView = useSelector((state) => state.view.appView)
  const activeTripId = useSelector((state) => state.view.activeTripId)
  const defaultCoordinatesAndZoom = useSelector(
    (state) => state.map.currentCoordinatesAndZoom,
  )
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
      </span>
    )
  }, [appView, activeTripId])

  const addMarkerOnMap = useCallback(
    (
      longitude,
      latitude,
      imgSrc = 'https://pngimg.com/d/google_maps_pin_PNG56.png',
      altText = 'Marker Icon',
    ) => {
      const markerElement = document.createElement('div')
      markerElement.innerHTML = `<img src="${imgSrc}" alt="${altText}" style="width: 40px; height: 40px;"/>`
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([longitude, latitude])
        .addTo(map)
      setMarkersOnMap((prevMarkers) => [...prevMarkers, marker])
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
        markerWithProps.imgSrc,
        markerWithProps.label,
      )
    }
    // tracking 'markersOnMap' in this useEffect would trigger constant reruns.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markersWithProps, map])

  const flyToLocation = useCallback(
    (longitude, latitude, zoom) => {
      map.flyTo({
        center: [longitude, latitude],
        zoom,
        essential: true,
      })
    },
    [map],
  )

  useEffect(() => {
    const { longitude, latitude, zoom } = defaultCoordinatesAndZoom
    if (map) {
      flyToLocation(longitude, latitude, zoom)
    }
  }, [defaultCoordinatesAndZoom, flyToLocation, map])

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [VANCOUVER_LONGITUDE, VANCOUVER_LATITUDE],
      zoom: ZOOM_GLOBE_LEVEL,
    })

    setMap(map)
    return () => map.remove()
  }, [])

  return (
    <div className={`${className}`}>
      <div ref={mapContainerRef} className='h-screen' />
      {mapContent}
    </div>
  )
}
