import PropTypes from 'prop-types'
import LocalCafeIcon from '@mui/icons-material/LocalCafe'

const Mug = ({ filled }) => (
  <span>
    <LocalCafeIcon
      className={`h-6 w-6 text-yellow-500 ${filled ? '' : 'opacity-30'}`}
    />
  </span>
)

Mug.propTypes = {
  filled: PropTypes.bool.isRequired,
}

const MugRating = ({ rating }) => (
  <div>
    <span className='text-xs'>{rating.toFixed(1)}</span>
    {Array.from({ length: 5 }).map((_, index) => {
      const filled = rating >= index + 1
      const halfFilled = rating >= index + 0.5
      return <Mug key={index} filled={filled} halfFilled={halfFilled} />
    })}
  </div>
)

MugRating.propTypes = {
  rating: PropTypes.number.isRequired,
}

export default MugRating
