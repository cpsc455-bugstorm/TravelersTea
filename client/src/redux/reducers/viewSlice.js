import { createSlice } from '@reduxjs/toolkit'
import { AppView } from '../../constants/enums'

const viewSlice = createSlice({
  name: 'view',
  initialState: {
    appView: AppView.NEW_TRIP,
    activeTripId: undefined,
  },
  reducers: {
    // payload: AppView (e.g. AppView.NEW_TRIP)
    setAppView: (state, action) => {
      state.appView = action.payload
    },
    // payload: number (the id of the active trip)
    setActiveTripId: (state, action) => {
      state.activeTripId = action.payload
    },
  },
})

export const { setAppView, setActiveTripId } = viewSlice.actions

export default viewSlice.reducer
