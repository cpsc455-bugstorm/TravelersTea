import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddIcon from '@mui/icons-material/Add'

import { Button } from '../common'
import { AppView } from '../../constants/enums'
import { setActiveTripId, setAppView } from '../../redux/reducers/viewSlice'

export function SideBar() {
  const dispatch = useDispatch()
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

  const tripEntries = useMemo(() => {
    return trips.map((trip) => {
      return (
        <Button
          key={`sidebar-trip-${trip.id}`}
          onClick={() => {
            dispatch(setActiveTripId(trip.id))
          }}
          className={
            trip.id === activeTripId
              ? 'bg-green-300/40 font-medium hover:bg-green-400/40'
              : ''
          }
        >
          {trip.tripName}
        </Button>
      )
    })
  }, [trips])

  return (
    <div className="h-full w-full overflow-hidden bg-slate-200 p-2">
      <Button
        className="box-border flex h-12 w-full flex-row border-2 border-yellow-300 bg-yellow-200/20 hover:bg-yellow-300/20"
        onClick={() => dispatch(setAppView(AppView.NEW_TRIP))}
      >
        <AddIcon className="mx-2" />
        <h3>New Trip</h3>
      </Button>
      <div className="my-2 grid w-full grid-cols-1 gap-2 border-y-2 border-slate-300 py-2">
        {tripEntries}
      </div>
    </div>
  )
}
