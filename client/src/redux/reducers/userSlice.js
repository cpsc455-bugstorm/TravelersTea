import { createSlice } from '@reduxjs/toolkit'

// currently, trips have mock datas, TODO: remove mock data
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    trips: [
      {
        id: 1,
        tripName: 'My First Trip',
        destination: 'mock',
        stagesPerDay: 2,
        budget: 1,
        numberOfDays: 4,
      },
      {
        id: 2,
        tripName: 'Another Trip',
        destination: 'mock',
        stagesPerDay: 2,
        budget: 1,
        numberOfDays: 7,
      },
      {
        id: 3,
        tripName: 'A Third Trip',
        destination: 'mock',
        stagesPerDay: 2,
        budget: 1,
        numberOfDays: 10,
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
      const maxId = Math.max(...state.trips.map((trip) => trip.id), 0)
      const newTrip = {
        ...action.payload,
        id: maxId + 1,
        tripName: `Your Trip ${maxId + 1}`,
      }
      state.trips.push(newTrip)
    },
    editTrip: (state, action) => {
      const tripIndex = state.trips.findIndex(
        (trip) => trip.id === action.payload.id,
      )
      if (tripIndex !== -1) {
        state.trips[tripIndex] = action.payload
      }
    },
  },
})

export const { login, logout, addTrip, editTrip } = userSlice.actions
export const selectUser = (state) => state.user.user
export const selectTrips = (state) => state.user.trips
export default userSlice.reducer
