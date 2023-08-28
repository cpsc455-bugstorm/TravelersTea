import { createAsyncThunk } from '@reduxjs/toolkit'
import { actionTypes } from './actionTypes'
import usersService from './service'

export const fetchLimitLeftAsync = createAsyncThunk(
  actionTypes.FETCH_LIMIT,
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersService.fetchLimit()
      return response.data
    } catch (error) {
      return rejectWithValue({
        message: error.response.data.error || error.response.data,
      })
    }
  },
)

export const fetchEFLimitLeftAsync = createAsyncThunk(
  actionTypes.FETCH_EF_LIMIT,
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersService.fetchEFLimit()
      return response.data
    } catch (error) {
      return rejectWithValue({
        message: error.response.data.error || error.response.data,
      })
    }
  },
)

export const registerUserAsync = createAsyncThunk(
  actionTypes.REGISTER_USER,
  async (userData, { rejectWithValue }) => {
    try {
      const response = await usersService.registerUser(userData)
      localStorage.setItem(
        'travelersTea_accessToken',
        response.data.accessToken,
      )
      return response.data
    } catch (error) {
      return rejectWithValue({
        message: error.response.data.error || error.response.data,
      })
    }
  },
)

export const loginUserAsync = createAsyncThunk(
  actionTypes.LOGIN_USER,
  async (userData, { rejectWithValue }) => {
    try {
      const response = await usersService.loginUser(userData)
      localStorage.setItem(
        'travelersTea_accessToken',
        response.data.accessToken,
      )
      return response.data
    } catch (error) {
      return rejectWithValue({
        message: error.response.data.error || error.response.data,
      })
    }
  },
)
