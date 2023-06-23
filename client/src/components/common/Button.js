import PropTypes from 'prop-types'

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
}

const defaultStyles =
  'items-center rounded-md border-0 p-2 transition-all pointer-events-auto'

export function Button({ children, onClick, className = '' }) {
  const combinedStyles = `${defaultStyles} ${className}`

  return (
    <button className={combinedStyles} onClick={onClick}>
      {children}
    </button>
  )
}
