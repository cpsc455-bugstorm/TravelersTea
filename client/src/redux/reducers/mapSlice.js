import { createSlice } from '@reduxjs/toolkit'

import {
  VANCOUVER_LATITUDE,
  VANCOUVER_LONGITUDE,
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
    /**
     * @property {payload (markers)}: [{ - an array of props with the following structure:
     *       longitude: number, - The longitude coordinate of the marker
     *       latitude: number, - The latitude coordinate of the marker
     *       emoji: emoji, - The emoji of the marker
     *       label: string, - The label or name for the marker
     *     }]
     */
    clearAllMarkersAndAdd_Store: (state, action) => {
      const markersWithProps = action.payload
      state.markers = markersWithProps
    },
  },
})

export const { changeCoordinatesAndZoom, clearAllMarkersAndAdd_Store } =
  mapSlice.actions

export default mapSlice.reducer
