import PropTypes from 'prop-types'
import { useMemo } from 'react'

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool,
  className: PropTypes.string,
}

export function Button({ children, onClick, active, className = '' }) {
  const activeStyling = useMemo(() => {
    return active
      ? 'bg-green-300/40 font-medium hover:bg-green-400/40'
      : 'bg-slate-300 hover:bg-slate-400'
  }, [active])

  return (
    <button
      className={`items-center rounded-md border-0 p-2 transition-colors ${activeStyling} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
