import { createSlice } from '@reduxjs/toolkit'
import { AppView } from '../../constants/enums'

// payload: AppView (e.g. AppView.NEW_TRIP)
const _setAppView = (state, action) => {
  state.appView = action.payload
  state.fullscreenContent = false
}

// payload: number (the id of the active trip). ** This is 1-indexed **
const _setActiveTripId = (state, action) => {
  state.activeTripId = action.payload
  _setAppView(state, { payload: AppView.TRIP_VIEW })
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

const _setContentFullscreen = (state) => {
  state.fullscreenContent = true
}

const _setContentNonFullscreen = (state) => {
  state.fullscreenContent = false
}

const _toggleContentFullscreen = (state) => {
  state.fullscreenContent = !state.fullscreenContent
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
    setContentFullscreen: _setContentFullscreen,
    setContentNonFullscreen: _setContentNonFullscreen,
    toggleContentFullscreen: _toggleContentFullscreen,
  },
})

export const {
  setAppView,
  setActiveTripId,
  toggleSidebar,
  closeSidebar,
  openSidebar,
  setContentFullscreen,
  setContentNonFullscreen,
  toggleContentFullscreen,
} = viewSlice.actions

export default viewSlice.reducer
