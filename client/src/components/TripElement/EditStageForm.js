import { useDispatch, useSelector } from 'react-redux'
import { closeEditStageModal } from '../../redux/reducers/modalsSlice'
import { Modal } from '../common'

export function EditStageForm() {
  const dispatch = useDispatch()
  const trips = useSelector((state) => state.trips.trips)

  const activeTripId = useSelector((state) => state.view.activeTripId)
  const activeTrip = trips.find((trip) => trip._id === activeTripId)
  // TODO: remove logging
  console.log(JSON.stringify(activeTrip, null, 2))

  const editStageModalIsOpen = useSelector(
    (state) => state.modals.editStageModalIsOpen,
  )

  const handleCloseEditStageModal = () => {
    dispatch(closeEditStageModal())
  }

  const onSubmit = (data) => {
    // dispatch(updateTripAsync({ id: data._id, tripData: data }))
    handleCloseEditStageModal()
  }

  return (
    <Modal
      open={editStageModalIsOpen}
      handleClose={handleCloseEditStageModal}
      title='Adjusting Course...'
    >
      Work in progress...
    </Modal>
  )
}
