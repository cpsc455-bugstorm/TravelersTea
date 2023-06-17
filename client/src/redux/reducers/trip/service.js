import axios from 'axios'

export const fetchTrips = async () => {
  return await axios.get('http://localhost:5001/api/trip')
}

export const createTrip = async (tripData) => {
  return await axios.post('http://localhost:5001/api/trip', tripData)
}

export const editTrip = async (id, tripData) => {
  return await axios.patch(`http://localhost:5001/api/trip/${id}`, tripData)
}

export const deleteTrip = async (id) => {
  return await axios.delete(`http://localhost:5001/api/trip/${id}`)
}

const tripService = {
  fetchTrips,
  createTrip,
  editTrip,
  deleteTrip,
}

export default tripService
