import PropTypes from 'prop-types'
import { useCallback } from 'react'
import LocalCafeIcon from '@mui/icons-material/LocalCafe'

const MugRating = ({ rating }) => {
  const generateMug = useCallback((rating, index) => {
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
            <stop offset={fillLevel} stopColor='rgba(245,158,11,0.3)' />
            <stop offset={1} stopColor='rgba(245,158,11,0.3)' />
          </linearGradient>
          <filter id='shadow'>
            <feDropShadow dx='0' dy='2' stdDeviation='2' />
          </filter>
        </svg>
        <LocalCafeIcon
          className={`h-6 w-6`}
          sx={{
            fill: `url(#linearColors-${rating}-${index})`,
            filter: 'url(#shadow)',
          }}
        />
      </span>
    )
  }, [])

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
