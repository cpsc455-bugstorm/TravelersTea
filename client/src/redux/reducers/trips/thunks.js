import { createAsyncThunk } from '@reduxjs/toolkit'
import { actionTypes } from './actionTypes'
import tripService from './service'

export const fetchTripsAsync = createAsyncThunk(
  actionTypes.GET_TRIPS,
  async (userId, { rejectWithValue }) => {
    try {
      const response = await tripService.fetchTrips(userId)
      return response.data
    } catch (error) {
      return rejectWithValue({ message: error.response.data.error })
    }
  },
)

export const createTripAsync = createAsyncThunk(
  actionTypes.CREATE_TRIP,
  async (tripData, { rejectWithValue }) => {
    try {
      const response = await tripService.createTrip(tripData)
      return response.data
    } catch (error) {
      return rejectWithValue({ message: error.response.data.error })
    }
  },
)

export const updateTripAsync = createAsyncThunk(
  actionTypes.UPDATE_TRIP,
  async ({ id, tripData }, { rejectWithValue }) => {
    try {
      const response = await tripService.updateTrip(id, tripData)
      return response.data
    } catch (error) {
      return rejectWithValue({ message: error.response.data.error })
    }
  },
)

export const deleteTripAsync = createAsyncThunk(
  actionTypes.DELETE_TRIP,
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await tripService.deleteTrip(id)
      return response.data
    } catch (error) {
      return rejectWithValue({ message: error.response.data.error })
    }
  },
)
