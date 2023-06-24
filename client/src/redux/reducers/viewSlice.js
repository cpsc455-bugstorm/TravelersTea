import { createSlice } from '@reduxjs/toolkit'
import { AppView } from '../../constants/enums'

const initialState = {
  activeDayNumber: 1,
  activeTripId: undefined,
  appView: AppView.NEW_TRIP,
  isSidebarOpen: false,
  fullscreenContent: false,
}

// payload: AppView (e.g. AppView.NEW_TRIP)
const _setAppView = (state, action) => {
  state.appView = action.payload
  state.fullscreenContent = false
}

// payload: number (the id of the active trip).
const _setActiveTripId = (state, action) => {
  state.activeTripId = action.payload
  state.activeDayNumber = 1
  _setAppView(state, { payload: AppView.TRIP_VIEW })
}

// payload: number (the day number we are interested in). ** This is 1-indexed **
const _setActiveDayNumber = (state, action) => {
  state.activeDayNumber = action.payload
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
  initialState: initialState,
  reducers: {
    setAppView: _setAppView,
    setActiveTripId: _setActiveTripId,
    toggleSidebar: _toggleSidebar,
    openSidebar: _openSidebar,
    closeSidebar: _closeSidebar,
    setContentFullscreen: _setContentFullscreen,
    setContentNonFullscreen: _setContentNonFullscreen,
    toggleContentFullscreen: _toggleContentFullscreen,
    setActiveDayNumber: _setActiveDayNumber,
  },
})

export const {
  setAppView,
  setActiveTripId,
  setActiveDayNumber,
  toggleSidebar,
  closeSidebar,
  openSidebar,
  setContentFullscreen,
  setContentNonFullscreen,
  toggleContentFullscreen,
} = viewSlice.actions

export default viewSlice.reducer
