import { useSelector } from 'react-redux'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import { LoginScreen } from './components/user'
import { AppInterface } from './AppInterface'
import { selectUser } from './redux/reducers/userSlice'

function App() {
  const user = useSelector(selectUser)

  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={user ? <Navigate to='/home' /> : <LoginScreen />}
        />
        <Route
          path='/home'
          element={user ? <AppInterface /> : <Navigate to='/' />}
        />
      </Routes>
    </Router>
  )
}

export default App
