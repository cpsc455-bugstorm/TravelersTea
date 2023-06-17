import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined'
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
import {
  deleteTripAsync,
  editTripAsync,
} from '../../redux/reducers/trip/thunks'
import { closeSidebar, setActiveTripId } from '../../redux/reducers/viewSlice'
import { Button, ConfirmationDialog } from '../common'

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
  const [openDialog, setOpenDialog] = useState(false)
  const inputRef = useRef(null)

  const proceedToDelete = () => {
    setOpenDialog(true)
  }

  const closeDialog = () => {
    setOpenDialog(false)
  }

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

  const handleDeleteTrip = () => {
    closeDialog()
    dispatch(deleteTripAsync({ id: id }))
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
        <div className='flex w-[160px] justify-start space-x-2'>
          <PinDropOutlinedIcon className='align-baseline' />
          {!isRenaming ? (
            <div className='w-[160px] truncate text-start'>{trip.tripName}</div>
          ) : (
            <input
              ref={inputRef}
              className='w-[150px] items-center bg-green-200/40 font-medium'
              placeholder={trip.tripName}
              value={tripName}
              onChange={handleInputChange}
            />
          )}
        </div>
      </Button>
      <div
        id={`extra-buttons-for-${id}`}
        className={`absolute right-0 top-[9px] flex w-[68px] flex-row text-white`}
      >
        {!isRenaming ? (
          <>
            <Button
              key={`sidebar-trip-button-${id}-rename`}
              onClick={() => {
                setIsRenaming(true)
              }}
              className={`${isSelected} h-[22px] w-[22px] hover:text-red-400`}
              padding='p-0'
            >
              <EditOutlinedIcon
                sx={{ fontSize: 22 }}
                className='align-baseline'
              />
            </Button>
            <Button
              key={`sidebar-trip-button-${id}-edit`}
              onClick={() => {
                dispatch(closeSidebar())
                dispatch(openEditTripModal())
              }}
              className={`${isSelected} h-[22px] w-[22px] hover:text-red-400`}
              padding='p-0'
            >
              <SettingsOutlinedIcon
                sx={{ fontSize: 22 }}
                className='align-baseline'
              />
            </Button>
            <Button
              key={`sidebar-trip-button-${id}-delete`}
              onClick={proceedToDelete}
              className={`${isSelected} h-[22px] w-[22px] hover:text-red-400`}
              padding='p-0'
            >
              <DeleteForeverOutlinedIcon
                sx={{ fontSize: 22 }}
                className='align-baseline'
              />
            </Button>

            <ConfirmationDialog
              open={openDialog}
              handleClose={closeDialog}
              handleConfirm={handleDeleteTrip}
              title='Confirm Deletion'
              description='Are you sure you want to delete this trip?'
            />
          </>
        ) : (
          <>
            <span
              key={`sidebar-trip-button-${id}-padding`}
              className='h-[22px] w-[22px]'
            />
            <Button
              key={`sidebar-trip-button-${id}-confirm-rename`}
              onClick={handleCheckClick}
              className={`${isSelected} h-[22px] w-[22px] hover:text-red-400`}
              padding='p-0'
            >
              <CheckIcon sx={{ fontSize: 22 }} className='align-baseline' />
            </Button>
            <Button
              key={`sidebar-trip-button-${id}-abort-rename`}
              onClick={handleCancelClick}
              className={`${isSelected} h-[22px] w-[22px] hover:text-red-400`}
              padding='p-0'
            >
              <CloseIcon sx={{ fontSize: 22 }} className='align-baseline' />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
