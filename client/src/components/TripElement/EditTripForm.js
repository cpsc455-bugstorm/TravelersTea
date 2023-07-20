import { useDispatch, useSelector } from 'react-redux'
import { DEFAULT_SPEED, ZOOM_CITY_LEVEL } from '../../constants/mapDefaultInfo'
import {
  changeCoordinatesAndZoom,
  clearAllMarkersAndAdd_Store,
} from '../../redux/reducers/mapSlice'
import { closeEditTripModal } from '../../redux/reducers/modalsSlice'
import { updateTripAsync } from '../../redux/reducers/trips/thunks'
import { Modal } from '../common'
import { TripForm } from './TripForm'

export function EditTripForm() {
  const dispatch = useDispatch()
  const trips = useSelector((state) => state.trips.trips)

  const activeTripId = useSelector((state) => state.view.activeTripId)
  const activeTrip = trips.find((trip) => trip._id === activeTripId)

  const editTripModalIsOpen = useSelector(
    (state) => state.modals.editTripModalIsOpen,
  )

  const handleCloseEditTripModal = () => {
    dispatch(closeEditTripModal())
  }

  const onSubmit = async (data) => {
    handleCloseEditTripModal()
    try {
      const updatedTrip = await dispatch(
        updateTripAsync({ id: data._id, tripData: data }),
      ).unwrap()
      dispatch(
        changeCoordinatesAndZoom({
          longitude: updatedTrip.tripLongitude,
          latitude: updatedTrip.tripLatitude,
          zoom: ZOOM_CITY_LEVEL,
          speed: DEFAULT_SPEED,
        }),
      )
      dispatch(
        clearAllMarkersAndAdd_Store([
          {
            longitude: updatedTrip.tripLongitude,
            latitude: updatedTrip.tripLatitude,
            emoji: '📍',
            label: 'Marker Icon',
          },
        ]),
      )
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Modal
      open={editTripModalIsOpen}
      handleClose={handleCloseEditTripModal}
      title={
        <>
          Adjusting Course
          <span className='dot-1'>.</span>
          <span className='dot-2'>.</span>
          <span className='dot-3'>.</span>
        </>
      }
    >
      <TripForm onSubmit={onSubmit} initialValues={activeTrip} />
    </Modal>
  )
}
