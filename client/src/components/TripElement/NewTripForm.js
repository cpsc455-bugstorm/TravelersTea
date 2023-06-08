import { useDispatch, useSelector } from 'react-redux'
import { AppView } from '../../constants/enums'
import { closeNewTripModal } from '../../redux/reducers/modalsSlice'
import { addTrip, selectCurrentId } from '../../redux/reducers/userSlice'
import { setActiveTripId, setAppView } from '../../redux/reducers/viewSlice'
import { Modal } from '../common'
import { TripForm } from './TripForm'

export function NewTripForm() {
  const appView = useSelector((state) => state.view.appView)
  const currentId = useSelector(selectCurrentId)
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
    dispatch(addTrip(data))
    dispatch(setActiveTripId(currentId))
    dispatch(setAppView(AppView.TRIP_VIEW))
    dispatch(closeNewTripModal())
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
