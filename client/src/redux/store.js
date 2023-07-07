import { configureStore } from '@reduxjs/toolkit'
import mapReducer from './reducers/mapSlice'
import modalsReducer from './reducers/modalsSlice'
import preferencesReducer from './reducers/preferencesSlice'
import tripsReducer from './reducers/trips/tripsSlice'
import usersReducer from './reducers/users/usersSlice'
import viewReducer from './reducers/viewSlice'

export const store = configureStore({
  reducer: {
    view: viewReducer,
    preferences: preferencesReducer,
    modals: modalsReducer,
    map: mapReducer,
    trips: tripsReducer,
    users: usersReducer,
  },
})
