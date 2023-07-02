import { useDispatch, useSelector } from 'react-redux'
import { AppView } from '../../constants/enums'
import { ZOOM_CITY_LEVEL } from '../../constants/mapDefaultInfo'
import {
  changeCoordinatesAndZoom,
  clearAllMarkersAndAdd_Store,
} from '../../redux/reducers/mapSlice'
import { closeNewTripModal } from '../../redux/reducers/modalsSlice'
import { createTripAsync } from '../../redux/reducers/trip/thunks'
import { setActiveTripId, setAppView } from '../../redux/reducers/viewSlice'
import { Modal } from '../common'
import { TripForm } from './TripForm'

export function NewTripForm() {
  const dispatch = useDispatch()
  const appView = useSelector((state) => state.view.appView)
  const trips = useSelector((state) => state.trip.trips)

  const newTripModalIsOpen = useSelector(
    (state) => state.modals.newTripModalIsOpen,
  )

  const handleCloseNewTripModal = () => {
    dispatch(closeNewTripModal())
  }

  const onSubmit = async (data) => {
    // this is default tripName, lat, long, TODO: get from other endpoints
    const tripDataWithTripName = {
      ...data,
      tripName: `Your Trip ${trips.length + 1}`,
      tripLatitude: 49.23990319450836,
      tripLongitude: -123.15644121337681,
    }
    const newTrip = await dispatch(
      createTripAsync(tripDataWithTripName),
    ).unwrap()
    dispatch(setActiveTripId(newTrip._id))
    dispatch(setAppView(AppView.TRIP_VIEW))
    dispatch(closeNewTripModal())
    dispatch(
      changeCoordinatesAndZoom({
        longitude: newTrip.tripLongitude,
        latitude: newTrip.tripLatitude,
        zoom: ZOOM_CITY_LEVEL,
      }),
    )
    dispatch(
      clearAllMarkersAndAdd_Store([
        {
          longitude: newTrip.tripLongitude,
          latitude: newTrip.tripLatitude,
          emoji: '📍',
          label: 'Marker Icon',
        },
      ]),
    )
  }

  return (
    <Modal
      open={appView === AppView.NEW_TRIP && newTripModalIsOpen}
      handleClose={handleCloseNewTripModal}
      title='Manifesting A New Trip...'
    >
      <TripForm onSubmit={onSubmit} />
    </Modal>
  )
}
