import PropTypes from 'prop-types'
import LocalCafeIcon from '@mui/icons-material/LocalCafe'

const Mug = ({ filled, halfFilled, lessFilled }) => (
  <span>
    <LocalCafeIcon
      className={`h-6 w-6 text-yellow-500 ${
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
}

const MugRating = ({ rating }) => {
  if (rating === 0) {
    return null
  }
  return (
    <div>
      <span className='m-2 text-xs'>{rating}/5</span>
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
          />
        )
      })}
    </div>
  )
}

MugRating.propTypes = {
  rating: PropTypes.number.isRequired,
}

export default MugRating
