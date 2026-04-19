import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchHotels, createHotel, deleteHotel } from '../services/api'
import { useAuth } from '../context/AuthContext'

const empty = { name: '', location: '', description: '', pricePerNight: '', rating: '', totalRooms: '', availableRooms: '', imageUrl: '', amenities: '' }

export default function Admin() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [hotels, setHotels] = useState([])
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') return navigate('/')
    fetchHotels()
  }, [])

  const fetchHotels = async () => {
    const res = await searchHotels({ size: 50 })
    setHotels(res.data.content)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    try {
      await createHotel({
        ...form,
        pricePerNight: parseFloat(form.pricePerNight),
        rating: parseFloat(form.rating),
        totalRooms: parseInt(form.totalRooms),
        availableRooms: parseInt(form.availableRooms),
        amenities: form.amenities.split(',').map(a => a.trim()).filter(Boolean)
      })
      setMsg('✅ Hotel created')
      setForm(empty)
      fetchHotels()
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.error || 'Failed'))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hotel?')) return
    await deleteHotel(id)
    fetchHotels()
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Admin Panel</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Hotel Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-dark text-lg mb-5">Add New Hotel</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            {[
              { key: 'name', label: 'Hotel Name', type: 'text' },
              { key: 'location', label: 'Location', type: 'text' },
              { key: 'description', label: 'Description', type: 'text' },
              { key: 'pricePerNight', label: 'Price Per Night (₹)', type: 'number' },
              { key: 'rating', label: 'Rating (0-5)', type: 'number' },
              { key: 'totalRooms', label: 'Total Rooms', type: 'number' },
              { key: 'availableRooms', label: 'Available Rooms', type: 'number' },
              { key: 'imageUrl', label: 'Image URL', type: 'text' },
              { key: 'amenities', label: 'Amenities (comma separated)', type: 'text' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">{f.label}</label>
                <input
                  type={f.type}
                  required={['name', 'location', 'pricePerNight'].includes(f.key)}
                  value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
            ))}

            {msg && <p className="text-sm">{msg}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Hotel'}
            </button>
          </form>
        </div>

        {/* Hotel List */}
        <div>
          <h2 className="font-semibold text-dark text-lg mb-5">All Hotels ({hotels.length})</h2>
          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {hotels.map(h => (
              <div key={h.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
                <img
                  src={h.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100'}
                  alt={h.name}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-dark text-sm truncate">{h.name}</p>
                  <p className="text-gray-400 text-xs">📍 {h.location} · ₹{h.pricePerNight?.toLocaleString()}/night</p>
                  <p className="text-gray-400 text-xs">⭐ {h.rating} · {h.availableRooms} rooms left</p>
                </div>
                <button
                  onClick={() => handleDelete(h.id)}
                  className="text-xs text-red-400 hover:text-red-600 border border-red-200 px-3 py-1.5 rounded-full transition-colors shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
