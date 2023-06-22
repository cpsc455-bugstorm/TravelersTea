import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  updateTripAsync,
} from '../../redux/reducers/trip/thunks'
import { closeSidebar, setActiveTripId } from '../../redux/reducers/viewSlice'
import { Button, Modal } from '../common'

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
  const [openModal, setOpenModal] = useState(false)
  const inputRef = useRef(null)

  const widthForTripEntry = !isSelected ? 'w-[160px]' : 'w-[228px]'
  const widthForButtonsContainer = isRenaming ? 'w-[46px]' : 'w-[68px]'

  const proceedToDelete = () => {
    setOpenModal(true)
  }

  const closeModal = () => {
    setOpenModal(false)
  }

  const handleInputChange = useCallback(
    (event) => {
      setTripName(event.target.value)
    },
    [setTripName],
  )

  const handleCheckClick = () => {
    dispatch(updateTripAsync({ id: id, tripData: { tripName: tripName } }))
    setIsRenaming(false)
  }

  const handleCancelClick = () => {
    setTripName(trip.tripName)
    setIsRenaming(false)
  }

  const handleDeleteTrip = () => {
    closeModal()
    dispatch(deleteTripAsync({ id: id }))
  }

  useEffect(() => {
    if (isSelected === 'hidden') {
      setIsRenaming(false)
      setTripName(trip.tripName)
    }
  }, [isSelected, trip, appView])

  const tripButton = useMemo(
    () => (
      <Button
        key={`sidebar-trip-entry-${id}`}
        onClick={() => {
          dispatch(setActiveTripId(id))
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
        }}
        className={buttonClassName}
      >
        <div className={`flex ${widthForTripEntry} justify-start space-x-2`}>
          <PinDropOutlinedIcon className='align-baseline' />
          {!isRenaming ? (
            <div className={`${widthForTripEntry} truncate text-start`}>
              {trip.tripName}
            </div>
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
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      dispatch,
      id,
      trip,
      buttonClassName,
      isRenaming,
      tripName,
      handleInputChange,
    ],
  )

  const extraButtons = useMemo(
    () => (
      <div
        id={`extra-buttons-for-${id}`}
        className={`absolute right-0 top-[9px] flex ${widthForButtonsContainer} flex-row text-white`}
      >
        {!isRenaming ? (
          <>
            <Button
              key={`sidebar-trip-button-${id}-rename`}
              onClick={() => {
                setIsRenaming(true)
              }}
              className={`${isSelected} h-[22px] w-[20px] hover:text-red-400`}
              padding='p-0 mr-[3px]'
            >
              <EditOutlinedIcon
                sx={{ fontSize: 20 }}
                className='align-baseline'
              />
            </Button>
            <Button
              key={`sidebar-trip-button-${id}-edit`}
              onClick={() => {
                dispatch(closeSidebar())
                dispatch(openEditTripModal())
              }}
              className={`${isSelected} h-[22px] w-[20px] hover:text-red-400`}
              padding='p-0 mr-[3px]'
            >
              <SettingsOutlinedIcon
                sx={{ fontSize: 20 }}
                className='align-baseline'
              />
            </Button>
            <Button
              key={`sidebar-trip-button-${id}-delete`}
              onClick={proceedToDelete}
              className={`${isSelected} h-[22px] w-[20px] hover:text-red-400`}
              padding='p-0 mr-[3px]'
            >
              <DeleteForeverOutlinedIcon
                sx={{ fontSize: 20 }}
                className='align-baseline'
              />
            </Button>

            <Modal
              open={openModal}
              handleClose={closeModal}
              footer={
                <>
                  <Button
                    onClick={closeModal}
                    className='bg-slate-800/60 text-white hover:bg-slate-600/60'
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteTrip}
                    className='bg-red-800/90 text-white hover:bg-red-600/90'
                  >
                    Confirm
                  </Button>
                </>
              }
            >
              <p>
                Are you sure you want to delete <b>{trip.tripName}</b>?
              </p>
            </Modal>
          </>
        ) : (
          <>
            <Button
              key={`sidebar-trip-button-${id}-confirm-rename`}
              onClick={handleCheckClick}
              className={`${isSelected} h-[22px] w-[20px] hover:text-red-400`}
              padding='p-0 mr-[3px]'
            >
              <CheckIcon sx={{ fontSize: 20 }} className='align-baseline' />
            </Button>
            <Button
              key={`sidebar-trip-button-${id}-abort-rename`}
              onClick={handleCancelClick}
              className={`${isSelected} h-[22px] w-[20px] hover:text-red-400`}
              padding='p-0 mr-[3px]'
            >
              <CloseIcon sx={{ fontSize: 20 }} className='align-baseline' />
            </Button>
          </>
        )}
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isSelected,
      isRenaming,
      handleCheckClick,
      handleCancelClick,
      proceedToDelete,
      openModal,
      closeModal,
      handleDeleteTrip,
    ],
  )

  return (
    <div className='group relative'>
      {tripButton}
      {extraButtons}
    </div>
  )
}
