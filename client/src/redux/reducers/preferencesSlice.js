import { createSlice } from '@reduxjs/toolkit'
import { shouldUseLightMode } from '../../util/lightMode'

const preferenceSlice = createSlice({
  name: 'preferences',
  initialState: {
    compactView: localStorage.getItem('isCompactView') === 'true',
    lightMode: shouldUseLightMode(),
  },
  reducers: {
    toggleCompactView: (state) => {
      state.compactView = !state.compactView
      localStorage.setItem('isCompactView', state.compactView.toString())
    },
    toggleLightMode: (state) => {
      state.lightMode = !state.lightMode
      localStorage.setItem('isLightMode', state.lightMode.toString())
    },
    setLightMode: (state, action) => {
      state.lightMode = action.payload
      localStorage.setItem('isLightMode', state.lightMode.toString())
    },
    resetPreferences: (state) => {
      state.compactView = false
      state.lightMode = false
    },
  },
})

export const {
  toggleCompactView,
  toggleLightMode,
  setLightMode,
  resetPreferences,
} = preferenceSlice.actions

export default preferenceSlice.reducer
