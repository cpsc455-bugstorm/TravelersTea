import { configureStore } from '@reduxjs/toolkit'
import viewReducer from './reducers/viewSlice'

export const store = configureStore({
  reducer: {
    view: viewReducer,
  },
})
