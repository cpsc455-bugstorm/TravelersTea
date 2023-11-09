import LockClockTwoToneIcon from '@mui/icons-material/LockClockTwoTone'
import TravelExploreIcon from '@mui/icons-material/TravelExplore'
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

CompressedForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export function CompressedForm({ onSubmit }) {
  const dispatch = useDispatch()
  const efLimit = useSelector((state) => state.users.efAttemptLeft)
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
    formState: { errors },
  } = useForm()

  const onSubmitForm = (data) => {
    dispatch(changeZoom(ZOOM_GLOBE_LEVEL))
    dispatch(changeSpeed(SLOWER_SPEED))
    dispatch(setActiveDayNumber(-1))
    onSubmit(data)
  }

  return (
    <>
      <div className='flex w-full flex-row'>
        <form
          onSubmit={handleSubmit(() => {})}
          className='flex w-full flex-col space-y-4 text-center'
        >
          <TextField
            disabled={efLimit <= 0}
            className={`w-full ${
              efLimit <= 0
                ? 'bg-gray-200 text-gray-400 placeholder-gray-400'
                : ''
            }`}
            InputProps={{
              startAdornment:
                efLimit <= 0 ? (
                  <Tooltip
                    title='You have ran out of this feature for the day'
                    placement='bottom-start'
                    arrow
                  >
                    <InputAdornment position='start'>
                      <LockClockTwoToneIcon />
                    </InputAdornment>
                  </Tooltip>
                ) : (
                  <Tooltip
                    title='Make any requests once per day'
                    placement='bottom-start'
                    arrow
                  >
                    <InputAdornment position='start'>
                      <TravelExploreIcon />
                    </InputAdornment>
                  </Tooltip>
                ),
              endAdornment: efLimit > 0 && (
                <InputAdornment position='end'>
                  <Button
                    padding='p-1'
                    className='w-full rounded bg-slate-300 hover:bg-slate-400'
                    type='button'
                    onClick={handleOpenModal}
                  >
                    Brew 🍵
                  </Button>
                </InputAdornment>
              ),
            }}
            {...register('colloquialPrompt', { required: true })}
            placeholder='Tell me your plan...'
            error={!!errors.colloquialPrompt}
          />
        </form>
      </div>
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
