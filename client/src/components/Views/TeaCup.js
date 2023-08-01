import LocalCafeTwoTone from '@mui/icons-material/LocalCafeTwoTone'
import PropTypes from 'prop-types'
import { getHexCode } from '../../util/tailwindColors'
import { useCallback, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  setActiveDayNumber,
  setShowSidePanel,
} from '../../redux/reducers/viewSlice'
import { Popover } from '@mui/material'

const PIN_WIDTH_PX = 128

TeaCup.propTypes = {
  colorNumber: PropTypes.number.isRequired,
  displayNumber: PropTypes.number.isRequired,
  titleText: PropTypes.string,
  stageLocations: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
}

export function TeaCup({
  colorNumber,
  displayNumber,
  titleText,
  stageLocations,
  className,
}) {
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null)
  const hexColor = useMemo(() => getHexCode(colorNumber), [colorNumber])
  const shouldHavePopover = titleText || stageLocations

  const stageLocationList = useMemo(() => {
    if (!stageLocations) return <></>
    return (
      <ul className='box-border list-disc overflow-y-auto pl-6'>
        {stageLocations.map((name, key) => (
          <li
            className='w-48 text-base font-normal'
            key={`day-${displayNumber}-bullet-${key}`}
          >
            {name}
          </li>
        ))}
      </ul>
    )
  }, [displayNumber, stageLocations])

  const handleTeacupClicked = useCallback(() => {
    dispatch(setActiveDayNumber(displayNumber))
    dispatch(setShowSidePanel(true))
  }, [dispatch, displayNumber])

  const handlePopoverOpen = (event) => {
    if (shouldHavePopover) setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(shouldHavePopover && anchorEl)

  return (
    <div
      className={'w-60 min-w-[14rem] px-2 ' + className}
      onClick={handleTeacupClicked}
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
    >
      <div
        className={`relative h-32 w-32 transition hover:scale-[101%] hover:drop-shadow-[0_5px_6px_rgba(0,0,0,0.25)]
        ${shouldHavePopover ? 'cursor-pointer' : ''}`}
      >
        <LocalCafeTwoTone
          className='absolute -bottom-4 left-0'
          sx={{ color: hexColor, fontSize: PIN_WIDTH_PX }}
        />
        <span className='absolute left-0 top-10 w-[90%] cursor-pointer text-center text-5xl font-bold text-slate-300'>
          {displayNumber}
        </span>
      </div>
      {shouldHavePopover && (
        <Popover
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          sx={{
            pointerEvents: 'none',
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
          <div className='pointer-events-none hidden overflow-hidden rounded-md bg-slate-300/90 p-2 md:block'>
            <p className='text-lg font-bold'>{titleText}</p>
            {stageLocationList}
          </div>
        </Popover>
      )}
    </div>
  )
}
