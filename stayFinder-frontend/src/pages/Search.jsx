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
    <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8">
      <aside className="w-64 shrink-0">
        <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
          <h3 className="font-semibold text-dark mb-5">Filters</h3>
          <form onSubmit={handleFilter} className="space-y-5">
            <div>
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">Location</label>
              <input
                type="text"
                placeholder="City name"
                value={filters.location}
                onChange={e => setFilters({ ...filters, location: e.target.value })}
                className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">Price Range (₹)</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">Min Rating</label>
              <select
                value={filters.minRating}
                onChange={e => setFilters({ ...filters, minRating: e.target.value })}
                className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="">Any</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="4.5">4.5+</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={e => setFilters({ ...filters, sortBy: e.target.value })}
                className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="pricePerNight">Price</option>
                <option value="rating">Rating</option>
              </select>
              <select
                value={filters.sortDir}
                onChange={e => setFilters({ ...filters, sortDir: e.target.value })}
                className="w-full mt-2 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="available"
                checked={filters.availableOnly}
                onChange={e => setFilters({ ...filters, availableOnly: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="available" className="text-sm text-gray-600">Available only</label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>

            <button
              type="button"
              onClick={clearFilters}
              className="w-full text-gray-400 text-sm hover:text-dark transition-colors"
            >
              Clear all
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold">
            {filters.location ? `Hotels in ${filters.location}` : 'All Hotels'}
          </h2>
          <span className="text-gray-400 text-sm">{hotels.length} results</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🏨</p>
            <p className="text-lg">No hotels found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map(h => <HotelCard key={h.id} hotel={h} />)}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => fetchHotels(i, filters)}
                className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                  i === page ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
