import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const destinations = [
  { name: 'Goa', label: 'Beach stays', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=700' },
  { name: 'Jaipur', label: 'Heritage hotels', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=700' },
  { name: 'Manali', label: 'Mountain resorts', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700' },
  { name: 'Mumbai', label: 'Business trips', img: 'https://images.unsplash.com/photo-1551882547-ff40c4fe1fa7?w=700' },
]

export default function Home() {
  const [location, setLocation] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    const query = location.trim()
    navigate(query ? `/search?location=${encodeURIComponent(query)}` : '/search')
  }

  return (
    <main>
      <section className="relative min-h-[560px] overflow-hidden bg-dark text-white">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600"
          alt="Hotel pool and exterior"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />

        <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-teal-100">Hotel booking across India</p>
            <h1 className="font-display text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
              Find a stay that fits the trip.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-100">
              Compare curated hotels by city, nightly price, rating, and availability with a booking flow that stays out of your way.
            </p>

            <form onSubmit={handleSearch} className="mt-9 flex max-w-2xl flex-col gap-3 rounded-lg bg-white p-2 shadow-2xl sm:flex-row">
              <input
                type="text"
                placeholder="Search by city, for example Goa"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="min-h-12 flex-1 rounded-md px-4 text-sm font-medium text-dark outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-primary/40"
              />
              <button
                type="submit"
                className="min-h-12 rounded-md bg-primary px-6 text-sm font-bold text-white transition-colors hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Search Hotels
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Popular destinations</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-dark">Start with a city</h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/search')}
            className="self-start rounded-full border border-stone-300 px-5 py-2 text-sm font-bold text-dark transition-colors hover:border-primary hover:text-primary sm:self-auto"
          >
            Browse all hotels
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map(destination => (
            <button
              key={destination.name}
              type="button"
              onClick={() => navigate(`/search?location=${destination.name}`)}
              className="group relative h-64 overflow-hidden rounded-lg text-left shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              aria-label={`Explore ${destination.name}`}
            >
              <img src={destination.img} alt={destination.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute bottom-0 p-5 text-white">
                <p className="text-sm font-semibold text-teal-100">{destination.label}</p>
                <p className="font-display text-3xl font-bold">{destination.name}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}
