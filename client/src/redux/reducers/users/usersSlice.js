import { createSlice } from '@reduxjs/toolkit'
import { handleAsyncAction } from '../../handleAsync'
import { REQUEST_STATE } from '../../states'
import { loginUserAsync, registerUserAsync } from './thunks'

const DEV_DISABLE_LOGIN = process.env.REACT_APP_DEV_DISABLE_LOGIN === 'true'
const DEV_ACCESS_TOKEN = process.env.REACT_APP_DEV_ACCESS_TOKEN

const initialLoginState = DEV_DISABLE_LOGIN
  ? {
      user: {
        id: '64a7310aee0a85231209105d',
        username: 'mypassis123',
        accessToken: DEV_ACCESS_TOKEN,
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
  },
  extraReducers: (builder) => {
    handleAsyncAction(builder, registerUserAsync, {
      pending: (state) => {
        state.status = REQUEST_STATE.READING
      },
      fulfilled: (state, action) => {
        state.status = REQUEST_STATE.LOGGINGIN
        state.isNewAccount = true
        state.user = action.payload
      },
    })
    handleAsyncAction(builder, loginUserAsync, {
      pending: (state) => {
        state.status = REQUEST_STATE.READING
      },
      fulfilled: (state, action) => {
        state.status = REQUEST_STATE.LOGGINGIN
        state.user = action.payload
      },
    })
  },
})

export const {
  logoutUser,
  updateAsLoggedOut,
  updateAsLoggedIn,
  clearUserError,
} = usersSlice.actions

export default usersSlice.reducer
