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
      imgSrc: 'https://pngimg.com/d/google_maps_pin_PNG56.png',
      label: 'Marker Icon',
      zoom: ZOOM_GLOBE_LEVEL,
    },
    markers: [],
  },
  reducers: {
    changeCoordinatesAndZoom: (state, action) => {
      state.currentCoordinatesAndZoom = action.payload
    },
    /**
     * @property {payload (markersWithProps)}: [{ - an array of props with the following structure:
     *       longitude: number, - The longitude coordinate of the marker
     *       latitude: number, - The latitude coordinate of the marker
     *       imgSrc: string, - The image source URL for the marker icon
     *       label: string, - The label or name for the marker
     *       zoom: number, - The zoom level at which the marker should be displayed
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
