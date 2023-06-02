import { useSelector } from 'react-redux'
import { LoginScreen } from './components/user'
import { AppInterface } from './AppInterface'
import { selectUser } from './redux/reducers/userSlice'

function App() {
  const user = useSelector(selectUser)

  return <div>{user ? <AppInterface /> : <LoginScreen />}</div>
}

export default App
