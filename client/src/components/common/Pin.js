import RoomIcon from '@mui/icons-material/Room'
import PropTypes from 'prop-types'

const PIN_WIDTH_PX = 128

Pin.propTypes = {
  emoji: PropTypes.string.isRequired,
  color: PropTypes.string,
  titleText: PropTypes.string,
  bodyText: PropTypes.string,
  className: PropTypes.string,
}

export function Pin({ emoji, color, titleText, bodyText, className }) {
  return (
    <div className={className}>
      <div
        className={`relative h-32 w-32 cursor-pointer transition hover:drop-shadow-[0_10px_6px_rgba(0,0,0,0.25)]`}
      >
        {color && (
          <RoomIcon
            className="absolute -bottom-3 left-0"
            sx={{ color, fontSize: PIN_WIDTH_PX }}
          />
        )}
        <span className="absolute left-0 top-8 w-full cursor-pointer text-center text-5xl">
          {emoji}
        </span>
      </div>
      <p className="text-lg font-bold text-slate-50">{titleText}</p>
      <p className="w-64 text-base font-normal text-slate-50">{bodyText}</p>
    </div>
  )
}
