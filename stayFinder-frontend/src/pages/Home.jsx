import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [location, setLocation] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/search?location=${location}`)
  }

  const destinations = [
    { name: 'Goa', emoji: '🏖️', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400' },
    { name: 'Jaipur', emoji: '🏰', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400' },
    { name: 'Manali', emoji: '🏔️', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400' },
    { name: 'Mumbai', emoji: '🌆', img: 'https://images.unsplash.com/photo-1551882547-ff40c4fe1fa7?w=400' },
  ]

  return (
    <div>
      {/* Hero */}
      <div className="relative bg-dark text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="relative max-w-7xl mx-auto px-6 py-28 text-center">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4">
            Find Your Perfect Stay
          </h1>
          <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto">
            Search hotels across India. Filter by price, rating, and amenities.
          </p>

          <form onSubmit={handleSearch} className="flex gap-3 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Where do you want to go?"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="flex-1 px-5 py-4 rounded-2xl text-dark text-sm outline-none"
            />
            <button
              type="submit"
              className="bg-primary px-6 py-4 rounded-2xl text-sm font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="font-display text-3xl font-bold mb-8">Popular Destinations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {destinations.map(d => (
            <div
              key={d.name}
              onClick={() => navigate(`/search?location=${d.name}`)}
              className="relative rounded-2xl overflow-hidden h-40 cursor-pointer group"
            >
              <img src={d.img} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                <div>
                  <span className="text-xl">{d.emoji}</span>
                  <p className="text-white font-semibold text-lg">{d.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary text-white text-center py-16 px-6">
        <h2 className="font-display text-4xl font-bold mb-4">Ready to explore?</h2>
        <p className="text-blue-100 mb-8">Thousands of hotels waiting for you.</p>
        <button
          onClick={() => navigate('/search')}
          className="bg-white text-primary font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
        >
          Browse All Hotels
        </button>
      </div>
    </div>
  )
}
