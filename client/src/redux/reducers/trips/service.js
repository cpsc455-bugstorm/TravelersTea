import axios from 'axios'
import { API_URL } from '../../../constants/API_URL'

const axiosWithToken = axios.create({
  headers: {
    common: {
      Authorization: `Bearer ${localStorage.getItem(
        'travelersTea_accessToken',
      )}`,
    },
  },
})

export const fetchTrips = async () => {
  return await axiosWithToken.get(`${API_URL}/trips`)
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

const tripService = {
  fetchTrips,
  createTrip,
  updateTrip,
  deleteTrip,
}

export default tripService
