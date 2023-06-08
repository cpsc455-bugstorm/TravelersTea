import PropTypes from 'prop-types'
import { useMemo, useRef, useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppView } from '../../constants/enums'
import { NewTripForm } from '../TripElement'
import {
  VANCOUVER_LONGITUDE,
  VANCOUVER_LATITUDE,
  ZOOM_GLOBE_LEVEL,
} from '../../constants/mapDefaultInfo'

import mapboxgl from '!mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

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

  const addMarkerOnMap = (longitude, latitude) => {
    const marker = new mapboxgl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(map)
    console.log(marker)
    const updatedMarkersOnMap = [...markersOnMap, marker]
    setMarkersOnMap(updatedMarkersOnMap)
  }

  const clearMarkersOnMap = () => {
    markersOnMap.forEach((marker) => marker.remove())
    setMarkersOnMap([])
  }

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
    console.log('Markers w props: ', markersWithProps)
    clearMarkersOnMap()
    for (let markerWithProps of markersWithProps) {
      addMarkerOnMap(markerWithProps.longitude, markerWithProps.latitude)
    }
  }, [markersWithProps])

  useEffect(() => {
    const { longitude, latitude, zoom } = defaultCoordinatesAndZoom
    console.log(longitude, latitude)
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

  // const handleClick = useCallback(() => {
  //   const { longitude, latitude, zoom } = defaultCoordinatesAndZoom
  //   console.log(longitude, latitude)
  //   const marker = new mapboxgl.Marker()
  //     .setLngLat([-79.347015, 43.6532])
  //     .addTo(map)
  // }, [map])

  return (
    <div ref={mapContainerRef} className='h-screen'>
      {/* <button onClick={handleClick}>Click me</button> */}
      {mapContent}
    </div>
  )
}
