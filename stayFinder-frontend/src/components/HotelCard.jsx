import { useNavigate } from 'react-router-dom'

export default function HotelCard({ hotel }) {
  const navigate = useNavigate()

  const openHotel = () => {
    navigate(`/hotels/${hotel.id}`)
  }

  return (
    <article
      onClick={openHotel}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openHotel()
        }
      }}
      role="button"
      tabIndex={0}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer text-left"
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 text-xs font-semibold flex items-center gap-1">
          ⭐ {hotel.rating}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-dark text-lg leading-tight">{hotel.name}</h3>
        <p className="text-gray-500 text-sm mt-1">📍 {hotel.location}</p>

        <div className="flex flex-wrap gap-1 mt-3">
          {hotel.amenities?.slice(0, 3).map((a, i) => (
            <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{a}</span>
          ))}
          {hotel.amenities?.length > 3 && (
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">+{hotel.amenities.length - 3}</span>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-2xl font-bold text-dark">₹{hotel.pricePerNight?.toLocaleString()}</span>
            <span className="text-gray-400 text-sm"> / night</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              openHotel()
            }}
            className="bg-blue-700 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            View
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          {hotel.availableRooms > 0
            ? `${hotel.availableRooms} rooms available`
            : <span className="text-red-400">Fully booked</span>
          }
        </p>
      </div>
    </article>
  )
}
