import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddIcon from '@mui/icons-material/Add'

import { Button, Toggle } from '../common'
import { AppView } from '../../constants/enums'
import { setActiveTripId, setAppView } from '../../redux/reducers/viewSlice'
import { Logout } from '../user/Logout'
export function SideBar() {
  const dispatch = useDispatch()
  const appView = useSelector((state) => state.view.appView)
  const activeTripId = useSelector((state) => state.view.activeTripId)

  const [trips, setTrips] = useState([])

  useEffect(() => {
    // TODO link up to backend
    setTrips([
      { id: 1, tripName: 'My First Trip' },
      { id: 2, tripName: 'Another Trip' },
      { id: 3, tripName: 'A Third Trip' },
    ])
  }, [])

  const newTripButton = useMemo(() => {
    return (
      <Button
        className='box-border flex h-12 w-full flex-row border-2 border-yellow-300 bg-yellow-200/20 hover:bg-yellow-300/20'
        onClick={() => dispatch(setAppView(AppView.NEW_TRIP))}
      >
        <AddIcon className='mx-2' />
        <h3>New Trip</h3>
      </Button>
    )
  }, [])

  const tripEntries = useMemo(() => {
    return trips.map((trip) => {
      return (
        <Button
          key={`sidebar-trip-${trip.id}`}
          onClick={() => {
            dispatch(setActiveTripId(trip.id))
          }}
          className='w-full bg-opacity-40 hover:bg-opacity-40'
          active={
            trip.id === activeTripId &&
            (appView === AppView.TRIP_OVERVIEW || appView === AppView.TRIP_DAY)
          }
        >
          {trip.tripName}
        </Button>
      )
    })
  }, [trips, activeTripId, appView])

  const preferencesModalBtn = useMemo(() => {
    // TODO refactor this to return a button that opens a modal.
    //    Please follow any conventions that Meng uses when styling / storing modal content
    return (
      <div className='w-full rounded-md bg-slate-100/40 p-2'>
        <h3 className='text-lg font-semibold'>Preferences</h3>
        <Toggle label='Compact View' onClick={() => {}} active={false} />
      </div>
    )
  }, [])

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden bg-slate-300 bg-[url('../public/little-prince.jpg')] bg-cover bg-center p-2 bg-blend-soft-light">
      <div className='overflow-x-auto'>
        {newTripButton}
        <div className='my-2 grid w-full grid-cols-1 gap-2 border-y-2 border-slate-300 py-2'>
          {tripEntries}
        </div>
      </div>
      <div className='box-border w-full shrink-0 py-2'>
        {preferencesModalBtn}
      </div>
      <Logout />
    </div>
  )
}
