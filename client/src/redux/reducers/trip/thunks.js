import { createAsyncThunk } from '@reduxjs/toolkit'
import { actionTypes } from './actionTypes'
import tripService from './service'

export const fetchTripsAsync = createAsyncThunk(
  actionTypes.GET_TRIP,
  async () => {
    const response = await tripService.fetchTrips()
    return response.data
  },
)

export const createTripAsync = createAsyncThunk(
  actionTypes.ADD_TRIP,
  async (tripData) => {
    const response = await tripService.createTrip(tripData)
    return response.data
  },
)

export const editTripAsync = createAsyncThunk(
  actionTypes.EDIT_TRIP,
  async ({ id, tripData }) => {
    const response = await tripService.editTrip(id, tripData)
    return response.data
  },
)
