import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DEFAULT_SPEED, ZOOM_CITY_LEVEL } from '../../constants/mapDefaultInfo'
import { changeCoordinatesAndZoom } from '../../redux/reducers/mapSlice'
import { closeEditTripModal } from '../../redux/reducers/modalsSlice'
import { updateTripAsync } from '../../redux/reducers/trips/thunks'
import { Modal } from '../common'
import { CompressedForm } from './CompressedForm'
import { TripForm } from './TripForm'

export function EditTripForm() {
  const dispatch = useDispatch()
  const [compressed, setCompressed] = useState(false)

  const trips = useSelector((state) => state.trips.trips)

  const activeTripId = useSelector((state) => state.view.activeTripId)

  const activeTripRef = useRef()

  useEffect(() => {
    activeTripRef.current = trips.find((trip) => {
      if (trip) return trip._id === activeTripId
      return false
    })
  }, [trips, activeTripId])

  const editTripModalIsOpen = useSelector(
    (state) => state.modals.editTripModalIsOpen,
  )

  const handleCloseEditTripModal = () => {
    dispatch(closeEditTripModal())
  }

  const onSubmit = async (data) => {
    handleCloseEditTripModal()
    const tripMetadata = compressed
      ? {
          colloquialPrompt: data.colloquialPrompt,
        }
      : {
          ...data,
        }
    try {
      const updatedTrip = await dispatch(
        updateTripAsync({
          id: activeTripId,
          tripData: tripMetadata,
        }),
      ).unwrap()
      dispatch(
        changeCoordinatesAndZoom({
          longitude: updatedTrip.tripLongitude,
          latitude: updatedTrip.tripLatitude,
          zoom: ZOOM_CITY_LEVEL,
          speed: DEFAULT_SPEED,
        }),
      )
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Modal
      open={editTripModalIsOpen}
      handleClose={handleCloseEditTripModal}
      title={
        !compressed && (
          <>
            Adjusting Trip
            <span className='dot-1'>.</span>
            <span className='dot-2'>.</span>
            <span className='dot-3'>.</span>
          </>
        )
      }
      isCompressed={compressed}
    >
      <div
        className='absolute -right-2 top-0 mr-4 cursor-pointer rounded-lg font-mono'
        onClick={() => setCompressed(!compressed)}
      >
        {compressed ? (
          <>
            <span className='relative'>Form</span>
            <ExpandLessIcon fontSize='large' className='w-3' />
          </>
        ) : (
          <>
            <span className='relative'>Speak Your Mind 🧠</span>
            <ExpandMoreIcon fontSize='large' className='w-3' />
          </>
        )}
      </div>
      {compressed ? (
        <CompressedForm onSubmit={onSubmit} />
      ) : (
        <TripForm onSubmit={onSubmit} initialValues={activeTripRef.current} />
      )}
    </Modal>
  )
}
