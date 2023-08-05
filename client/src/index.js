import { SnackbarProvider } from 'notistack'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { SessionController } from './SessionController'
import './index.css'
import { store } from './redux/store'
import { ShareInterface } from './ShareInterface'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Routes>
            <Route path='/share/:id' element={<ShareInterface />} />
            <Route path='/*' element={<SessionController />} />
          </Routes>
        </SnackbarProvider>
      </Router>
    </Provider>
  </React.StrictMode>,
)
