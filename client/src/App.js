import { useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppInterface } from './AppInterface'
import { AuthScreen } from './components/user/AuthScreen'
import { ShareInterface } from './ShareInterface'

function App() {
  const user = useSelector((state) => state.users.user)

  return (
    <Routes>
      <Route path='/' element={<AuthScreen />} />
      <Route
        path='/home'
        element={user ? <AppInterface /> : <Navigate to='/' />}
      />
      <Route path='/share/:id' element={<ShareInterface />} />
    </Routes>
  )
}

export default App
