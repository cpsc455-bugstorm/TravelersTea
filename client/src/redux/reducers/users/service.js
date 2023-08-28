import axios from 'axios'
import { API_URL } from '../../../constants/API_URL'

export const fetchLimit = async () => {
  return await axios.get(`${API_URL}/users/limit-left`, {})
}

export const fetchEFLimit = async () => {
  return await axios.get(`${API_URL}/users/ef-limit-left`, {})
}

export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/users/register`, userData)
}

export const loginUser = async (userData) => {
  return await axios.post(`${API_URL}/users/login`, userData)
}

const usersService = {
  fetchLimit,
  fetchEFLimit,
  registerUser,
  loginUser,
}

export default usersService
