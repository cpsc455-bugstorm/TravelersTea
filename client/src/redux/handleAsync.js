import { REQUEST_STATE } from './states'

export const handleAsyncAction = (builder, asyncAction, handlers) => {
  builder
    .addCase(asyncAction.pending, (state) => {
      handlers.pending
        ? handlers.pending(state)
        : (state.status = REQUEST_STATE.PENDING)
    })
    .addCase(asyncAction.fulfilled, (state, action) => {
      handlers.fulfilled(state, action)
    })
    .addCase(asyncAction.rejected, (state, action) => {
      if (handlers.rejected) {
        handlers.rejected(state, action)
      } else {
        state.status = REQUEST_STATE.REJECTED
        state.error =
          action.payload && action.payload.message
            ? action.payload.message
            : null
      }
    })
}
