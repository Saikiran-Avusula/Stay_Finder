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
      className="group overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
    >
      <div className="relative h-52 overflow-hidden bg-stone-100">
        <img
          src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
          alt={hotel.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-dark shadow-sm">
          {hotel.rating?.toFixed ? hotel.rating.toFixed(1) : hotel.rating} rating
        </div>
      </div>

      <div className="p-5">
        <div className="min-h-16">
          <h3 className="text-lg font-bold leading-tight text-dark">{hotel.name}</h3>
          <p className="mt-1 text-sm font-medium text-gray-500">{hotel.location}</p>
        </div>

        <div className="mt-4 flex min-h-14 flex-wrap gap-2">
          {hotel.amenities?.slice(0, 3).map((amenity) => (
            <span key={amenity} className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-gray-600">
              {amenity}
            </span>
          ))}
          {hotel.amenities?.length > 3 && (
            <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-gray-600">
              +{hotel.amenities.length - 3} more
            </span>
          )}
        </div>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-2xl font-bold text-dark">Rs. {hotel.pricePerNight?.toLocaleString()}</p>
            <p className="text-xs font-medium text-gray-500">per night</p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              openHotel()
            }}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
          >
            View
          </button>
        </div>

        <p className={`mt-3 text-xs font-semibold ${hotel.availableRooms > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {hotel.availableRooms > 0 ? `${hotel.availableRooms} rooms available` : 'Fully booked'}
        </p>
      </div>
    </article>
  )
}
