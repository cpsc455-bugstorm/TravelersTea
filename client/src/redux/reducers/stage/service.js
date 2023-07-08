import axios from 'axios'
import { API_URL } from '../../../constants/API_URL'

export const fetchStage = async (id) => {
  return await axios.get(`${API_URL}/stages/${id}`)
}

export const fetchStagesByTripId = async (tripId) => {
  return await axios.get(`${API_URL}/stages`, { tripId: tripId })
}

export const createStage = async (stageData) => {
  return await axios.post(`${API_URL}/stages`, stageData)
}

export const updateStage = async (id, stageData) => {
  return await axios.patch(`${API_URL}/stages/${id}`, stageData)
}

export const deleteStage = async (id) => {
  return await axios.delete(`${API_URL}/stages/${id}`)
}

const stageService = {
  fetchStage,
  fetchStagesByTripId,
  createStage,
  updateStage,
  deleteStage,
}

export default stageService
