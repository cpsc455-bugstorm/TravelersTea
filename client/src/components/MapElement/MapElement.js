import PropTypes from 'prop-types'
import { useMemo, useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppView } from '../../constants/enums'
import { NewTripForm } from '../TripElement'
import mapboxgl from '!mapbox-gl'
import { changeCoordinatesAndZoom } from '../../redux/reducers/mapSlice'

MapElement.propTypes = {
  className: PropTypes.string,
}

export function MapElement({ className }) {
  const appView = useSelector((state) => state.view.appView)
  const defaultCoordinatesAndZoom = useSelector(
    (state) => state.map.currentCoordinatesAndZoom,
  )
  const { long, lat, zoom } = defaultCoordinatesAndZoom
  const activeTripId = useSelector((state) => state.view.activeTripId)
  const dispatch = useDispatch()

  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN
  const mapContainer = useRef(null)
  const map = useRef(null)

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

  useEffect(() => {
    console.log(map)
    // map.current.state.map.flyTo({
    //   center: [long, lat],
    //   zoom: zoom,
    //   essential: true,
    // })
  }, [long, lat, zoom])

  useEffect(() => {
    if (map.current) return // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [long, lat],
      zoom: zoom,
    })
  })

  useEffect(() => {
    if (!map.current) return // wait for map to initialize
    map.current.on('move', () => {
      const newCooordinatesAndZoom = {
        long: map.current.getCenter().lng.toFixed(4),
        lat: map.current.getCenter().lat.toFixed(4),
        zoom: map.current.getZoom().toFixed(2),
      }
      dispatch(changeCoordinatesAndZoom(newCooordinatesAndZoom))
    })
  })

  return (
    <div ref={mapContainer} className='h-screen'>
      <div className='sidebar'>
        Longitude: {long} | Latitude: {lat} | Zoom: {zoom}
      </div>
      {mapContent}
    </div>
  )
}
