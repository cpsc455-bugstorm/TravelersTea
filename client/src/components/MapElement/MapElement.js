import mapboxgl from '!mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  LAT_START,
  LONG_START,
  ZOOM_GLOBE_LEVEL,
} from '../../constants/mapDefaultInfo'
import { createMapMarker } from '../../util/mapMarker'
import { EditTripForm, NewTripForm } from '../TripElement'
import { EditStageForm } from '../TripElement/EditStageForm'

MapElement.propTypes = {
  className: PropTypes.string,
}

export function MapElement({ className }) {
  const stagesByDay = useSelector((state) => state.stages.stages)
  const mapData = useSelector((state) => state.map.mapData)
  const activeDayNumber = useSelector((state) => state.view.activeDayNumber)
  const [map, setMap] = useState(null)
  const mapContainerRef = useRef(null)
  const [markerRetryCounter, setMarkerRetryCounter] = useState(0)
  const [mapStyleRetryCounter, setMapStyleRetryCounter] = useState(0)
  const isLightMode = useSelector((state) => state.preferences.lightMode)
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

  const renderMapForms = useMemo(() => {
    return (
      <span className='mt-4 inline-flex w-full flex-row justify-center'>
        <NewTripForm />
        <EditTripForm />
        <EditStageForm />
      </span>
    )
  }, [])

  // Needs to be extracted out to avoid infinite reruns
  const addMarkersToMap = useCallback(() => {
    const markers = []
    try {
      if (map?.getCanvasContainer()) {
        for (let day of stagesByDay) {
          const opacity =
            activeDayNumber === -1 ||
            activeDayNumber === stagesByDay.indexOf(day) + 1
              ? 1
              : 0.2
          for (let stage of day) {
            markers.push(createMapMarker(stage, opacity).addTo(map))
          }
        }
      }
    } catch (e) {
      setMarkerRetryCounter((prev) => prev + 1)
    }
    return markers
  }, [activeDayNumber, map, stagesByDay])

  useEffect(() => {
    try {
      const markers = addMarkersToMap()
      return () => {
        markers.forEach((marker) => marker.remove())
      }
    } catch (e) {
      setMarkerRetryCounter((prev) => prev + 1)
    }
  }, [map, stagesByDay, addMarkersToMap, markerRetryCounter])

  useEffect(() => {
    const { longitude, latitude, zoom, speed } = mapData
    if (map) {
      map.flyTo({
        center: [longitude, latitude],
        zoom,
        essential: true,
        speed,
      })
    }
  }, [mapData, map])

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [LONG_START, LAT_START],
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

    // source: https://docs.mapbox.com/mapbox-gl-js/example/globe-spin/
    // The following values can be changed to control rotation speed:
    // At low zooms, complete a revolution every two minutes.
    const secondsPerRevolution = 120
    // Above zoom level 5, do not rotate.
    const maxSpinZoom = 5
    // Rotate at intermediate speeds between zoom levels 3 and 5.
    const slowSpinZoom = 3

    let userInteracting = false
    let spinEnabled = true

    function spinGlobe() {
      const zoom = map.getZoom()
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution
        if (zoom > slowSpinZoom) {
          // Slow spinning at higher zooms
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom)
          distancePerSecond *= zoomDif
        }
        const center = map.getCenter()
        center.lng -= distancePerSecond
        // Smoothly animate the map over one second.
        // When this animation is complete, it calls a 'moveend' event.
        map.easeTo({ center, duration: 1000, easing: (n) => n })
      }
    }

    // Pause spinning on interaction
    map.on('mousedown', () => {
      userInteracting = true
    })

    // Restart spinning the globe when interaction is complete
    map.on('mouseup', () => {
      userInteracting = false
      spinGlobe()
    })

    // These events account for cases where the mouse has moved
    // off the map, so 'mouseup' will not be fired.
    map.on('dragend', () => {
      userInteracting = false
      spinGlobe()
    })
    map.on('pitchend', () => {
      userInteracting = false
      spinGlobe()
    })
    map.on('rotateend', () => {
      userInteracting = false
      spinGlobe()
    })

    map.on('moveend', () => {
      spinGlobe()
    })
    spinGlobe()

    setMap(map)
    return () => map.remove()
  }, [])

  useEffect(() => {
    if (map) {
      try {
        const styleToSet = isLightMode
          ? 'mapbox://styles/mapbox/navigation-day-v1'
          : 'mapbox://styles/mapbox/navigation-night-v1'
        map.setStyle(styleToSet)
      } catch (e) {
        setMapStyleRetryCounter((prev) => prev + 1)
      }
    }
  }, [isLightMode, map, mapStyleRetryCounter])

  useEffect(() => {
    if (stagesByDay.length > 0) {
      const rightPadding = window.innerWidth / 3 + 50
      const markers = addMarkersToMap()

      // Calculate the bounding box
      let minLat = Infinity
      let maxLat = -Infinity
      let minLng = Infinity
      let maxLng = -Infinity

      const daysToConsider =
        activeDayNumber === -1
          ? stagesByDay
          : [stagesByDay[activeDayNumber - 1]]

      for (let day of daysToConsider) {
        for (let stage of day) {
          minLat = Math.min(minLat, stage.stageLatitude)
          maxLat = Math.max(maxLat, stage.stageLatitude)
          minLng = Math.min(minLng, stage.stageLongitude)
          maxLng = Math.max(maxLng, stage.stageLongitude)
        }
      }

      // Adjust the map's view
      if (map) {
        map.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          {
            padding: { top: 100, bottom: 250, left: 100, right: rightPadding },
          },
        )
      }

      return () => {
        markers.forEach((marker) => marker.remove())
      }
    }
  }, [stagesByDay, addMarkersToMap, markerRetryCounter, map, activeDayNumber])

  return (
    <div className={`fixed left-0 top-0 ${className}`}>
      <div ref={mapContainerRef} className='h-screen' />
      {renderMapForms}
    </div>
  )
}
