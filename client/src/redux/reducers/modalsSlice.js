import { createSlice } from '@reduxjs/toolkit'

const modalsSlice = createSlice({
  name: 'modals',
  initialState: {
    newTripModalIsOpen: true,
    editTripModalIsOpen: false,
  },
  reducers: {
    openNewTripModal: (state) => {
      state.newTripModalIsOpen = true
    },
    closeNewTripModal: (state) => {
      state.newTripModalIsOpen = false
    },
    openEditTripModal: (state) => {
      state.editTripModalIsOpen = true
    },
    closeEditTripModal: (state) => {
      state.editTripModalIsOpen = false
    },
    resetModalPreferences: (state) => {
      state.editTripModalIsOpen = false
      state.newTripModalIsOpen = true
    },
  },
})

export const {
  openNewTripModal,
  closeNewTripModal,
  openEditTripModal,
  closeEditTripModal,
  resetModalPreferences,
} = modalsSlice.actions

export default modalsSlice.reducer
