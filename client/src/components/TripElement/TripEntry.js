import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppView } from '../../constants/enums'
import { openEditTripModal } from '../../redux/reducers/modalsSlice'
import { editTrip } from '../../redux/reducers/userSlice'
import { closeSidebar, setActiveTripId } from '../../redux/reducers/viewSlice'
import { Button } from '../common'

TripEntry.propTypes = {
  id: PropTypes.number.isRequired,
  buttonClassName: PropTypes.string,
  buttonContent: PropTypes.node,
}

export function TripEntry({ id, buttonClassName, buttonContent }) {
  const dispatch = useDispatch()
  const activeTripId = useSelector((state) => state.view.activeTripId)
  const appView = useSelector((state) => state.view.appView)
  const isSelected =
    activeTripId === id && appView !== AppView.NEW_TRIP ? '' : 'hidden'
  const [isRenaming, setIsRenaming] = useState(false)
  const [tripName, setTripName] = useState(buttonContent)

  const inputRef = useRef(null)

  const handleInputChange = (event) => {
    setTripName(event.target.value)
  }

  const handleCheckClick = () => {
    dispatch(editTrip({ id, tripName }))
    setIsRenaming(false)
  }

  const handleCancelClick = () => {
    setTripName(buttonContent)
    setIsRenaming(false)
  }

  useEffect(() => {
    if (isSelected === 'hidden') {
      setIsRenaming(false)
      setTripName(buttonContent)
    }
  }, [isSelected, buttonContent, appView])

  return (
    <div className='group relative'>
      <Button
        key={`sidebar-trip-button-${id}`}
        onClick={() => dispatch(setActiveTripId(id))}
        className={buttonClassName}
      >
        {!isRenaming ? (
          buttonContent
        ) : (
          <input
            ref={inputRef}
            className='items-center bg-green-200/40 font-medium'
            placeholder={buttonContent}
            value={tripName}
            onChange={handleInputChange}
          />
        )}
      </Button>
      <div className='absolute right-0 top-0 flex flex-row'>
        {!isRenaming ? (
          <>
            <Button
              key={`sidebar-trip-button-${id}-edit`}
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
              key={`sidebar-trip-button-${id}-edit`}
              onClick={handleCheckClick}
              className={`${isSelected} px-0 hover:text-red-400`}
            >
              <CheckIcon className='align-baseline' />
            </Button>

            <Button
              key={`sidebar-trip-button-${id}-edit`}
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
