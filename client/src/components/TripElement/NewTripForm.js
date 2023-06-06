import { TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { AppView } from '../../constants/enums'
import { closeNewTripModal } from '../../redux/reducers/modalsSlice'
import { setAppView } from '../../redux/reducers/viewSlice'
import { Button, Modal } from '../common'

export function NewTripForm() {
  const appView = useSelector((state) => state.view.appView)
  const newTripModalIsOpen = useSelector(
    (state) => state.modals.newTripModalIsOpen,
  )
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const handleCloseNewTripModal = () => {
    dispatch(closeNewTripModal())
    reset()
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
      footer={
        <Button
          className='mt-4 w-full rounded bg-slate-300 hover:bg-slate-400'
          onClick={handleSubmit(onSubmit)}
          type='submit'
        >
          Brew 🍵
        </Button>
      }
    >
      <TextField
        {...register('destination', { required: true })}
        label='Destination'
        placeholder='Tell me where you want to go...'
        error={!!errors.destination}
      />
      <TextField
        {...register('stagesPerDay', { required: true })}
        label='Stages per day'
        placeholder='Tell me how many places you want to visit..'
        type='number'
        error={!!errors.stagesPerDay}
      />
      <TextField
        {...register('budget', { required: true })}
        label='Budget'
        placeholder='Tell me how much you want to spend...'
        error={!!errors.budget}
      />
      <TextField
        {...register('numberOfDays', { required: true })}
        label='Number of days'
        placeholder='Tell me how long you are going for...'
        type='number'
        error={!!errors.numberOfDays}
      />
    </Modal>
  )
}
