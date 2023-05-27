import { configureStore } from '@reduxjs/toolkit'
import sidebarReducer from './reducers/sidebarSlice'
import viewReducer from './reducers/viewSlice'

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    view: viewReducer,
  },
})
