import axios from 'axios'
import { API_URL } from '../../../constants/API_URL'

export const fetchTrips = async () => {
  return await axios.get(`${API_URL}/trip`)
}

export const createTrip = async (tripData) => {
  return await axios.post(`${API_URL}/trip`, tripData)
}

export const editTrip = async (id, tripData) => {
  return await axios.patch(`${API_URL}/trip/${id}`, tripData)
}

export const deleteTrip = async (id) => {
  return await axios.delete(`${API_URL}/trip/${id}`)
}

const tripService = {
  fetchTrips,
  createTrip,
  editTrip,
  deleteTrip,
}

export default tripService
