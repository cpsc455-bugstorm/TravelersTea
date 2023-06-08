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
    addMarker: (state, action) => {
      state.markers.push(action.payload)
    },
    deleteMarker: (state, action) => {
      const updatedMarkers = [...state.markers]
      updatedMarkers.slice(action.payload, 1) // should be an index
      state.markers = updatedMarkers
    },
    clearMarkers: (state) => {
      state.markers = []
    },
    clearAllMarkersAndAdd_Store: (state, action) => {
      const newCoordinates = action.payload // can be array of coordinates
      state.markers = newCoordinates
    },
  },
})

export const { changeCoordinatesAndZoom, clearAllMarkersAndAdd_Store } =
  mapSlice.actions

export default mapSlice.reducer
