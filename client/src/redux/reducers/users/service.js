import axios from 'axios'
import { API_URL } from '../../../constants/API_URL'

export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/users/register`, userData)
}

export const loginUser = async (userData) => {
  return await axios.post(`${API_URL}/users/login`, userData)
}

const usersService = {
  registerUser,
  loginUser,
}

export default usersService
