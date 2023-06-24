import PropTypes from 'prop-types'

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  padding: PropTypes.string,
}

const defaultStyles =
  'items-center rounded-md border-0 transition-all pointer-events-auto'

export function Button({ children, onClick, className = '', padding = 'p-2' }) {
  const combinedStyles = `${defaultStyles} ${padding} ${className}`

  return (
    <button className={combinedStyles} onClick={onClick}>
      {children}
    </button>
  )
}
