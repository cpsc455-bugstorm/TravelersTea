import PropTypes from 'prop-types'

/**
 * Generic button for Traveler's Tea
 *
 * @param children - elements to go into button
 * @param onClick - what to do when clicked
 * @param className? - tailwind classnames to be added to the element
 * @return {JSX.Element}
 */
Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
}

export function Button({ children, onClick, className = '' }) {
  return (
    <button className={`rounded-md border-0 ${className}`} onClick={onClick}>
      {children}
    </button>
  )
}
