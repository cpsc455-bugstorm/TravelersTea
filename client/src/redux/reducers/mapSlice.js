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
      longitude: VANCOUVER_LONGITUDE,
      latitude: VANCOUVER_LATITUDE,
      zoom: ZOOM_GLOBE_LEVEL,
    },
    markers: [],
  },
  reducers: {
    changeCoordinatesAndZoom: (state, action) => {
      state.currentCoordinatesAndZoom = action.payload
    },
    clearAllMarkersAndAdd_Store: (state, action) => {
      const markersWithProps = action.payload // should be array of props for markers
      state.markers = markersWithProps
    },
  },
})

export const { changeCoordinatesAndZoom, clearAllMarkersAndAdd_Store } =
  mapSlice.actions

export default mapSlice.reducer
