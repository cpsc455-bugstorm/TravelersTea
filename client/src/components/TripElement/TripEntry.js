import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { openEditTripModal } from '../../redux/reducers/modalsSlice'
import { setActiveTripId, closeSidebar } from '../../redux/reducers/viewSlice'
import { Button } from '../common'

TripEntry.propTypes = {
  id: PropTypes.number.isRequired,
  buttonClassName: PropTypes.string,
  buttonContent: PropTypes.node,
}

export function TripEntry({ id, buttonClassName, buttonContent }) {
  const dispatch = useDispatch()
  const activeTripId = useSelector((state) => state.view.activeTripId)
  const isSelected = activeTripId === id ? '' : 'hidden'

  return (
    <div className='group'>
      <Button
        key={`sidebar-trip-button-${id}`}
        onClick={() => dispatch(setActiveTripId(id))}
        className={buttonClassName}
      >
        {buttonContent}
      </Button>
      <Button
        key={`sidebar-trip-button-${id}-edit`}
        onClick={() => {
          dispatch(closeSidebar())
          dispatch(openEditTripModal())
        }}
        className={`${isSelected} absolute right-0 hover:text-red-400`}
      >
        <EditOutlinedIcon />
      </Button>
    </div>
  )
}
