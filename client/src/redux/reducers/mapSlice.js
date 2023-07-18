import { createSlice } from '@reduxjs/toolkit'

import {
  DEFAULT_SPEED,
  VANCOUVER_LATITUDE,
  VANCOUVER_LONGITUDE,
  ZOOM_GLOBE_LEVEL,
} from '../../constants/mapDefaultInfo'

const initialMapState = {
  mapData: {
    longitude: VANCOUVER_LONGITUDE,
    latitude: VANCOUVER_LATITUDE,
    zoom: ZOOM_GLOBE_LEVEL,
    speed: DEFAULT_SPEED,
  },
  markers: [],
}

const mapSlice = createSlice({
  name: 'map',
  initialState: initialMapState,
  reducers: {
    changeCoordinatesAndZoom: (state, action) => {
      state.mapData = action.payload
    },
    changeZoom: (state, action) => {
      state.mapData.zoom = action.payload
    },
    changeSpeed: (state, action) => {
      state.mapData.speed = action.payload
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
    resetMap: () => initialMapState,
  },
})

export const {
  changeCoordinatesAndZoom,
  changeZoom,
  changeSpeed,
  clearAllMarkersAndAdd_Store,
  resetMap,
} = mapSlice.actions

export default mapSlice.reducer
