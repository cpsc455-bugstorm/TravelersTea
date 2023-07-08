import { createAsyncThunk } from '@reduxjs/toolkit'
import { actionTypes } from './actionTypes'
import usersService from './service'

export const registerUserAsync = createAsyncThunk(
  actionTypes.REGISTER_USER,
  async (userData, { rejectWithValue }) => {
    try {
      const response = await usersService.registerUser(userData)
      return response.data
    } catch (error) {
      return rejectWithValue({ message: error.response.data.error })
    }
  },
)

export const loginUserAsync = createAsyncThunk(
  actionTypes.LOGIN_USER,
  async (userData, { rejectWithValue }) => {
    try {
      const response = await usersService.loginUser(userData)
      return response.data
    } catch (error) {
      return rejectWithValue({ message: error.response.data.error })
    }
  },
)
