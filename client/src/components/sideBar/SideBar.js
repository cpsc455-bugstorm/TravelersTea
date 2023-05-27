import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import AddIcon from '@mui/icons-material/Add'

import { AppView } from '../../constants/enums'
import { setActiveTripId, setAppView } from '../../redux/reducers/viewSlice'

import { Button } from '../common'
import { closeSidebar } from '../../redux/reducers/sidebarSlice'

export function SideBar() {
  const dispatch = useDispatch()
  const [trips, setTrips] = useState([])

  useEffect(() => {
    // TODO link up to backend
    setTrips([{ id: 1, tripName: 'My First Trip' }])
  }, [])

  const tripEntries = useMemo(() => {
    return trips.map((trip) => {
      return (
        <Button
          key={`sidebar-trip-${trip.id}`}
          onClick={() => {
            dispatch(setActiveTripId(trip.id))
            dispatch(setAppView(AppView.TRIP_OVERVIEW))
            dispatch(closeSidebar())
          }}
        >
          {trip.tripName}
        </Button>
      )
    })
  }, [trips])

  return (
    <div className="h-full w-full overflow-hidden bg-slate-200 p-2">
      <Button
        className="box-border flex h-12 w-full flex-row border-2 border-yellow-300 bg-yellow-300/20"
        onClick={() => dispatch(setAppView(AppView.NEW_TRIP))}
      >
        <AddIcon className="mx-2" />
        <h3>New Trip</h3>
      </Button>
      <div className="my-2 w-full border-y-2 border-slate-300 py-2">
        {tripEntries}
      </div>
    </div>
  )
}
