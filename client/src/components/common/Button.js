import PropTypes from 'prop-types'

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
}

export function Button({ children, onClick, className = '' }) {
  return (
    <button
      className={`w-full items-center rounded-md border-0 bg-slate-300/40 p-2 hover:bg-slate-400/40 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
