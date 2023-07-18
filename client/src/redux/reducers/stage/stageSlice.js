import { createSlice } from '@reduxjs/toolkit'
import { handleAsyncAction } from '../../handleAsync'
import { REQUEST_STATE } from '../../states'
import { fetchStagesByTripIdAsync, updateStageAsync } from './thunks'

/**
 * @property {stages}: an array of days; each day is an array of stages
 */
const initialStateStages = {
  stages: [],
  status: REQUEST_STATE.IDLE,
  error: null,
}
export const stageSlice = createSlice({
  name: 'stages',
  initialState: initialStateStages,
  reducers: {
    resetStages: () => initialStateStages,
    clearStagesError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    handleAsyncAction(builder, fetchStagesByTripIdAsync, {
      pending: (state) => {
        state.status = REQUEST_STATE.READING
      },
      fulfilled: (state, action) => {
        state.stages = action.payload
        state.status = REQUEST_STATE.FULFILLED
      },
    })
    handleAsyncAction(builder, updateStageAsync, {
      pending: (state) => {
        state.status = REQUEST_STATE.WRITING
      },
      fulfilled: (state, action) => {
        const stageIndex = state.stages.findIndex(
          (stage) => stage._id === action.payload._id,
        )
        if (stageIndex !== -1) {
          state.stages[stageIndex] = {
            ...state.stages[stageIndex],
            ...action.payload,
          }
        }
        state.status = REQUEST_STATE.FULFILLED
      },
    })
  },
})

export const { resetStages, clearStagesError } = stageSlice.actions

export default stageSlice.reducer
