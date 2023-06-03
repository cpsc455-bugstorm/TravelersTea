import { createSlice } from '@reduxjs/toolkit'

const modalsSlice = createSlice({
  name: 'modals',
  initialState: {
    newTripModalIsOpen: true,
  },
  reducers: {
    openNewTripModal: (state) => {
      state.newTripModalIsOpen = true
    },
    closeNewTripModal: (state) => {
      state.newTripModalIsOpen = false
    },
  },
})

export const { openNewTripModal, closeNewTripModal } = modalsSlice.actions

export default modalsSlice.reducer
