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
import { createMapMarker } from '../../util/mapMarker'

MapElement.propTypes = {
  className: PropTypes.string,
}

export function MapElement({ className }) {
  const appView = useSelector((state) => state.view.appView)
  const stagesByDay = useSelector((state) => state.stages.stages)
  const mapData = useSelector((state) => state.map.mapData)
  const [map, setMap] = useState(null)
  const mapContainerRef = useRef(null)
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

  const renderMapForms = useMemo(() => {
    if (appView === AppView.NEW_TRIP) {
      return <NewTripForm />
    }
    return (
      <span className='mt-4 inline-flex w-full flex-row justify-center'>
        <EditTripForm />
        <EditStageForm />
      </span>
    )
  }, [appView])

  // Needs to be extracted out to avoid infinite reruns
  const addMarkersToMap = useCallback(() => {
    const markers = []
    if (map?.getCanvasContainer()) {
      for (let day of stagesByDay) {
        for (let stage of day) {
          markers.push(createMapMarker(stage).addTo(map))
        }
      }
    }
    return markers
  }, [map, stagesByDay])

  useEffect(() => {
    const markers = addMarkersToMap()
    return () => markers.forEach((marker) => marker.remove())
  }, [stagesByDay, addMarkersToMap])

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

  return (
    <div className={`fixed left-0 top-0 ${className}`}>
      <div ref={mapContainerRef} className='h-screen' />
      {renderMapForms}
    </div>
  )
}
