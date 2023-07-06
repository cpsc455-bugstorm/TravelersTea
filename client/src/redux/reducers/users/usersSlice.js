import { createSlice } from '@reduxjs/toolkit'
import { handleAsyncAction } from '../../handleAsync'
import { REQUEST_STATE } from '../../states'
import { loginUserAsync, registerUserAsync } from './thunks'

/**
 * @property {users}: [{
 *
 * }]
 */
export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    user: null,
    status: REQUEST_STATE.LOGGEDOUT,
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null
    },
  },
  extraReducers: (builder) => {
    handleAsyncAction(builder, registerUserAsync, {
      pending: (state) => {
        state.status = REQUEST_STATE.READING
      },
      fulfilled: (state, action) => {
        state.status = REQUEST_STATE.LOGGEDIN
        state.user = action.payload
      },
    })
    handleAsyncAction(builder, loginUserAsync, {
      pending: (state) => {
        state.status = REQUEST_STATE.READING
      },
      fulfilled: (state, action) => {
        state.status = REQUEST_STATE.LOGGEDIN
        state.user = action.payload
      },
    })
  },
})

export const { logoutUser } = usersSlice.actions

export default usersSlice.reducer
