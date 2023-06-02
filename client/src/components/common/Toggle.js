import PropTypes from 'prop-types'

Toggle.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  className: PropTypes.string,
}

export function Toggle({ label, onClick, active, className }) {
  return (
    <div className='flex w-full items-center justify-between'>
      <span>{label}</span>
      <div
        onClick={onClick}
        className={`flex h-8 w-14 cursor-pointer rounded-full p-1 shadow-[inset_0_0px_4px_rgba(200,200,200,0.6)] transition-colors ${className} 
        ${active ? 'justify-end bg-green-300' : 'justify-start bg-slate-300'}`}
      >
        <div className='h-6 w-6 rounded-full bg-white' />
      </div>
    </div>
  )
}
