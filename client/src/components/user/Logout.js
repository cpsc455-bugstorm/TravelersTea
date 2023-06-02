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
    <Button
      className='w-full bg-red-500/80 text-white hover:bg-red-300/80'
      onClick={(e) => handleLogout(e)}
    >
      Logout{user ? ` ${user.username}` : ''}
    </Button>
  )
}
