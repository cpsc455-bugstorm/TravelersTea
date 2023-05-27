import { createSlice } from '@reduxjs/toolkit'
import { AppView } from '../../constants/enums'

const viewSlice = createSlice({
  name: 'view',
  initialState: {
    isSidebarOpen: false,
    appView: AppView.NEW_TRIP,
    activeTripId: undefined,
  },
  reducers: {
    // payload: AppView (e.g. AppView.NEW_TRIP)
    setAppView: (state, action) => {
      state.appView = action.payload
      state.isSidebarOpen = false
    },
    // payload: number (the id of the active trip)
    setActiveTripId: (state, action) => {
      state.activeTripId = action.payload
      state.appView = AppView.TRIP_OVERVIEW
      state.isSidebarOpen = false
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen
    },
    openSidebar: (state) => {
      state.isSidebarOpen = true
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false
    },
  },
})

export const {
  setAppView,
  setActiveTripId,
  toggleSidebar,
  closeSidebar,
  openSidebar,
} = viewSlice.actions

export default viewSlice.reducer
