import { createSlice } from '@reduxjs/toolkit'

const preferenceSlice = createSlice({
  name: 'preferences',
  initialState: {
    compactView: localStorage.getItem('isCompactView') === 'true',
    lightMode: false, // TODO this should be populated by 1st localstorage, 2nd user OS preference
  },
  reducers: {
    toggleCompactView: (state) => {
      state.compactView = !state.compactView
      localStorage.setItem('isCompactView', state.compactView.toString())
    },
    toggleLightMode: (state) => {
      state.lightMode = !state.lightMode
    },
    resetPreferences: (state) => {
      state.compactView = false
      state.lightMode = false
    },
  },
})

export const { toggleCompactView, toggleLightMode, resetPreferences } =
  preferenceSlice.actions

export default preferenceSlice.reducer
