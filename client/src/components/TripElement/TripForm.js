import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone'
import LockClockTwoToneIcon from '@mui/icons-material/LockClockTwoTone'
import { InputAdornment, TextField, Tooltip } from '@mui/material'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { SLOWER_SPEED, ZOOM_GLOBE_LEVEL } from '../../constants/mapDefaultInfo'
import { changeSpeed, changeZoom } from '../../redux/reducers/mapSlice'
import { setActiveDayNumber } from '../../redux/reducers/viewSlice'
import { Button } from '../common'

TripForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
}

export function TripForm({ onSubmit, initialValues = {} }) {
  const dispatch = useDispatch()
  const efLimit = useSelector((state) => state.users.efAttemptLeft)
  const lastEnteredNote = localStorage.getItem('lastEnteredNote')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...initialValues,
      tripNotes: lastEnteredNote || initialValues.tripNotes,
    },
  })

  const onSubmitForm = (data) => {
    localStorage.setItem('lastEnteredNote', data.tripNotes)
    dispatch(changeZoom(ZOOM_GLOBE_LEVEL))
    dispatch(changeSpeed(SLOWER_SPEED))
    dispatch(setActiveDayNumber(-1))
    onSubmit(data)
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
        label='Places per Day'
        placeholder='Tell me how many places you want to visit...'
        type='number'
        inputProps={{ min: 0 }}
        error={!!errors.stagesPerDay}
      />
      <TextField
        {...register('budget', { required: true, min: 0 })}
        label='Budget per Day ($)'
        placeholder='Tell me how much you want to spend...'
        type='number'
        inputProps={{ min: 0 }}
        error={!!errors.budget}
      />
      <TextField
        {...register('numberOfDays', { required: true, min: 0 })}
        label='Number of Days'
        placeholder='Tell me how long you are going for...'
        type='number'
        inputProps={{ min: 0 }}
        error={!!errors.numberOfDays}
      />
      <Tooltip
        title='You have ran out of this feature for the day, this will not be applied to your next trip'
        placement='bottom-start'
        arrow
        followCursor
        disableFocusListener
        disableHoverListener={efLimit >= 1}
        disableTouchListener
      >
        <TextField
          className={`w-full ${
            efLimit <= 0 ? 'bg-gray-200 text-gray-400 placeholder-gray-400' : ''
          }`}
          disabled={efLimit <= 0}
          {...register('tripNotes', { required: false })}
          label='Extra Notes'
          placeholder='Tell me what you would like...'
          InputProps={{
            startAdornment:
              efLimit <= 0 ? (
                <InputAdornment position='start'>
                  <LockClockTwoToneIcon />
                </InputAdornment>
              ) : (
                <Tooltip
                  title='You have one use of Extra Notes or Speak Your Mind per day'
                  placement='bottom-start'
                  arrow
                >
                  <InputAdornment position='start'>
                    <InfoTwoToneIcon />
                  </InputAdornment>
                </Tooltip>
              ),
          }}
        />
      </Tooltip>

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
