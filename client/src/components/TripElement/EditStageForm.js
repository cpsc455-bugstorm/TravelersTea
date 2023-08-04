import { useDispatch, useSelector } from 'react-redux'
import { closeEditStageModal } from '../../redux/reducers/modalsSlice'
import { Modal } from '../common'
import { StageForm } from './StageForm'
import { updateStageAsync } from '../../redux/reducers/stage/thunks'import { useEffect, useRef } from 'react'
import { decrementAttemptsLeft } from '../../redux/reducers/users/usersSlice'
export function EditStageForm() {
  const dispatch = useDispatch()
  const trips = useSelector((state) => state.trips.trips)

  const activeTripId = useSelector((state) => state.view.activeTripId)
  const editStageModalIsOpen = useSelector(
    (state) => state.modals.editStageModalIsOpen,
  )

  const activeTripRef = useRef()

  useEffect(() => {
    activeTripRef.current = trips.find((trip) => {
      if (trip) return trip._id === activeTripId
      return false
    })
  }, [trips, activeTripId])

  const handleCloseEditStageModal = () => {
    dispatch(closeEditStageModal())
  }

  const onSubmit = async (updateData) => {
    handleCloseEditStageModal()
    try {
      await dispatch(
        updateStageAsync({
          id: updateData.stage._id,
          updateData: { ...updateData, trip: activeTripRef.current },
        }),
      )
        .unwrap()
        .then(() => dispatch(decrementAttemptsLeft()))
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
