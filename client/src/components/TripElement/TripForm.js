import { TextField } from '@mui/material'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { ZOOM_GLOBE_LEVEL } from '../../constants/mapDefaultInfo'
import { changeZoom } from '../../redux/reducers/mapSlice'
import { Button } from '../common'

TripForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
}

export function TripForm({ onSubmit, initialValues }) {
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: initialValues })

  const onSubmitForm = (data) => {
    dispatch(changeZoom(ZOOM_GLOBE_LEVEL))
    onSubmit(data)
    reset()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmitForm)}
      className='flex flex-col space-y-4 text-center'
    >
      <TextField
        {...register('tripLocation', { required: true })}
        label='Destination'
        placeholder='Tell me where you want to go...'
        error={!!errors.tripLocation}
      />
      <TextField
        {...register('stagesPerDay', { required: true, min: 0 })}
        label='Places per day'
        placeholder='Tell me how many places you want to visit..'
        type='number'
        inputProps={{ min: 0 }}
        error={!!errors.stagesPerDay}
      />
      <TextField
        {...register('budget', { required: true, min: 0 })}
        label='Budget per day'
        placeholder='Tell me how much you want to spend...'
        type='number'
        inputProps={{ min: 0 }}
        error={!!errors.budget}
      />
      <TextField
        {...register('numberOfDays', { required: true, min: 0 })}
        label='Number of days'
        placeholder='Tell me how long you are going for...'
        type='number'
        inputProps={{ min: 0 }}
        error={!!errors.numberOfDays}
      />
      <Button
        className='mt-4 w-full rounded bg-slate-300 hover:bg-slate-400'
        type='submit'
        onClick={() => {}}
      >
        Brew 🍵
      </Button>
    </form>
  )
}
