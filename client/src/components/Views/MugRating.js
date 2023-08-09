import PropTypes from 'prop-types'
import { useCallback } from 'react'
import LocalCafeIcon from '@mui/icons-material/LocalCafe'
import { useSelector } from 'react-redux'

const MugRating = ({ rating }) => {
  const isLightMode = useSelector((state) => state.preferences.lightMode)
  const generateMug = useCallback(
    (rating, index) => {
      const fillLevel = Math.max(0, Math.min(rating - index, 1))
      return (
        <span key={index} className='inline-block'>
          <svg width={0} height={0}>
            <linearGradient
              id={`linearColors-${rating}-${index}`}
              x1={0}
              y1={1}
              x2={1}
              y2={1}
            >
              <stop offset={0} stopColor='rgba(245,158,11,1)' />
              <stop offset={fillLevel} stopColor='rgba(245,158,11,1)' />
              <stop
                offset={fillLevel}
                stopColor={
                  isLightMode ? 'rgba(0,0,0, 0.3)' : 'rgba(245,158,11,0.3)'
                }
              />
              <stop
                offset={1}
                stopColor={
                  isLightMode ? 'rgba(0,0,0, 0.3)' : 'rgba(245,158,11,0.3)'
                }
              />
            </linearGradient>
            {isLightMode && (
              <filter id={`shadow-${rating}-${index}`}>
                <feDropShadow
                  dx='0'
                  dy='0'
                  stdDeviation='4'
                  floodColor='white'
                />
              </filter>
            )}
          </svg>
          <LocalCafeIcon
            className={`h-6 w-6`}
            sx={{
              fill: `url(#linearColors-${rating}-${index})`,
              filter: `url(#shadow-${rating}-${index})`,
            }}
          />
        </span>
      )
    },
    [isLightMode],
  )

  if (!rating) return <></>

  return (
    <div>
      <span className='m-2 text-xs'>{rating}</span>
      {Array.from({ length: 5 }).map((_, index) => {
        return generateMug(rating, index)
      })}
    </div>
  )
}

MugRating.propTypes = {
  rating: PropTypes.number,
}

export default MugRating
