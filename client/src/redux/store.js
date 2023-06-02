import { configureStore } from '@reduxjs/toolkit'
import viewReducer from './reducers/viewSlice'
import userReducer from './reducers/userSlice'
import preferencesReducer from './reducers/preferencesSlice'

export const store = configureStore({
  reducer: {
    view: viewReducer,
    user: userReducer,
    preferences: preferencesReducer,
  },
})
