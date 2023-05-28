import { createSlice } from '@reduxjs/toolkit'
import { AppView } from '../../constants/enums'

// payload: AppView (e.g. AppView.NEW_TRIP)
const _setAppView = (state, action) => {
  state.appView = action.payload
  state.isSidebarOpen = false
}

// payload: number (the id of the active trip)
const _setActiveTripId = (state, action) => {
  state.activeTripId = action.payload
  _setAppView(state, { payload: AppView.TRIP_OVERVIEW })
}

const _toggleSidebar = (state) => {
  state.isSidebarOpen = !state.isSidebarOpen
}

const _openSidebar = (state) => {
  state.isSidebarOpen = true
}

const _closeSidebar = (state) => {
  state.isSidebarOpen = false
}

const viewSlice = createSlice({
  name: 'view',
  initialState: {
    isSidebarOpen: false,
    appView: AppView.NEW_TRIP,
    activeTripId: undefined,
  },
  reducers: {
    setAppView: _setAppView,
    setActiveTripId: _setActiveTripId,
    toggleSidebar: _toggleSidebar,
    openSidebar: _openSidebar,
    closeSidebar: _closeSidebar,
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
