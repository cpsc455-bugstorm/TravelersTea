import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone'
import LockClockTwoToneIcon from '@mui/icons-material/LockClockTwoTone'
import { InputAdornment, TextField, Tooltip } from '@mui/material'
import PropTypes from 'prop-types'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { SLOWER_SPEED, ZOOM_GLOBE_LEVEL } from '../../constants/mapDefaultInfo'
import { changeSpeed, changeZoom } from '../../redux/reducers/mapSlice'
import { setActiveDayNumber } from '../../redux/reducers/viewSlice'
import { getBlackWhite } from '../../util/lightMode'
import { Button, Modal } from '../common'

TripForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
}

export function TripForm({ onSubmit, initialValues = {} }) {
  const dispatch = useDispatch()
  const efLimit = useSelector((state) => state.users.efAttemptLeft)
  const lastEnteredNote = localStorage.getItem('lastEnteredNote')
  const [openModal, setOpenModal] = useState(false)
  const isLightMode = useSelector((state) => state.preferences.lightMode)
  const closeModal = () => {
    setOpenModal(false)
  }
  const textColor = useMemo(
    () => getBlackWhite(isLightMode, 'text', 'white'),
    [isLightMode],
  )
  const handleOpenModal = () => {
    setOpenModal(true)
  }
  const handleConfirmSubmit = () => {
    handleSubmit(onSubmitForm)()
    closeModal()
  }

  const {
    register,
    handleSubmit,
    getValues,
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
    onSubmit(efLimit <= 0 ? { ...data, tripNotes: '' } : data)
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(() => {})}
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
                <Tooltip
                  title='You have ran out of this feature for the day, this will not be applied to your next trip'
                  placement='bottom-start'
                  arrow
                >
                  <InputAdornment position='start'>
                    <LockClockTwoToneIcon />
                  </InputAdornment>
                </Tooltip>
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
        <Button
          className='mt-4 w-full rounded bg-slate-300 hover:bg-slate-400'
          type='button'
          onClick={() => {
            const formValues = getValues()
            const hasTripNotes =
              formValues.tripNotes && formValues.tripNotes.trim() !== ''

            if (efLimit <= 0 || !hasTripNotes) {
              handleSubmit(onSubmitForm)()
            } else {
              handleOpenModal()
            }
          }}
        >
          Brew 🍵
        </Button>
      </form>
      <Modal
        open={openModal}
        handleClose={closeModal}
        footer={
          <>
            <Button
              onClick={closeModal}
              className={`bg-slate-800/60 hover:bg-slate-600/60 ${textColor}`}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              className={`bg-red-800/90 hover:bg-red-600/90 ${textColor}`}
            >
              Confirm
            </Button>
          </>
        }
        title={'Confirmation'}
        titleSize='text-3xl'
        modalSize='sm'
        classNameContent={'mx-20'}
      >
        <p>
          One of the Extra Notes or Speak Your Mind feature can be used once a
          day.
          <br /> Do you want to submit?
        </p>
      </Modal>
    </>
  )
}
