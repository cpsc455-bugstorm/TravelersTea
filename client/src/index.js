import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import { SessionController } from './SessionController'
import './index.css'
import { store } from './redux/store'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <SessionController>
        <Router>
          <App />
        </Router>
      </SessionController>
    </Provider>
  </React.StrictMode>,
)
