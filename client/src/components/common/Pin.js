import RoomIcon from '@mui/icons-material/Room'
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { getHexCode } from '../../util/tailwindColors'

const PIN_WIDTH_PX = 128

Pin.propTypes = {
  colorNumber: PropTypes.number.isRequired,
  emoji: PropTypes.string.isRequired,
  titleText: PropTypes.string,
  bodyText: PropTypes.string,
}

export function Pin({ colorNumber, emoji, titleText, bodyText }) {
  const hexColor = useMemo(() => getHexCode(colorNumber), [colorNumber])

  return (
    <div>
      <p className='text-lg font-bold'>{titleText}</p>
      <p className='w-64 text-base font-normal'>{bodyText}</p>
      <div
        className={`relative h-32 w-32 cursor-pointer transition hover:drop-shadow-[0_10px_6px_rgba(0,0,0,0.25)]`}
      >
        <RoomIcon
          className='absolute -bottom-3 left-0'
          sx={{ color: hexColor, fontSize: PIN_WIDTH_PX }}
        />
        <span className='absolute left-0 top-8 w-full cursor-pointer text-center text-5xl'>
          {emoji}
        </span>
      </div>
    </div>
  )
}
