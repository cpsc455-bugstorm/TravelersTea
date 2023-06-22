import LocalCafeTwoTone from '@mui/icons-material/LocalCafeTwoTone'
import PropTypes from 'prop-types'
import { getHexCode } from '../../utils/translateTailwindColors'
import { useCallback, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  setActiveDayNumber,
  setAppView,
  setContentFullscreen,
} from '../../redux/reducers/viewSlice'
import { AppView } from '../../constants/enums'
import { Popover } from '@mui/material'

const PIN_WIDTH_PX = 128

TeaCup.propTypes = {
  tailwindBgColor: PropTypes.string.isRequired,
  displayNumber: PropTypes.number.isRequired,
  titleText: PropTypes.string,
  locationNames: PropTypes.arrayOf(PropTypes.string),
}

export function TeaCup({
  tailwindBgColor,
  displayNumber,
  titleText,
  locationNames,
}) {
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null)
  const hexColor = useMemo(() => getHexCode(tailwindBgColor), [tailwindBgColor])

  const locationNameList = useMemo(() => {
    return (
      <ul className='box-border list-disc overflow-y-auto pl-6'>
        {locationNames.map((name, key) => (
          <li
            className='w-48 text-base font-normal'
            key={`day-${displayNumber}-bullet-${key}`}
          >
            {name}
          </li>
        ))}
      </ul>
    )
  }, [displayNumber, locationNames])

  const openDayView = useCallback(() => {
    dispatch(setActiveDayNumber(displayNumber))
    dispatch(setAppView(AppView.DAY_VIEW))
    dispatch(setContentFullscreen(true))
  }, [dispatch, displayNumber])

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <div
      className='flex h-full w-48 flex-col justify-between px-2'
      onClick={openDayView}
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
    >
      <div
        className={`relative h-32 w-32 cursor-pointer transition hover:drop-shadow-[0_5px_6px_rgba(0,0,0,0.25)]`}
      >
        <LocalCafeTwoTone
          className='absolute -bottom-4 left-0'
          sx={{ color: hexColor, fontSize: PIN_WIDTH_PX }}
        />
        <span className='absolute left-0 top-10 w-[90%] cursor-pointer text-center text-5xl font-bold text-slate-300'>
          {displayNumber}
        </span>
      </div>
      <Popover
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          pointerEvents: 'none',
          zIndex: '50',
        }}
        PaperProps={{
          sx: { backgroundColor: 'transparent', backgroundImage: 'none' },
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <div className='overflow-hidden rounded-md bg-slate-300/90 p-2'>
          <p className='text-lg font-bold'>{titleText}</p>
          {locationNameList}
        </div>
      </Popover>
    </div>
  )
}
