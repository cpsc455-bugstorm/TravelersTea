import { useDispatch, useSelector } from 'react-redux'
import { AppView } from '../../constants/enums'
import { closeEditTripModal } from '../../redux/reducers/modalsSlice'
import { setAppView } from '../../redux/reducers/viewSlice'
import { Modal } from '../common'
import { TripForm } from './TripForm'

export function EditTripForm() {
  const appView = useSelector((state) => state.view.appView)
  const activeTripId = useSelector((state) => state.view.activeTripId)

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
    handleCloseEditTripModal()
  }

  return (
    <Modal
      open={editTripModalIsOpen}
      handleClose={handleCloseEditTripModal}
      title='Adjusting Course...'
    >
      <TripForm onSubmit={onSubmit} />
    </Modal>
  )
}
