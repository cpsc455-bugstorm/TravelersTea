import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { closeEditTripModal } from '../../redux/reducers/modalsSlice'
import {
  editTripAsync,
  fetchTripsAsync,
} from '../../redux/reducers/trip/thunks'
import { REQUEST_STATE } from '../../redux/states'
import { Modal } from '../common'
import { TripForm } from './TripForm'

export function EditTripForm() {
  const dispatch = useDispatch()

  const activeTripId = useSelector((state) => state.view.activeTripId)

  const trips = useSelector((state) => state.trip.trips)
  const tripsStatus = useSelector((state) => state.trip.status)
  useEffect(() => {
    dispatch(fetchTripsAsync())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (tripsStatus === REQUEST_STATE.PENDING) {
      dispatch(fetchTripsAsync())
    }
  }, [dispatch, tripsStatus])

  const activeTrip = trips.find((trip) => trip._id === activeTripId)

  const editTripModalIsOpen = useSelector(
    (state) => state.modals.editTripModalIsOpen,
  )

  const handleCloseEditTripModal = () => {
    dispatch(closeEditTripModal())
  }

  const onSubmit = (data) => {
    dispatch(editTripAsync({ id: data._id, tripData: data }))
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
