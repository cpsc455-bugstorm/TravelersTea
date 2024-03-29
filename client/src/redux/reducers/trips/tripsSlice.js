import { createSlice } from '@reduxjs/toolkit'
import { handleAsyncAction } from '../../handleAsync'
import { REQUEST_STATE } from '../../states'
import {
  createTripAsync,
  deleteTripAsync,
  enableShareTripAsync,
  fetchSharedTripByTripIdAsync,
  fetchTripsAsync,
  updateTripAsync,
} from './thunks'

/**
 * @property {trips}: [{
 *  tripName: string, - Name of the trip, auto-generated
 *  tripLocation: string, - Destination of the trip (user input)
 *  stagesPerDay: number, - Number of stages or activities planned per day (user input)
 *  budget: number, - Total budget for the trip (user input)
 *  numberOfDays: number - Total number of days for the trip (user input)
 *  tripLongitude: number - longitude (generated from BE)
 *  tripLatitude: number - latitude (generated from BE)
 * }]
 */
const initialStateTrips = {
  trips: [],
  status: REQUEST_STATE.IDLE,
  error: null,
}
export const tripsSlice = createSlice({
  name: 'trips',
  initialState: initialStateTrips,
  reducers: {
    resetTrips: () => initialStateTrips,
    clearTripsError: (state) => {
      state.error = null
    },
    flagAsFulfilled: (state) => {
      state.status = REQUEST_STATE.FULFILLED
    },
  },
  extraReducers: (builder) => {
    handleAsyncAction(builder, fetchTripsAsync, {
      pending: (state) => {
        state.status = REQUEST_STATE.READING
      },
      fulfilled: (state, action) => {
        state.trips = action.payload
        state.status = REQUEST_STATE.FULFILLED
      },
    })
    handleAsyncAction(builder, fetchSharedTripByTripIdAsync, {
      pending: (state) => {
        state.status = REQUEST_STATE.READING
      },
      fulfilled: (state, action) => {
        state.trips = action.payload
        state.status = REQUEST_STATE.FULFILLED
      },
    })
    handleAsyncAction(builder, createTripAsync, {
      pending: (state) => {
        state.status = REQUEST_STATE.WRITING
      },
      fulfilled: (state, action) => {
        state.trips.push(action.payload)
        state.status = REQUEST_STATE.FULFILLED
      },
    })
    handleAsyncAction(builder, updateTripAsync, {
      pending: (state) => {
        state.status = REQUEST_STATE.WRITING
      },
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
        state.status = REQUEST_STATE.UPDATED
      },
    })
    handleAsyncAction(builder, enableShareTripAsync, {
      pending: (state) => {
        state.status = REQUEST_STATE.WRITING
      },
      fulfilled: (state) => {
        state.status = REQUEST_STATE.FULFILLED
      },
    })
    handleAsyncAction(builder, deleteTripAsync, {
      pending: (state) => {
        state.status = REQUEST_STATE.WRITING
      },
      fulfilled: (state, action) => {
        state.trips = state.trips.filter(
          (trip) => trip._id !== action.payload._id,
        )
        state.status = REQUEST_STATE.FULFILLED
      },
    })
  },
})

export const { resetTrips, clearTripsError, flagAsFulfilled } =
  tripsSlice.actions

export default tripsSlice.reducer
