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
import { DEFAULT_SPEED, ZOOM_CITY_LEVEL } from '../../constants/mapDefaultInfo'
import copy from 'copy-to-clipboard'
import {
  changeCoordinatesAndZoom,
  resetMap,
} from '../../redux/reducers/mapSlice'
import { openEditTripModal } from '../../redux/reducers/modalsSlice'
import {
  deleteTripAsync,
  enableShareTripAsync,
  updateTripAsync,
} from '../../redux/reducers/trips/thunks'
import {
  closeSidebar,
  resetView,
  setActiveTripId,
} from '../../redux/reducers/viewSlice'
import { AlertSnackbar, Button, Modal } from '../common'
import { resetStages } from '../../redux/reducers/stage/stageSlice'
import IosShareSharpIcon from '@mui/icons-material/IosShareSharp'
import { getBlackWhite } from '../../util/lightMode'

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
  const isLightMode = useSelector((state) => state.preferences.lightMode)
  const inputRef = useRef()

  const widthForTripEntry = !isSelected ? 'w-[140px]' : 'w-[228px]'
  const widthForButtonsContainer = isRenaming ? 'w-[46px]' : 'w-[92px]'

  const textColor = useMemo(
    () => getBlackWhite(isLightMode, 'text', 'white'),
    [isLightMode],
  )

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
    dispatch(setActiveTripId(undefined))
    dispatch(resetView())
    dispatch(resetMap())
    dispatch(resetStages())
  }

  useEffect(() => {
    if (isSelected === 'hidden') {
      setIsRenaming(false)
      setTripName(trip.tripName)
    }
  }, [isSelected, trip, appView])

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isRenaming, inputRef])

  const tripButton = useMemo(
    () => (
      <Button
        key={`sidebar-trip-entry-${id}`}
        onClick={() => {
          dispatch(setActiveTripId(id))
          dispatch(
            changeCoordinatesAndZoom({
              longitude: trip.tripLongitude,
              latitude: trip.tripLatitude,
              zoom: ZOOM_CITY_LEVEL,
              speed: DEFAULT_SPEED,
            }),
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
              onFocus={(event) => event.target.select()}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleCheckClick()
                }
              }}
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

  const copyShareLinkToClipboard = async (id) => {
    try {
      await dispatch(enableShareTripAsync({ id: id })).unwrap()
      let currentUrl = window.location.href // full current URL
      let baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/')) // trim off '/home' or anything after the last '/'
      const sharedUrl = baseUrl + '/share/' + id
      copy(sharedUrl)
      setAlertMessage('Copied to Clipboard!')
      setAlertOpen(true)
    } catch (err) {
      console.error('Failed to copy link: ', err)
      setAlertMessage('Failed to copy link, please try again.')
      setAlertOpen(true)
    }
  }

  const extraButtons = useMemo(
    () => (
      <div
        id={`extra-buttons-for-${id}`}
        className={`absolute right-0 top-[9px] flex ${widthForButtonsContainer} flex-row ${textColor}`}
      >
        {!isRenaming ? (
          <>
            <Button
              key={`sidebar-trip-button-${id}-share`}
              onClick={async () => {
                await copyShareLinkToClipboard(id)
              }}
              className={`${isSelected} h-[22px] w-[20px] hover:text-red-400`}
              padding='p-0 mr-[3px]'
            >
              <IosShareSharpIcon
                sx={{ fontSize: 20 }}
                className='align-baseline'
              />
            </Button>
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
                    className={`bg-slate-800/60 hover:bg-slate-600/60 ${textColor}`}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteTrip}
                    className={`bg-red-800/90 hover:bg-red-600/90 ${textColor}`}
                  >
                    Confirm
                  </Button>
                </>
              }
              title={'Confirm Delete'}
              titleSize='text-3xl'
              modalSize='sm'
              classNameContent={'mx-20'}
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
      textColor,
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

  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setAlertOpen(false)
  }

  const alert = useMemo(() => {
    return (
      <AlertSnackbar
        open={alertOpen}
        handleClose={handleCloseAlert}
        message={alertMessage}
        severity={'info'}
      />
    )
  }, [alertMessage, alertOpen])

  return (
    <div className='group relative w-full'>
      {tripButton}
      {extraButtons}
      {alert}
    </div>
  )
}
