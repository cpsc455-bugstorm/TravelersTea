import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppView } from '../../constants/enums'
import { ZOOM_CITY_LEVEL } from '../../constants/mapDefaultInfo'
import {
  changeCoordinatesAndZoom,
  clearAllMarkersAndAdd_Store,
} from '../../redux/reducers/mapSlice'
import { openEditTripModal } from '../../redux/reducers/modalsSlice'
import { editTripAsync } from '../../redux/reducers/trip/thunks'
import { closeSidebar, setActiveTripId } from '../../redux/reducers/viewSlice'
import { Button } from '../common'

TripEntry.propTypes = {
  id: PropTypes.string.isRequired,
  buttonClassName: PropTypes.string,
  trip: PropTypes.object,
}

export function TripEntry({ id, buttonClassName, trip }) {
  const dispatch = useDispatch()
  const activeTripId = useSelector((state) => state.view.activeTripId)
  const appView = useSelector((state) => state.view.appView)
  const isSelected =
    activeTripId === id && appView !== AppView.NEW_TRIP ? '' : 'hidden'
  const [isRenaming, setIsRenaming] = useState(false)
  const [tripName, setTripName] = useState(trip.tripName)

  const inputRef = useRef(null)

  const handleInputChange = (event) => {
    setTripName(event.target.value)
  }

  const handleCheckClick = () => {
    dispatch(editTripAsync({ id: id, tripData: { tripName: tripName } }))
    setIsRenaming(false)
  }

  const handleCancelClick = () => {
    setTripName(trip.tripName)
    setIsRenaming(false)
  }

  useEffect(() => {
    if (isSelected === 'hidden') {
      setIsRenaming(false)
      setTripName(trip.tripName)
    }
  }, [isSelected, trip, appView])

  return (
    <div className='group relative'>
      <Button
        key={`sidebar-trip-entry-${id}`}
        onClick={() => {
          dispatch(setActiveTripId(id))
          // TODO: remove after connected to backend, it is here to prevent error
          if (
            !isNaN(trip.destinationLongitude) &&
            !isNaN(trip.destinationLatitude)
          ) {
            dispatch(
              changeCoordinatesAndZoom({
                longitude: trip.destinationLongitude,
                latitude: trip.destinationLatitude,
                zoom: ZOOM_CITY_LEVEL,
              }),
            )
            dispatch(
              clearAllMarkersAndAdd_Store([
                {
                  longitude: trip.destinationLongitude,
                  latitude: trip.destinationLatitude,
                },
              ]),
            )
          } else {
            console.log(`no coordinate yet`)
          }
        }}
        className={buttonClassName}
      >
        {!isRenaming ? (
          trip.tripName
        ) : (
          <input
            ref={inputRef}
            className='items-center bg-green-200/40 font-medium'
            placeholder={trip.tripName}
            value={tripName}
            onChange={handleInputChange}
          />
        )}
      </Button>
      <div className='absolute right-0 top-0 flex flex-row'>
        {!isRenaming ? (
          <>
            <Button
              key={`sidebar-trip-button-${id}-rename`}
              onClick={() => {
                setIsRenaming(true)
              }}
              className={`${isSelected} px-0 hover:text-red-400`}
            >
              <EditOutlinedIcon className='align-baseline' />
            </Button>
            <Button
              key={`sidebar-trip-button-${id}-edit`}
              onClick={() => {
                dispatch(closeSidebar())
                dispatch(openEditTripModal())
              }}
              className={`${isSelected} hover:text-red-400`}
            >
              <SettingsOutlinedIcon className='align-baseline' />
            </Button>
          </>
        ) : (
          <>
            <Button
              key={`sidebar-trip-button-${id}-confirm-rename`}
              onClick={handleCheckClick}
              className={`${isSelected} px-0 hover:text-red-400`}
            >
              <CheckIcon className='align-baseline' />
            </Button>

            <Button
              key={`sidebar-trip-button-${id}-abort-rename`}
              onClick={handleCancelClick}
              className={`${isSelected} hover:text-red-400`}
            >
              <CloseIcon className='align-baseline' />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
