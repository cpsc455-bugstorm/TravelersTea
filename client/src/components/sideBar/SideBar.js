import AddIcon from '@mui/icons-material/Add'

import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppView } from '../../constants/enums'
import { openNewTripModal } from '../../redux/reducers/modalsSlice'
import {
  toggleCompactView,
  toggleVerticalTimelines,
} from '../../redux/reducers/preferencesSlice'
import { fetchTripsAsync } from '../../redux/reducers/trip/thunks'
import {
  closeSidebar,
  setAppView,
  toggleSidebar,
} from '../../redux/reducers/viewSlice'
import { REQUEST_STATE } from '../../redux/states'
import { TripEntry } from '../TripElement'
import { Button, Toggle } from '../common'
import { Logout } from '../user'

export function SideBar() {
  const dispatch = useDispatch()
  const appView = useSelector((state) => state.view.appView)
  const activeTripId = useSelector((state) => state.view.activeTripId)
  const isSidebarOpen = useSelector((state) => state.view.isSidebarOpen)
  const isCompactView = useSelector((state) => state.preferences.compactView)
  const isVerticalTimelines = useSelector(
    (state) => state.preferences.verticalTimelines,
  )

  const trips = useSelector((state) => state.trip.trips)
  const tripsStatus = useSelector((state) => state.trip.status)
  useEffect(() => {
    if (
      tripsStatus === REQUEST_STATE.PENDING ||
      tripsStatus === REQUEST_STATE.IDLE
    ) {
      dispatch(fetchTripsAsync())
    }
  }, [dispatch, tripsStatus])

  const newTripButton = useMemo(() => {
    return (
      <Button
        className='box-border flex h-12 w-full flex-row border-2 border-cyan-200 bg-cyan-200/80 hover:bg-emerald-400/100'
        onClick={() => {
          dispatch(setAppView(AppView.NEW_TRIP))
          dispatch(openNewTripModal())
          dispatch(closeSidebar())
        }}
      >
        <AddIcon className='mx-2' />
        <h3>New Trip</h3>
      </Button>
    )
  }, [dispatch])

  const tripEntries = useMemo(() => {
    return trips.map((trip, index) => {
      const buttonColor =
        trip._id === activeTripId &&
        (appView === AppView.TRIP_VIEW || appView === AppView.DAY_VIEW)
          ? 'bg-cyan-700/70 font-medium text-white hover:bg-cyan-400/40'
          : 'bg-slate-500/30 hover:bg-slate-600/60 text-white'

      return (
        <TripEntry
          id={trip._id}
          key={`trip-entry-${index}`}
          buttonClassName={`w-full ${buttonColor}`}
          trip={trip}
        />
      )
    })
  }, [trips, activeTripId, appView])

  const preferencesModalBtn = useMemo(() => {
    // TODO refactor this to return a button that opens a modal.
    //    Please follow any conventions that Meng uses when styling / storing modal content
    const compactViewToggle = (
      <Toggle
        className='mb-2'
        label='Compact View'
        onClick={() => {
          dispatch(toggleCompactView())
        }}
        active={isCompactView}
      />
    )
    const verticalTimelinesToggle = (
      <Toggle
        label='Vertical Timelines'
        onClick={() => {
          dispatch(toggleVerticalTimelines())
        }}
        active={isVerticalTimelines}
      />
    )

    return (
      <div className='mb-2 w-full rounded-md bg-slate-300/20 p-2 text-white'>
        <h3 className='mb-1 text-lg font-semibold'>Preferences</h3>
        {compactViewToggle}
        {verticalTimelinesToggle}
      </div>
    )
  }, [isVerticalTimelines, isCompactView, dispatch])

  const renderSidebarTrips = useMemo(() => {
    return (
      <div className='overflow-x-auto'>
        {newTripButton}
        <div className='my-2 grid w-full grid-cols-1 gap-2 border-y-2 border-slate-300 py-2'>
          {tripEntries}
        </div>
      </div>
    )
  }, [newTripButton, tripEntries])

  const renderSidebarBottomPortion = useMemo(() => {
    return (
      <div className='box-border w-full shrink-0 py-2'>
        {preferencesModalBtn}
        <Logout />
      </div>
    )
  }, [preferencesModalBtn])

  const renderSidebar = useMemo(() => {
    return (
      <div
        className={`fixed left-0 top-0 z-50 flex h-full w-[260px] flex-row overflow-hidden transition-all
                       ${isSidebarOpen ? 'left-0' : 'left-[-260px]'}`}
      >
        <div className='relative flex h-full w-full flex-col justify-between overflow-hidden bg-black bg-black'>
          <div className="z-0 h-full w-full flex-grow bg-slate-200 bg-[url('../public/little-prince.jpg')] bg-cover bg-center opacity-50 bg-blend-difference"></div>
          <div className={`black-gradient absolute inset-0 z-10 p-2`}>
            <div className='relative z-20 flex h-full flex-col justify-between'>
              {renderSidebarTrips}
              {renderSidebarBottomPortion}
            </div>
          </div>
        </div>
      </div>
    )
  }, [isSidebarOpen, renderSidebarTrips, renderSidebarBottomPortion])

  const renderSidebarToggleButton = useMemo(() => {
    return (
      <span
        className={`fixed top-0 z-50 flex h-full items-center transition-all ${
          isSidebarOpen ? 'left-[260px]' : 'left-0'
        }`}
      >
        <div className='relative h-full w-10'>
          <div className='absolute inset-0 z-0'></div>
          <Button
            onClick={() => dispatch(toggleSidebar())}
            className={`relative z-10 h-full w-full rounded-none bg-gradient-to-b from-transparent via-black/20 to-black/90 text-6xl text-slate-100 hover:bg-slate-400/50 hover:text-white`}
          >
            {isSidebarOpen ? '‹' : '›'}
          </Button>
        </div>
      </span>
    )
  }, [isSidebarOpen, dispatch])

  const renderSidebarShading = useMemo(() => {
    if (!isSidebarOpen) return <></>
    return (
      <div
        className={`fixed left-0 top-0 z-[45] h-full w-full bg-slate-800 opacity-30`}
        onClick={() => dispatch(closeSidebar())}
      />
    )
  }, [dispatch, isSidebarOpen])

  return (
    <>
      {renderSidebar}
      {renderSidebarToggleButton}
      {renderSidebarShading}
    </>
  )
}
