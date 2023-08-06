import PropTypes from 'prop-types'
import LocalCafeIcon from '@mui/icons-material/LocalCafe'
import { useSelector } from 'react-redux'

const Mug = ({ filled, halfFilled, lessFilled, color }) => (
  <span>
    <LocalCafeIcon
      className={`h-6 w-6 ${color} ${
        filled
          ? ''
          : halfFilled
          ? 'opacity-50'
          : lessFilled
          ? 'opacity-20'
          : 'opacity-30'
      }`}
    />
  </span>
)

Mug.propTypes = {
  filled: PropTypes.bool.isRequired,
  halfFilled: PropTypes.bool,
  lessFilled: PropTypes.bool,
  color: PropTypes.string.isRequired,
}

const MugRating = ({ rating }) => {
  const isLightMode = useSelector((state) => state.preferences.lightMode)

  if (rating === 0 || rating === undefined) {
    return null
  }
  return (
    <div>
      <span className='m-2 text-xs'>{rating}</span>
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = rating >= index + 1
        const halfFilled = rating >= index + 0.5 && rating < index + 1
        const lessFilled = rating >= index && rating < index + 0.5
        return (
          <Mug
            key={index}
            filled={filled}
            halfFilled={halfFilled}
            lessFilled={lessFilled}
            color={isLightMode ? 'text-yellow-600' : 'text-yellow-500'}
          />
        )
      })}
    </div>
  )
}

MugRating.propTypes = {
  rating: PropTypes.number,
}

export default MugRating
