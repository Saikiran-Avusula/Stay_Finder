import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchHotels } from '../services/api'
import HotelCard from '../components/HotelCard'

const defaultFilters = {
  location: '',
  minPrice: '',
  maxPrice: '',
  minRating: '',
  availableOnly: false,
  sortBy: 'pricePerNight',
  sortDir: 'asc',
}

export default function Search() {
  const [searchParams] = useSearchParams()
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [filters, setFilters] = useState({
    ...defaultFilters,
    location: searchParams.get('location') || '',
  })

  const fetchHotels = async (pg = 0, activeFilters = filters) => {
    setLoading(true)
    try {
      const params = { page: pg, size: 9, ...activeFilters }
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === false) {
          delete params[key]
        }
      })

      const res = await searchHotels(params)
      setHotels(res.data.content)
      setTotalPages(res.data.totalPages)
      setPage(pg)
    } catch (err) {
      console.error(err)
      setHotels([])
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const location = searchParams.get('location') || ''
    const nextFilters = { ...defaultFilters, location }
    setFilters(nextFilters)
    fetchHotels(0, nextFilters)
  }, [searchParams])

  const handleFilter = (e) => {
    e.preventDefault()
    fetchHotels(0, filters)
  }

  const clearFilters = () => {
    setFilters(defaultFilters)
    fetchHotels(0, defaultFilters)
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Explore hotels</p>
        <div className="mt-2 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h1 className="font-display text-4xl font-bold text-dark">
              {filters.location ? `Hotels in ${filters.location}` : 'All hotels'}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Filter by price, rating, room availability, and sort order.
            </p>
          </div>
          <span className="rounded-full bg-stone-100 px-4 py-2 text-sm font-bold text-gray-700">
            {hotels.length} shown
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <aside>
          <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-dark">Filters</h2>
            <form onSubmit={handleFilter} className="mt-5 space-y-5">
              <div>
                <label className="text-sm font-bold text-dark">Location</label>
                <input
                  type="text"
                  placeholder="City name"
                  value={filters.location}
                  onChange={e => setFilters({ ...filters, location: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-dark">Price range</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-dark">Minimum rating</label>
                <select
                  value={filters.minRating}
                  onChange={e => setFilters({ ...filters, minRating: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                >
                  <option value="">Any rating</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="4.5">4.5+</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-bold text-dark">Sort by</label>
                  <select
                    value={filters.sortBy}
                    onChange={e => setFilters({ ...filters, sortBy: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  >
                    <option value="pricePerNight">Price</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-dark">Order</label>
                  <select
                    value={filters.sortDir}
                    onChange={e => setFilters({ ...filters, sortDir: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  >
                    <option value="asc">Low first</option>
                    <option value="desc">High first</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-lg bg-stone-50 p-3 text-sm font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={filters.availableOnly}
                  onChange={e => setFilters({ ...filters, availableOnly: e.target.checked })}
                  className="h-4 w-4 accent-teal-700"
                />
                Available only
              </label>

              <button
                type="submit"
                className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-white transition-colors hover:bg-teal-800"
              >
                Apply filters
              </button>

              <button
                type="button"
                onClick={clearFilters}
                className="w-full rounded-lg border border-stone-200 py-3 text-sm font-bold text-gray-700 transition-colors hover:border-primary hover:text-primary"
              >
                Clear all
              </button>
            </form>
          </div>
        </aside>

        <section>
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 animate-pulse rounded-lg bg-white" />
              ))}
            </div>
          ) : hotels.length === 0 ? (
            <div className="rounded-lg border border-stone-200 bg-white px-6 py-20 text-center shadow-sm">
              <p className="font-display text-3xl font-bold text-dark">No hotels found</p>
              <p className="mt-2 text-sm text-gray-500">Try a wider price range or clear a filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {hotels.map(hotel => <HotelCard key={hotel.id} hotel={hotel} />)}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => fetchHotels(i, filters)}
                  className={`h-10 w-10 rounded-full text-sm font-bold transition-colors ${
                    i === page ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-stone-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
