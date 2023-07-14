import { useDispatch, useSelector } from 'react-redux'
import { AppView } from '../../constants/enums'
import { ZOOM_CITY_LEVEL } from '../../constants/mapDefaultInfo'
import {
  changeCoordinatesAndZoom,
  clearAllMarkersAndAdd_Store,
} from '../../redux/reducers/mapSlice'
import { closeNewTripModal } from '../../redux/reducers/modalsSlice'
import { createTripAsync } from '../../redux/reducers/trips/thunks'
import { setActiveTripId, setAppView } from '../../redux/reducers/viewSlice'
import { Modal } from '../common'
import { TripForm } from './TripForm'

export function NewTripForm() {
  const dispatch = useDispatch()
  const appView = useSelector((state) => state.view.appView)
  const trips = useSelector((state) => state.trips.trips)
  const user = useSelector((state) => state.users.user)

  const newTripModalIsOpen = useSelector(
    (state) => state.modals.newTripModalIsOpen,
  )

  const handleCloseNewTripModal = () => {
    dispatch(closeNewTripModal())
  }

  const onSubmit = async (data) => {
    dispatch(closeNewTripModal())
    const tripDataWithTripName = {
      ...data,
      tripName: `Your Trip ${trips.length + 1}`,
      userId: user.id,
    }
    const newTrip = await dispatch(
      createTripAsync(tripDataWithTripName),
    ).unwrap()
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
    dispatch(setAppView(AppView.TRIP_VIEW))
    dispatch(setActiveTripId(newTrip._id))
  }

  return (
    <>
      (
      <Modal
        open={appView === AppView.NEW_TRIP && newTripModalIsOpen}
        handleClose={handleCloseNewTripModal}
        title='Manifesting A New Trip...'
      >
        <TripForm onSubmit={onSubmit} />
      </Modal>
      )
    </>
  )
}
