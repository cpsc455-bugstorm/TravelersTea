import { useDispatch, useSelector } from 'react-redux'
import { closeEditTripModal } from '../../redux/reducers/modalsSlice'
import { updateTripAsync } from '../../redux/reducers/trip/thunks'
import { Modal } from '../common'
import { TripForm } from './TripForm'

export function EditTripForm() {
  const dispatch = useDispatch()
  const trips = useSelector((state) => state.trip.trips)

  const activeTripId = useSelector((state) => state.view.activeTripId)
  const activeTrip = trips.find((trip) => trip._id === activeTripId)

  const editTripModalIsOpen = useSelector(
    (state) => state.modals.editTripModalIsOpen,
  )

  const handleCloseEditTripModal = () => {
    dispatch(closeEditTripModal())
  }

  const onSubmit = (data) => {
    dispatch(updateTripAsync({ id: data._id, tripData: data }))
    handleCloseEditTripModal()
  }

  return (
    <Modal
      open={editTripModalIsOpen}
      handleClose={handleCloseEditTripModal}
      title='Adjusting Course...'
    >
      <TripForm onSubmit={onSubmit} initialValues={activeTrip} />
    </Modal>
  )
}
