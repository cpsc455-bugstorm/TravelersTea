import { createSlice } from '@reduxjs/toolkit'
import { AppView } from '../../constants/enums'

const initialState = {
  activeDayNumber: 1,
  activeTripId: undefined,
  appView: AppView.GLOBE_VIEW,
  isSidebarOpen: false,
  showDrawer: false,
  showSidePanel: false,
}

// payload: AppView (e.g. AppView.NEW_TRIP)
const _setAppView = (state, action) => {
  state.appView = action.payload
  state.showDrawer = false
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

const _showDrawer = (state) => {
  state.showDrawer = true
}

const _hideDrawer = (state) => {
  state.showDrawer = false
}

const _toggleShowDrawer = (state) => {
  state.showDrawer = !state.showDrawer
}

const _setShowSidePanel = (state, action) => {
  state.showSidePanel = action.payload
}

const viewSlice = createSlice({
  name: 'view',
  initialState: initialState,
  reducers: {
    resetView: () => initialState,
    setAppView: _setAppView,
    setActiveTripId: _setActiveTripId,
    toggleSidebar: _toggleSidebar,
    openSidebar: _openSidebar,
    closeSidebar: _closeSidebar,
    showDrawer: _showDrawer,
    hideDrawer: _hideDrawer,
    toggleShowDrawer: _toggleShowDrawer,
    setActiveDayNumber: _setActiveDayNumber,
    setShowSidePanel: _setShowSidePanel,
  },
})

export const {
  resetView,
  setAppView,
  setActiveTripId,
  setActiveDayNumber,
  toggleSidebar,
  closeSidebar,
  openSidebar,
  showDrawer,
  hideDrawer,
  toggleShowDrawer,
  setShowSidePanel,
} = viewSlice.actions

export default viewSlice.reducer
