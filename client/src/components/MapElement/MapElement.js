import { TextField } from '@mui/material'
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { AppView } from '../../constants/enums'
import { setAppView } from '../../redux/reducers/viewSlice'
import { Button, Modal } from '../common'

MapElement.propTypes = {
  className: PropTypes.string,
}

export function MapElement({ className }) {
  const appView = useSelector((state) => state.view.appView)
  const activeTripId = useSelector((state) => state.view.activeTripId)
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const handleCloseNewTripModal = () => {
    dispatch(setAppView(AppView.TRIP_VIEW))
    reset()
  }

  const onSubmit = (data) => {
    // TODO: make api call to create new trip
    console.log(data)
    handleCloseNewTripModal()
  }

  const newTripForm = useMemo(() => {
    return (
      <Modal
        open={appView === AppView.NEW_TRIP}
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
  }, [appView, register, handleSubmit, errors])

  const mapContent = useMemo(() => {
    if (appView === AppView.NEW_TRIP) {
      return newTripForm
    }
    return (
      <span className='mt-4 inline-flex w-full flex-row justify-center'>
        <h1 className='w-fit rounded-md bg-slate-900 bg-opacity-40 p-4 text-5xl'>
          Map (placeholder #{activeTripId})
        </h1>
      </span>
    )
  }, [appView, activeTripId, newTripForm])

  const bgUrl = useMemo(() => {
    if (appView === AppView.NEW_TRIP) return "bg-[url('../public/globe.png')]"
    return "bg-[url('https://assets.website-files.com/5e832e12eb7ca02ee9064d42/5f7db426b676b95755fb2844_Group%20805.jpg')]"
  }, [appView])

  return (
    <div className={`${bgUrl} bg-cover bg-center ${className}`}>
      {mapContent}
    </div>
  )
}
