import AddIcon from '@mui/icons-material/Add'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppView } from '../../constants/enums'
import { openNewTripModal } from '../../redux/reducers/modalsSlice'
import {
  closeSidebar,
  setActiveTripId,
  setAppView,
  toggleSidebar,
} from '../../redux/reducers/viewSlice'
import { Logout } from '../user'
import mocktrips from './mock/trips'
import {
  toggleCompactView,
  toggleVerticalTimelines,
} from '../../redux/reducers/preferencesSlice'
import { Button, Toggle } from '../common'

export function SideBar() {
  const dispatch = useDispatch()
  const appView = useSelector((state) => state.view.appView)
  const activeTripId = useSelector((state) => state.view.activeTripId)
  const isSidebarOpen = useSelector((state) => state.view.isSidebarOpen)
  const isCompactView = useSelector((state) => state.preferences.compactView)
  const isVerticalTimelines = useSelector(
    (state) => state.preferences.verticalTimelines,
  )

  const [trips, setTrips] = useState([])

  useEffect(() => {
    // TODO link up to backend
    setTrips(mocktrips)
  }, [])

  const newTripButton = useMemo(() => {
    return (
      <Button
        className='box-border flex h-12 w-full flex-row border-2 border-yellow-300 bg-yellow-200/20 hover:bg-yellow-300/20'
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
    return trips.map((trip) => {
      const buttonColor =
        trip.id === activeTripId &&
        (appView === AppView.TRIP_VIEW || appView === AppView.DAY_VIEW)
          ? 'bg-green-300/40 font-medium hover:bg-green-400/40'
          : 'bg-slate-300/40 hover:bg-slate-400/40'

      return (
        <Button
          key={`sidebar-trip-${trip.id}`}
          onClick={() => {
            dispatch(setActiveTripId(trip.id))
          }}
          className={`w-full ${buttonColor}`}
        >
          {trip.tripName}
        </Button>
      )
    })
  }, [trips, activeTripId, appView, dispatch])

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
      <div className='mb-2 w-full rounded-md bg-slate-100/40 p-2'>
        <h3 className='mb-1 text-lg font-semibold'>Preferences</h3>
        {compactViewToggle}
        {verticalTimelinesToggle}
      </div>
    )
  }, [isVerticalTimelines, isCompactView, dispatch])

  const renderSidebarMainPortion = useMemo(() => {
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
        className={`fixed left-0 top-0 z-50 flex h-full w-1/5 flex-row overflow-hidden transition-all
                       ${isSidebarOpen ? 'left-0' : 'left-[-20vw]'}`}
      >
        <div className="flex h-full w-full flex-col justify-between overflow-hidden bg-slate-300 bg-[url('../public/little-prince.jpg')] bg-cover bg-center p-2 bg-blend-soft-light">
          {renderSidebarMainPortion}
          {renderSidebarBottomPortion}
        </div>
      </div>
    )
  }, [isSidebarOpen, renderSidebarMainPortion, renderSidebarBottomPortion])

  const renderSidebarToggleButton = useMemo(() => {
    return (
      <span
        className={`fixed top-0 z-50 flex h-full items-center rounded-none transition-all ${
          isSidebarOpen ? 'left-[20vw]' : 'left-0'
        }`}
      >
        <Button
          onClick={() => dispatch(toggleSidebar())}
          className='h-full w-10 rounded-none bg-slate-300 text-6xl hover:bg-slate-400'
        >
          {isSidebarOpen ? '‹' : '›'}
        </Button>
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
