import TravelExploreIcon from '@mui/icons-material/TravelExplore'
import { InputAdornment, TextField } from '@mui/material'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { SLOWER_SPEED, ZOOM_GLOBE_LEVEL } from '../../constants/mapDefaultInfo'
import { changeSpeed, changeZoom } from '../../redux/reducers/mapSlice'
import { Button } from '../common'
import { setActiveDayNumber } from '../../redux/reducers/viewSlice'

CompressedForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export function CompressedForm({ onSubmit }) {
  const dispatch = useDispatch()

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
    <div className='flex w-full flex-row'>
      <form
        onSubmit={handleSubmit(onSubmitForm)}
        className='flex w-full flex-col space-y-4 text-center'
      >
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <TravelExploreIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position='end'>
                <Button
                  padding='p-1'
                  className='w-full rounded bg-slate-300 hover:bg-slate-400'
                  type='submit'
                  onClick={() => {}}
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
  )
}
