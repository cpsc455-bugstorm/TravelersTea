import { createAsyncThunk } from '@reduxjs/toolkit'
import { actionTypes } from './actionTypes'
import tripService from './service'

export const fetchTripsAsync = createAsyncThunk(
  actionTypes.GET_TRIP,
  async (_, { rejectWithValue }) => {
    try {
      const response = await tripService.fetchTrips()
      return response.data
    } catch (error) {
      return rejectWithValue({ message: error.response.data.error })
    }
  },
)

export const createTripAsync = createAsyncThunk(
  actionTypes.ADD_TRIP,
  async (tripData, { rejectWithValue }) => {
    try {
      const response = await tripService.createTrip(tripData)
      return response.data
    } catch (error) {
      return rejectWithValue({ message: error.response.data.error })
    }
  },
)

export const editTripAsync = createAsyncThunk(
  actionTypes.EDIT_TRIP,
  async ({ id, tripData }, { rejectWithValue }) => {
    try {
      const response = await tripService.editTrip(id, tripData)
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
