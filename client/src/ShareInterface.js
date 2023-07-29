import { useDispatch, useSelector } from 'react-redux'
import { MapElement } from './components/MapElement'
import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import {
  CompactTripView,
  DayViewContent,
  NonCompactTripView,
} from './components/Views'
import { AppView } from './constants/enums'
import { fetchStagesBySharedTripIdAsync } from './redux/reducers/stage/thunks'
import { fetchSharedTripByTripIdAsync } from './redux/reducers/trips/thunks'
import { DEFAULT_SPEED, ZOOM_CITY_LEVEL } from './constants/mapDefaultInfo'
import { changeCoordinatesAndZoom } from './redux/reducers/mapSlice'
import { setActiveTripId } from './redux/reducers/viewSlice'

export function ShareInterface() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const appView = useSelector((state) => state.view.appView)
  const isCompactView = useSelector((state) => state.preferences.compactView)
  const activeTripId = useSelector((state) => state.view.activeTripId)

  useEffect(() => {
    async function fetchSharedTrip() {
      try {
        const trips = await dispatch(fetchSharedTripByTripIdAsync(id)).unwrap()
        if (trips.length !== 1) {
          throw Error('many trips received, this should not have happened')
        } else {
          const trip = trips[0]
          dispatch(setActiveTripId(trip._id))
          dispatch(fetchStagesBySharedTripIdAsync(id))
          dispatch(
            changeCoordinatesAndZoom({
              longitude: trip.tripLongitude,
              latitude: trip.tripLatitude,
              zoom: ZOOM_CITY_LEVEL,
              speed: DEFAULT_SPEED,
            }),
          )
        }
      } catch (error) {
        console.log(error.message)
      }
    }

    fetchSharedTrip().catch()
  }, [dispatch, id])

  const renderMainContent = useMemo(() => {
    let content = <></>
    if (!activeTripId) {
      return content
    }
    if (appView === AppView.TRIP_VIEW)
      content = isCompactView ? <CompactTripView /> : <NonCompactTripView />
    else if (appView === AppView.DAY_VIEW) content = <DayViewContent />

    return (
      <div
        className={`pointer-events-none absolute bottom-0 z-10 flex w-full items-end overflow-x-hidden overflow-y-hidden transition-all ${
          appView === AppView.NEW_TRIP ? 'h-0' : 'h-full'
        }`}
      >
        {content}
      </div>
    )
  }, [appView, isCompactView])

  return (
    <div className='h-screen w-screen overflow-hidden'>
      {renderMainContent}
      <MapElement className={`relative h-full w-full`} />
    </div>
  )
}
