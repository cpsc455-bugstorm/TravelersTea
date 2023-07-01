import axios from 'axios'
import { API_URL } from '../../../constants/API_URL'

export const fetchTrips = async () => {
  return await axios.get(`${API_URL}/trips`)
}

export const createTrip = async (tripData) => {
  return await axios.post(`${API_URL}/trips`, tripData)
}

export const updateTrip = async (id, tripData) => {
  return await axios.patch(`${API_URL}/trips/${id}`, tripData)
}

export const deleteTrip = async (id) => {
  return await axios.delete(`${API_URL}/trips/${id}`)
}

const tripService = {
  fetchTrips,
  createTrip,
  updateTrip,
  deleteTrip,
}

export default tripService
