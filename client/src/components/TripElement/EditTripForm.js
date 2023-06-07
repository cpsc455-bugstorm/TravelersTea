import { useDispatch, useSelector } from 'react-redux'
import { closeEditTripModal } from '../../redux/reducers/modalsSlice'
import { selectTrips, editTrip } from '../../redux/reducers/userSlice'
import { Modal } from '../common'
import { TripForm } from './TripForm'

export function EditTripForm() {
  const activeTripId = useSelector((state) => state.view.activeTripId)
  const trips = useSelector(selectTrips)
  const activeTrip = trips.find((trip) => trip.id === activeTripId)

  const editTripModalIsOpen = useSelector(
    (state) => state.modals.editTripModalIsOpen,
  )
  const dispatch = useDispatch()

  const handleCloseEditTripModal = () => {
    dispatch(closeEditTripModal())
  }

  const onSubmit = (data) => {
    // TODO: make api call to create new trip
    console.log(data)
    dispatch(editTrip({ ...activeTrip, ...data }))
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
