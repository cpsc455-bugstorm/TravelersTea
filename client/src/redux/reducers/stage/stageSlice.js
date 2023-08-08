import { createSlice } from '@reduxjs/toolkit'
import { handleAsyncAction } from '../../handleAsync'
import { REQUEST_STATE } from '../../states'
import {
  fetchStagesBySharedTripIdAsync,
  fetchStagesByTripIdAsync,
  updateStageAsync,
} from './thunks'

/**
 * @property {stages}: an array of days; each day is an array of stages
 */
const initialStateStages = {
  stages: [],
  editStageId: null,
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
    updateEditStageId: (state, action) => {
      state.editStageId = action.payload
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
    handleAsyncAction(builder, fetchStagesBySharedTripIdAsync, {
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
        let newStage = action.payload
        state.stages = state.stages.map((dayStages) =>
          dayStages.map((stage) =>
            stage._id === newStage._id ? newStage : stage,
          ),
        )
        state.status = REQUEST_STATE.FULFILLED
      },
    })
  },
})

export const { resetStages, clearStagesError, updateEditStageId } =
  stageSlice.actions

export default stageSlice.reducer
