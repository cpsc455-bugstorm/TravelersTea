import PropTypes from 'prop-types'

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
}

export function Button({ children, onClick, className = '' }) {
  return (
    <button
      className={`pointer-events-auto items-center rounded-md border-0 p-2 transition-colors ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
