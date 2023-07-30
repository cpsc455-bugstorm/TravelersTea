import axios from 'axios'
import { API_URL } from '../../../constants/API_URL'

const axiosWithToken = axios.create()

axiosWithToken.interceptors.request.use((config) => {
  const token = localStorage.getItem('travelersTea_accessToken')
  config.headers.Authorization = token ? `Bearer ${token}` : ''
  return config
})

export const fetchStage = async (id) => {
  return await axiosWithToken.get(`${API_URL}/stages/${id}`)
}

export const fetchStagesByTripId = async (tripId) => {
  return await axiosWithToken.get(`${API_URL}/stages`, { params: { tripId } })
}

export const updateStage = async (id, updateData) => {
  return await axiosWithToken.patch(`${API_URL}/stages/${id}`, updateData)
}

const stageService = {
  fetchStage,
  fetchStagesByTripId,
  // createStage,
  updateStage,
  // deleteStage,
}

export default stageService
