import { createSlice } from '@reduxjs/toolkit'

const initialModalStates = {
  newTripModalIsOpen: false,
  editTripModalIsOpen: false,
  editStageModalIsOpen: false,
}

const modalsSlice = createSlice({
  name: 'modals',
  initialState: initialModalStates,
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
    openEditStageModal: (state) => {
      state.editStageModalIsOpen = true
    },
    closeEditStageModal: (state) => {
      state.editStageModalIsOpen = false
    },
    resetModalsDisplayed: () => initialModalStates,
  },
})

export const {
  openNewTripModal,
  closeNewTripModal,
  openEditTripModal,
  closeEditTripModal,
  resetModalsDisplayed,
  openEditStageModal,
  closeEditStageModal,
} = modalsSlice.actions

export default modalsSlice.reducer
