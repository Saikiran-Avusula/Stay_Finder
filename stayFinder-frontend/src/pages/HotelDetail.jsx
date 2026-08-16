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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 h-80 overflow-hidden rounded-lg border border-stone-200 bg-stone-100 shadow-sm">
        <img
          src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
        <div className="flex-1">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <h1 className="font-display text-4xl font-bold text-dark">{hotel.name}</h1>
            <span className="self-start rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700">
              {hotel.rating} rating
            </span>
          </div>
          <p className="mb-6 text-sm font-semibold text-gray-500">{hotel.location}</p>
          <p className="mb-8 leading-8 text-gray-600">{hotel.description}</p>

          <h3 className="font-semibold text-dark mb-3">Amenities</h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {hotel.amenities?.map((a, i) => (
              <span key={i} className="rounded-full bg-stone-100 px-3 py-1.5 text-sm font-medium text-gray-700">{a}</span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-stone-200 bg-white p-4 text-center">
              <p className="text-2xl font-bold text-dark">{hotel.totalRooms}</p>
              <p className="text-gray-400 text-sm">Total Rooms</p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-4 text-center">
              <p className={`text-2xl font-bold ${hotel.availableRooms > 0 ? 'text-green-500' : 'text-red-400'}`}>
                {hotel.availableRooms}
              </p>
              <p className="text-gray-400 text-sm">Available</p>
            </div>
          </div>
        </div>

        <div>
          <div className="sticky top-24 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <p className="mb-1 text-3xl font-bold text-dark">Rs. {hotel.pricePerNight?.toLocaleString()}</p>
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
                  className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
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
                  className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>

              {bookingMsg && (
                <p className="rounded-lg bg-stone-50 px-3 py-2 text-center text-sm">{bookingMsg}</p>
              )}

              <button
                type="submit"
                disabled={bookingLoading || hotel.availableRooms === 0}
                className="w-full rounded-lg bg-primary py-3 font-bold text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
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
