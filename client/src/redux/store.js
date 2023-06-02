import { configureStore } from '@reduxjs/toolkit'
import viewReducer from './reducers/viewSlice'
import userReducer from './reducers/userSlice'

export const store = configureStore({
  reducer: {
    view: viewReducer,
    user: userReducer,
  },
})
