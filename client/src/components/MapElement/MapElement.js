import { TextField } from '@mui/material'
import PropTypes from 'prop-types'
import { useMemo, useState } from 'react'
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

  const [destination, setDestination] = useState('')
  const [stagesPerDay, setStagesPerDay] = useState('')
  const [budget, setBudget] = useState('')
  const [numberOfDays, setNumberOfDays] = useState('')
  const [invalidForm, setInvalidForm] = useState(false)

  const resetForm = () => {
    setDestination('')
    setStagesPerDay('')
    setBudget('')
    setNumberOfDays('')
    setInvalidForm(false)
  }
  const handleCloseNewTripModal = () => {
    dispatch(setAppView(AppView.TRIP_VIEW))
    resetForm()
  }
  const handleSubmitNewTripForm = () => {
    if (destination && stagesPerDay && budget && numberOfDays) {
      // api call with form data
      console.log(destination, stagesPerDay, budget, numberOfDays)
      handleCloseNewTripModal()
    } else {
      setInvalidForm(true)
    }
  }

  const newTripForm = useMemo(() => {
    return (
      <Modal
        open={appView === AppView.NEW_TRIP}
        handleClose={handleCloseNewTripModal}
        title='Manifesting A New Trip...'
        footer={
          <Button
            className='font-bolder mt-4 w-full bg-slate-300 hover:bg-slate-400'
            onClick={handleSubmitNewTripForm}
            type='submit'
          >
            Brew 🍵
          </Button>
        }
      >
        <TextField
          label='Destination'
          placeholder='Tell me where you want to go...'
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
          error={invalidForm && !destination}
          required
        />
        <TextField
          label='Stages per day'
          placeholder='Tell me how many places you want to visit..'
          type='number'
          value={stagesPerDay}
          onChange={(event) => setStagesPerDay(event.target.value)}
          error={invalidForm && !stagesPerDay}
          required
        />
        <TextField
          label='Budget'
          placeholder='Tell me how much you want to spend...'
          value={budget}
          onChange={(event) => setBudget(event.target.value)}
          error={invalidForm && !budget}
          required
        />
        <TextField
          label='Number of days'
          placeholder='Tell me how long you are going for...'
          type='number'
          value={numberOfDays}
          onChange={(event) => setNumberOfDays(event.target.value)}
          error={invalidForm && !numberOfDays}
          required
        />
      </Modal>
    )
  }, [appView, destination, stagesPerDay, budget, numberOfDays, invalidForm])

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
