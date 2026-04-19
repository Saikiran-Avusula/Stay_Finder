import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyBookings, cancelBooking } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Bookings() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return navigate('/login')
    getMyBookings().then(res => {
      setBookings(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return
    try {
      await cancelBooking(id)
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b))
    } catch (err) {
      alert(err.response?.data?.error || 'Cancel failed')
    }
  }

  const statusColor = {
    CONFIRMED: 'bg-green-100 text-green-600',
    PENDING: 'bg-yellow-100 text-yellow-600',
    CANCELLED: 'bg-red-100 text-red-400',
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-lg">No bookings yet</p>
          <button onClick={() => navigate('/search')} className="mt-4 bg-primary text-white px-6 py-2 rounded-full text-sm hover:bg-blue-700 transition-colors">
            Browse Hotels
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => (
            <div key={b.id} className="bg-white rounded-2xl p-6 shadow-sm flex gap-4">
              <img
                src={b.hotelImageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200'}
                alt={b.hotelName}
                className="w-24 h-24 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-dark text-lg">{b.hotelName}</h3>
                    <p className="text-gray-400 text-sm">📍 {b.hotelLocation}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[b.status]}`}>
                    {b.status}
                  </span>
                </div>
                <div className="flex gap-6 mt-3 text-sm text-gray-500">
                  <span>📅 {b.checkIn} → {b.checkOut}</span>
                  <span className="font-semibold text-dark">₹{b.totalPrice?.toLocaleString()}</span>
                </div>
              </div>
              {b.status !== 'CANCELLED' && (
                <button
                  onClick={() => handleCancel(b.id)}
                  className="self-center text-xs text-red-400 hover:text-red-600 border border-red-200 px-3 py-1.5 rounded-full transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
