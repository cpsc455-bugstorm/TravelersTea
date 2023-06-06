import { createSlice } from '@reduxjs/toolkit'

import {
  VANCOUVER_LONGITUDE,
  VANCOUVER_LATITUDE,
  ZOOM_GLOBE_LEVEL,
} from '../../constants/mapDefaultInfo'

const mapSlice = createSlice({
  name: 'map',
  initialState: {
    currentCoordinatesAndZoom: {
      long: VANCOUVER_LONGITUDE,
      lat: VANCOUVER_LATITUDE,
      zoom: ZOOM_GLOBE_LEVEL,
    },
  },
  reducers: {
    changeCoordinatesAndZoom: (state, action) => {
      state.currentCoordinatesAndZoom = action.payload
    },
  },
})

export const { changeCoordinatesAndZoom } = mapSlice.actions

export default mapSlice.reducer
