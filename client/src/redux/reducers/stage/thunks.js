import { createAsyncThunk } from '@reduxjs/toolkit'
import { actionTypes } from './actionTypes'
import stageService from './service'

export const fetchStage = createAsyncThunk(
  actionTypes.GET_STAGE,
  async (id, { rejectWithValue }) => {
    try {
      const response = await stageService.fetchStage(id)
      return response.data
    } catch (error) {
      return rejectWithValue({
        message: error.response.data.error || error.response.data,
      })
    }
  },
)

// returns an array of days, where each day is an array of stages.
export const fetchStagesByTripIdAsync = createAsyncThunk(
  actionTypes.GET_STAGES_BY_TRIP_ID,
  async (tripId, { rejectWithValue }) => {
    try {
      const response = await stageService.fetchStagesByTripId(tripId)
      return response.data
    } catch (error) {
      return rejectWithValue({
        message: error.response.data.error || error.response.data,
      })
    }
  },
)

export const updateStageAsync = createAsyncThunk(
  actionTypes.UPDATE_STAGE,
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await stageService.updateStage(id, updateData)
      return response.data
    } catch (error) {
      return rejectWithValue({
        message: error.response.data.error || error.response.data,
      })
    }
  },
)
