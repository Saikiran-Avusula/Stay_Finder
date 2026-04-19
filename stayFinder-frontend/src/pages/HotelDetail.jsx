import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createBooking, getApiErrorMessage, getHotel } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function HotelDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState({ checkIn: '', checkOut: '' })
  const [bookingMsg, setBookingMsg] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)
  const minCheckInDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  useEffect(() => {
    getHotel(id)
      .then(res => {
        setHotel(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const handleBook = async (e) => {
    e.preventDefault()

    if (!user) {
      navigate('/login')
      return
    }

    if (!booking.checkIn || !booking.checkOut) {
      setBookingMsg('Please select both check-in and check-out dates.')
      return
    }

    if (booking.checkOut <= booking.checkIn) {
      setBookingMsg('Check-out must be after check-in.')
      return
    }

    setBookingLoading(true)
    setBookingMsg('')

    try {
      await createBooking({
        hotelId: Number(id),
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
      })
      setBookingMsg('Booking confirmed. Check My Bookings.')
      setBooking({ checkIn: '', checkOut: '' })
    } catch (err) {
      setBookingMsg(getApiErrorMessage(err, 'Booking failed'))
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>
  if (!hotel) return <div className="text-center py-20 text-gray-400">Hotel not found</div>

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="rounded-3xl overflow-hidden h-80 mb-8">
        <img
          src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex gap-8">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h1 className="font-display text-4xl font-bold">{hotel.name}</h1>
            <span className="bg-yellow-50 text-yellow-600 font-semibold px-3 py-1 rounded-full text-sm">
              ⭐ {hotel.rating}
            </span>
          </div>
          <p className="text-gray-500 mb-6">📍 {hotel.location}</p>
          <p className="text-gray-600 leading-relaxed mb-8">{hotel.description}</p>

          <h3 className="font-semibold text-dark mb-3">Amenities</h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {hotel.amenities?.map((a, i) => (
              <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm">✓ {a}</span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-dark">{hotel.totalRooms}</p>
              <p className="text-gray-400 text-sm">Total Rooms</p>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center">
              <p className={`text-2xl font-bold ${hotel.availableRooms > 0 ? 'text-green-500' : 'text-red-400'}`}>
                {hotel.availableRooms}
              </p>
              <p className="text-gray-400 text-sm">Available</p>
            </div>
          </div>
        </div>

        <div className="w-80 shrink-0">
          <div className="bg-white rounded-3xl p-6 shadow-sm sticky top-24">
            <p className="text-3xl font-bold text-dark mb-1">₹{hotel.pricePerNight?.toLocaleString()}</p>
            <p className="text-gray-400 text-sm mb-6">per night</p>

            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">Check In</label>
                <input
                  type="date"
                  required
                  value={booking.checkIn}
                  min={minCheckInDate}
                  onChange={e => setBooking({ ...booking, checkIn: e.target.value })}
                  className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">Check Out</label>
                <input
                  type="date"
                  required
                  value={booking.checkOut}
                  min={booking.checkIn || minCheckInDate}
                  onChange={e => setBooking({ ...booking, checkOut: e.target.value })}
                  className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              {bookingMsg && (
                <p className="text-sm text-center py-2 px-3 bg-gray-50 rounded-xl">{bookingMsg}</p>
              )}

              <button
                type="submit"
                disabled={bookingLoading || hotel.availableRooms === 0}
                className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingLoading ? 'Booking...' : hotel.availableRooms === 0 ? 'Fully Booked' : 'Book Now'}
              </button>

              {!user && (
                <p className="text-xs text-center text-gray-400">
                  <span className="text-primary cursor-pointer" onClick={() => navigate('/login')}>Login</span> to book
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
