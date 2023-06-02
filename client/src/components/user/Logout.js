import { Button } from '../common'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectUser } from '../../redux/reducers/userSlice'
export function Logout() {
  const user = useSelector(selectUser)
  const dispatch = useDispatch()
  const handleLogout = (e) => {
    e.preventDefault()
    dispatch(logout())
  }

  return (
    <div>
      <Button
        className='fixed bottom-2 bg-red-500 bg-opacity-80 text-white hover:bg-red-300'
        onClick={(e) => handleLogout(e)}
      >
        Logout{user ? ` ${user.username}` : ''}
      </Button>
    </div>
  )
}
