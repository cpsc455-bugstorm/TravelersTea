import axios from 'axios'
import { API_URL } from '../../../constants/API_URL'

export const fetchStage = async (id) => {
  return await axios.get(`${API_URL}/stages/${id}`)
}

export const fetchStagesByTripId = async (tripId) => {
  return await axios.get(`${API_URL}/stages`, { params: { tripId } })
}

// export const createStage = async (stageData) => {
//   return await axios.post(`${API_URL}/stages`, stageData)
// }

export const updateStage = async (id, updateData) => {
  return await axios.patch(`${API_URL}/stages/${id}`, updateData)
}

export const deleteStage = async (id) => {
  return await axios.delete(`${API_URL}/stages/${id}`)
}

const stageService = {
  fetchStage,
  fetchStagesByTripId,
  // createStage,
  updateStage,
  deleteStage,
}

export default stageService
