import axios from 'axios'
import { API_URL } from '../../../constants/API_URL'

const axiosWithToken = axios.create()

axiosWithToken.interceptors.request.use((config) => {
  const token = localStorage.getItem('travelersTea_accessToken')
  config.headers.Authorization = token ? `Bearer ${token}` : ''
  return config
})

export const fetchTrips = async () => {
  return await axiosWithToken.get(`${API_URL}/trips`)
}

export const fetchSharedTripByTripId = async (id) => {
  return await axiosWithToken.get(`${API_URL}/trips/share/${id}`)
}

export const createTrip = async (tripData) => {
  return await axiosWithToken.post(`${API_URL}/trips`, tripData)
}

export const updateTrip = async (id, tripData) => {
  return await axiosWithToken.patch(`${API_URL}/trips/${id}`, tripData)
}

export const deleteTrip = async (id) => {
  return await axiosWithToken.delete(`${API_URL}/trips/${id}`)
}

export const enableShareTrip = async (id) => {
  return await axiosWithToken.patch(`${API_URL}/trips/share/${id}`)
}

const tripService = {
  fetchTrips,
  fetchSharedTripByTripId,
  createTrip,
  updateTrip,
  deleteTrip,
  enableShareTrip,
}

export default tripService
