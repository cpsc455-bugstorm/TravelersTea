import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppView } from '../../constants/enums'
import { DEFAULT_SPEED, ZOOM_CITY_LEVEL } from '../../constants/mapDefaultInfo'
import { changeCoordinatesAndZoom } from '../../redux/reducers/mapSlice'
import { closeNewTripModal } from '../../redux/reducers/modalsSlice'
import { createTripAsync } from '../../redux/reducers/trips/thunks'
import { decrementAttemptsLeft } from '../../redux/reducers/users/usersSlice'
import { setActiveTripId, setAppView } from '../../redux/reducers/viewSlice'
import { Modal } from '../common'
import { CompressedForm } from './CompressedForm'
import { TripForm } from './TripForm'
import { fetchStagesByTripIdAsync } from '../../redux/reducers/stage/thunks'

export function NewTripForm() {
  const dispatch = useDispatch()
  const [compressed, setCompressed] = useState(false)

  const appView = useSelector((state) => state.view.appView)

  const newTripModalIsOpen = useSelector(
    (state) => state.modals.newTripModalIsOpen,
  )

  const handleCloseNewTripModal = () => {
    dispatch(closeNewTripModal())
  }

  const onSubmit = async (data) => {
    handleCloseNewTripModal()
    const tripMetadata = compressed
      ? {
          colloquialPrompt: data.colloquialPrompt,
        }
      : {
          ...data,
          tripName: 'Trip to ' + data.tripLocation,
        }
    try {
      const newTrip = await dispatch(createTripAsync(tripMetadata)).unwrap()
      dispatch(
        changeCoordinatesAndZoom({
          longitude: newTrip.tripLongitude,
          latitude: newTrip.tripLatitude,
          zoom: ZOOM_CITY_LEVEL,
          speed: DEFAULT_SPEED,
        }),
      )
      dispatch(setAppView(AppView.TRIP_VIEW))
      dispatch(setActiveTripId(newTrip._id))
      dispatch(fetchStagesByTripIdAsync(newTrip._id))
      dispatch(decrementAttemptsLeft())
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Modal
      open={appView === AppView.NEW_TRIP && newTripModalIsOpen}
      handleClose={handleCloseNewTripModal}
      title={
        !compressed && (
          <>
            Manifesting A New Trip
            <span className='dot-1'>.</span>
            <span className='dot-2'>.</span>
            <span className='dot-3'>.</span>
          </>
        )
      }
      isCompressed={compressed}
    >
      {compressed ? (
        <ExpandLessIcon
          fontSize='large'
          onClick={() => setCompressed(!compressed)}
          className='absolute -right-2 top-0 mr-4 w-3 cursor-pointer rounded-lg'
        />
      ) : (
        <ExpandMoreIcon
          fontSize='large'
          onClick={() => setCompressed(!compressed)}
          className='absolute -right-2 top-0 mr-4 w-3 cursor-pointer rounded-lg'
        />
      )}
      {compressed ? (
        <CompressedForm onSubmit={onSubmit} />
      ) : (
        <TripForm onSubmit={onSubmit} />
      )}
    </Modal>
  )
}
