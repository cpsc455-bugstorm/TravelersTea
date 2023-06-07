import { useDispatch, useSelector } from 'react-redux'
import { AppView } from '../../constants/enums'
import { closeNewTripModal } from '../../redux/reducers/modalsSlice'
import { setAppView } from '../../redux/reducers/viewSlice'
import { Modal } from '../common'
import { TripForm } from './TripForm'

export function NewTripForm() {
  const appView = useSelector((state) => state.view.appView)
  const newTripModalIsOpen = useSelector(
    (state) => state.modals.newTripModalIsOpen,
  )
  const dispatch = useDispatch()

  const handleCloseNewTripModal = () => {
    dispatch(closeNewTripModal())
  }

  const onSubmit = (data) => {
    // TODO: make api call to create new trip
    console.log(data)
    dispatch(setAppView(AppView.TRIP_VIEW))
    handleCloseNewTripModal()
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
