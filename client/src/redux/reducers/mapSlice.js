import { createSlice } from '@reduxjs/toolkit'

import {
  VANCOUVER_LONGITUDE,
  VANCOUVER_LATITUDE,
  ZOOM_GLOBE_LEVEL,
} from '../../constants/mapDefaultInfo'

const mapSlice = createSlice({
  name: 'map',
  initialState: {
    currentLocationAndZoom: {
      long: VANCOUVER_LONGITUDE,
      lat: VANCOUVER_LATITUDE,
      zoom: ZOOM_GLOBE_LEVEL,
    },
  },
  reducers: {
    changeLocationAndZoom: (state, action) => {
      state.currentLocationAndZoom = action.payload
    },
  },
})

export const { changeLocationAndZoom } = mapSlice.actions

export default mapSlice.reducer
