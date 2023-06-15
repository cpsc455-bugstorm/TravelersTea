import { createSlice } from '@reduxjs/toolkit'
import { handleAsyncAction } from '../../handleAsync'
import { REQUEST_STATE } from '../../states'
import { fetchTripsAsync, createTripAsync, editTripAsync } from './thunks'
/**
 * @property {trips}: [{
 *  _id: uuid, - Unique identifier for the trip
 *  tripName: string, - Name of the trip, auto-generated
 *  destination: string, - Destination of the trip (user input)
 *  stagesPerDay: number, - Number of stages or activities planned per day (user input)
 *  budget: number, - Total budget for the trip (user input)
 *  numberOfDays: number - Total number of days for the trip (user input)
 *  destinationLongitude: number - longitude (generated from BE)
 *  destinationLatitude: number - latitude (generated from BE)
 * }]
 */
export const tripSlice = createSlice({
  name: 'trip',
  initialState: {
    trips: [],
    status: REQUEST_STATE.IDLE,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    handleAsyncAction(builder, fetchTripsAsync, {
      fulfilled: (state, action) => {
        state.trips = action.payload
      },
    })
    handleAsyncAction(builder, createTripAsync, {
      fulfilled: (state, action) => {
        state.trips.push(action.payload)
      },
    })
    handleAsyncAction(builder, editTripAsync, {
      fulfilled: (state, action) => {
        const tripIndex = state.trips.findIndex(
          (trip) => trip._id === action.payload._id,
        )
        if (tripIndex !== -1) {
          state.trips[tripIndex] = {
            ...state.trips[tripIndex],
            ...action.payload,
          }
        }
      },
    })
  },
})

export default tripSlice.reducer
