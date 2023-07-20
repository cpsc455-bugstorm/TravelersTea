import { createSlice } from '@reduxjs/toolkit'

const preferenceSlice = createSlice({
  name: 'preferences',
  initialState: {
    compactView: localStorage.getItem('isCompactView') === 'true',
    verticalTimelines: false,
  },
  reducers: {
    toggleCompactView: (state) => {
      state.compactView = !state.compactView
      localStorage.setItem('isCompactView', state.compactView.toString())
    },
    toggleVerticalTimelines: (state) => {
      state.verticalTimelines = !state.verticalTimelines
    },
    resetPreferences: (state) => {
      state.compactView = false
      state.verticalTimelines = false
    },
  },
})

export const { toggleCompactView, toggleVerticalTimelines, resetPreferences } =
  preferenceSlice.actions

export default preferenceSlice.reducer
