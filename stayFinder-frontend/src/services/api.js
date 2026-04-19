import axios from 'axios'

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

const normalizedBaseUrl = configuredBaseUrl
  ? `${configuredBaseUrl.replace(/\/+$/, '').replace(/\/api$/, '')}/api`
  : '/api'

const api = axios.create({ baseURL: normalizedBaseUrl })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function getApiErrorMessage(err, fallbackMessage) {
  const data = err?.response?.data

  if (typeof data === 'string' && data.trim()) {
    return data
  }

  if (typeof data?.error === 'string' && data.error.trim()) {
    return data.error
  }

  if (typeof data?.message === 'string' && data.message.trim()) {
    return data.message
  }

  if (typeof err?.message === 'string' && err.message.trim()) {
    return err.message
  }

  return fallbackMessage
}

export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)

export const searchHotels = (params) => api.get('/hotels/search', { params })
export const getHotel = (id) => api.get(`/hotels/${id}`)
export const createHotel = (data) => api.post('/hotels', data)
export const updateHotel = (id, data) => api.put(`/hotels/${id}`, data)
export const deleteHotel = (id) => api.delete(`/hotels/${id}`)

export const createBooking = (data) => api.post('/bookings', data)
export const getMyBookings = () => api.get('/bookings/my')
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`)

export default api
