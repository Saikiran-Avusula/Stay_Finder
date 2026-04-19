import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)

// Hotels
export const searchHotels = (params) => api.get('/hotels/search', { params })
export const getHotel = (id) => api.get(`/hotels/${id}`)
export const createHotel = (data) => api.post('/hotels', data)
export const updateHotel = (id, data) => api.put(`/hotels/${id}`, data)
export const deleteHotel = (id) => api.delete(`/hotels/${id}`)

// Bookings
export const createBooking = (data) => api.post('/bookings', data)
export const getMyBookings = () => api.get('/bookings/my')
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`)

export default api
