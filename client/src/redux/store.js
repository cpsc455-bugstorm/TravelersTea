import { configureStore } from '@reduxjs/toolkit'
import modalsReducer from './reducers/modalsSlice'
import preferencesReducer from './reducers/preferencesSlice'
import userReducer from './reducers/userSlice'
import viewReducer from './reducers/viewSlice'
import mapReducer from './reducers/mapSlice'

export const store = configureStore({
  reducer: {
    view: viewReducer,
    user: userReducer,
    preferences: preferencesReducer,
    modals: modalsReducer,
    map: mapReducer,
  },
})
