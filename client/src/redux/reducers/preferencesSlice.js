import { createSlice } from '@reduxjs/toolkit'

const preferenceSlice = createSlice({
  name: 'preferences',
  initialState: {
    compactView: false,
    verticalTimelines: false,
  },
  reducers: {
    toggleCompactView: (state) => {
      state.compactView = !state.compactView
    },
    toggleVerticalTimelines: (state) => {
      state.verticalTimelines = !state.verticalTimelines
    },
  },
})

export const { toggleCompactView, toggleVerticalTimelines } =
  preferenceSlice.actions

export default preferenceSlice.reducer
