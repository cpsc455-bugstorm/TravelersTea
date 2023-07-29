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
    resetMap: () => initialMapState,
  },
})

export const { changeCoordinatesAndZoom, changeZoom, changeSpeed, resetMap } =
  mapSlice.actions

export default mapSlice.reducer
