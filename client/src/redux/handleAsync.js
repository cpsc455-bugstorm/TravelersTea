import { REQUEST_STATE } from './states'

export const handleAsyncAction = (builder, asyncAction, handlers) => {
  builder
    .addCase(asyncAction.pending, (state) => {
      state.status = REQUEST_STATE.PENDING
    })
    .addCase(asyncAction.fulfilled, (state, action) => {
      state.status = REQUEST_STATE.FULFILLED
      handlers.fulfilled(state, action)
    })
    .addCase(asyncAction.rejected, (state, action) => {
      state.status = REQUEST_STATE.REJECTED
      state.error = action.payload.message
    })
}
