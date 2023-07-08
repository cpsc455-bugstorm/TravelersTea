import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../../redux/reducers/users/usersSlice'
import { Button } from '../common'

export function Logout() {
  const user = useSelector((state) => state.users.user)
  const dispatch = useDispatch()
  const handleLogout = (e) => {
    e.preventDefault()
    dispatch(logoutUser())
  }

  return (
    <Button
      className='w-full bg-red-500/80 text-white hover:bg-red-300/80'
      onClick={(e) => handleLogout(e)}
    >
      Logout{user ? ` ${user.username}` : ''}
    </Button>
  )
}
