import { useDispatch, useSelector } from 'react-redux'
import { closeEditStageModal } from '../../redux/reducers/modalsSlice'
import { Modal } from '../common'
import { StageForm } from './StageForm'
import { updateStageAsync } from '../../redux/reducers/stage/thunks'

export function EditStageForm() {
  const dispatch = useDispatch()
  const trips = useSelector((state) => state.trips.trips)

  const activeTripId = useSelector((state) => state.view.activeTripId)
  const activeTrip = trips.find((trip) => trip._id === activeTripId)
  const editStageModalIsOpen = useSelector(
    (state) => state.modals.editStageModalIsOpen,
  )

  const handleCloseEditStageModal = () => {
    dispatch(closeEditStageModal())
  }

  const onSubmit = async (updateData) => {
    handleCloseEditStageModal()
    try {
      await dispatch(
        updateStageAsync({
          id: updateData.stage._id,
          updateData: { ...updateData, trip: activeTrip },
        }),
      ).unwrap()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Modal
      open={editStageModalIsOpen}
      handleClose={handleCloseEditStageModal}
      title={
        <>
          Adjusting Plan
          <span className='dot-1'>.</span>
          <span className='dot-2'>.</span>
          <span className='dot-3'>.</span>
        </>
      }
    >
      <StageForm onSubmit={onSubmit} />
    </Modal>
  )
}
