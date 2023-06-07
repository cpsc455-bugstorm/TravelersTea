import LocalCafeTwoTone from '@mui/icons-material/LocalCafeTwoTone'
import PropTypes from 'prop-types'
import { getHexCode } from '../../utils/translateTailwindColors'
import { useMemo } from 'react'

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

  return (
    <div className='flex h-full flex-col justify-between px-2'>
      <div className='overflow-hidden rounded-md bg-slate-300/70 p-2'>
        <p className='text-lg font-bold'>{titleText}</p>
        {locationNameList}
      </div>
      <div
        className={`relative h-32 w-32 cursor-pointer transition hover:drop-shadow-[0_5px_6px_rgba(0,0,0,0.25)]`}
      >
        <LocalCafeTwoTone
          className='absolute -bottom-4 left-0'
          sx={{ color: hexColor, fontSize: PIN_WIDTH_PX }}
        />
        <span className='absolute left-0 top-10 w-[90%] cursor-pointer text-center text-5xl font-bold'>
          {displayNumber}
        </span>
      </div>
    </div>
  )
}
