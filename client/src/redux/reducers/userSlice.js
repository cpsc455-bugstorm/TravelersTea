import { createSlice } from '@reduxjs/toolkit'

/**
 * @property {trips}: [{
 *  id: number, - Unique identifier for the trip, starts from 1 and auto-increments
 *  tripName: string, - Name of the trip, auto-generated
 *  destination: string, - Destination of the trip (user input)
 *  stagesPerDay: number, - Number of stages or activities planned per day (user input)
 *  budget: number, - Total budget for the trip (user input)
 *  numberOfDays: number - Total number of days for the trip (user input)
 *  destinationLongitude: number - longitude (generated from BE)
 *  destinationLatitude: number - latitude (generated from BE)
 * }]
 */
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    currentId: 4, // will start with 1 after removing mock data
    trips: [
      // currently, trips have mock datas, TODO: remove mock data
      {
        id: 1,
        tripName: 'My First Trip',
        destination: 'Toronto',
        stagesPerDay: 2,
        budget: 1,
        numberOfDays: 4,
        destinationLongitude: -79.347015,
        destinationLatitude: 43.6532,
      },
      {
        id: 2,
        tripName: 'Another Trip',
        destination: 'Etobicoke',
        stagesPerDay: 2,
        budget: 1,
        numberOfDays: 7,
        destinationLongitude: -79.5132,
        destinationLatitude: 43.6205,
      },
      {
        id: 3,
        tripName: 'A Third Trip',
        destination: 'Vancouver',
        stagesPerDay: 2,
        budget: 1,
        numberOfDays: 10,
        destinationLongitude: -123.1216,
        destinationLatitude: 49.2827,
      },
    ],
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload
    },
    logout: (state) => {
      state.user = null
      state.trips = []
    },
    addTrip: (state, action) => {
      const newTrip = {
        ...action.payload,
        id: state.currentId,
        tripName: `Your Trip ${state.currentId}`,
      }
      state.trips.push(newTrip)
      state.currentId += 1
    },
    editTrip: (state, action) => {
      const tripIndex = state.trips.findIndex(
        (trip) => trip.id === action.payload.id,
      )
      if (tripIndex !== -1) {
        // Update the trip while preserving existing properties
        state.trips[tripIndex] = {
          ...state.trips[tripIndex],
          ...action.payload,
        }
      }
    },
  },
})

export const { login, logout, addTrip, editTrip } = userSlice.actions
export const selectUser = (state) => state.user.user
export const selectTrips = (state) => state.user.trips
export const selectCurrentId = (state) => state.user.currentId
export default userSlice.reducer
