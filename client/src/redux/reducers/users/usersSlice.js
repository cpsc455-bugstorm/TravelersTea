import { createSlice } from '@reduxjs/toolkit'
import { handleAsyncAction } from '../../handleAsync'
import { REQUEST_STATE } from '../../states'
import {
  fetchLimitLeftAsync,
  loginUserAsync,
  registerUserAsync,
} from './thunks'

const DEV_DISABLE_LOGIN = process.env.REACT_APP_DEV_DISABLE_LOGIN === 'true'

const initialLoginState = DEV_DISABLE_LOGIN
  ? {
      user: {
        username: 'user1',
      },
      status: REQUEST_STATE.LOGGEDIN,
    }
  : {
      user: null,
      status: REQUEST_STATE.LOGGEDOUT,
    }

/**
 * @property {users}: [{
 *
 * }]
 */
export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    user: initialLoginState.user,
    status: initialLoginState.status,
    error: null,
    isNewAccount: false,
    attemptLeft: null,
  },
  reducers: {
    updateAsLoggedOut: (state) => {
      state.status = REQUEST_STATE.LOGGEDOUT
    },
    logoutUser: (state) => {
      state.status = REQUEST_STATE.LOGGINGOUT
      state.user = null
      state.error = null
      state.isNewAccount = false
    },
    updateAsLoggedIn: (state) => {
      state.status = REQUEST_STATE.LOGGEDIN
    },
    clearUserError: (state) => {
      state.error = null
    },
    decrementAttemptsLeft: (state) => {
      state.attemptLeft = state.attemptLeft - 1
    },
  },
  extraReducers: (builder) => {
    handleAsyncAction(builder, fetchLimitLeftAsync, {
      pending: () => {},
      fulfilled: (state, action) => {
        state.attemptLeft = action.payload.attemptLeft
      },
      rejected: (state) => {
        state.attemptLeft = 0
      },
    })
    handleAsyncAction(builder, registerUserAsync, {
      pending: (state) => {
        state.status = REQUEST_STATE.READING
      },
      fulfilled: (state, action) => {
        state.status = REQUEST_STATE.LOGGINGIN
        state.isNewAccount = true
        state.user = {
          username: action.payload.username,
        }
      },
    })
    handleAsyncAction(builder, loginUserAsync, {
      pending: (state) => {
        state.status = REQUEST_STATE.READING
      },
      fulfilled: (state, action) => {
        state.status = REQUEST_STATE.LOGGINGIN
        state.user = {
          username: action.payload.username,
        }
      },
    })
  },
})

export const {
  logoutUser,
  updateAsLoggedOut,
  updateAsLoggedIn,
  clearUserError,
  decrementAttemptsLeft,
} = usersSlice.actions

export default usersSlice.reducer
