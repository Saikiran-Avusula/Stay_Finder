import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createHotel, deleteHotel, getApiErrorMessage, searchHotels, updateHotel } from '../services/api'
import { useAuth } from '../context/AuthContext'

const empty = {
  name: '',
  location: '',
  description: '',
  pricePerNight: '',
  rating: '',
  totalRooms: '',
  availableRooms: '',
  imageUrl: '',
  amenities: '',
}

const fallbackImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600'

function toForm(hotel) {
  return {
    name: hotel.name || '',
    location: hotel.location || '',
    description: hotel.description || '',
    pricePerNight: hotel.pricePerNight ?? '',
    rating: hotel.rating ?? '',
    totalRooms: hotel.totalRooms ?? '',
    availableRooms: hotel.availableRooms ?? '',
    imageUrl: hotel.imageUrl || '',
    amenities: hotel.amenities?.join(', ') || '',
  }
}

function toPayload(form) {
  return {
    name: form.name.trim(),
    location: form.location.trim(),
    description: form.description.trim(),
    pricePerNight: Number(form.pricePerNight),
    rating: form.rating === '' ? 0 : Number(form.rating),
    totalRooms: form.totalRooms === '' ? 0 : Number.parseInt(form.totalRooms, 10),
    availableRooms: form.availableRooms === '' ? 0 : Number.parseInt(form.availableRooms, 10),
    imageUrl: form.imageUrl.trim(),
    amenities: form.amenities.split(',').map(a => a.trim()).filter(Boolean),
  }
}

export default function Admin() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [hotels, setHotels] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [listLoading, setListLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [imageStatus, setImageStatus] = useState('')

  const isEditing = editingId !== null
  const previewSrc = useMemo(() => form.imageUrl.trim() || fallbackImage, [form.imageUrl])

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/')
      return
    }
    fetchHotels()
  }, [user, navigate])

  const fetchHotels = async () => {
    setListLoading(true)
    try {
      const res = await searchHotels({ size: 100, sortBy: 'createdAt', sortDir: 'desc' })
      setHotels(res.data.content)
    } catch (err) {
      setMsg(getApiErrorMessage(err, 'Could not load hotels'))
    } finally {
      setListLoading(false)
    }
  }

  const resetForm = () => {
    setForm(empty)
    setEditingId(null)
    setImageStatus('')
    setMsg('')
  }

  const handleEdit = (hotel) => {
    setForm(toForm(hotel))
    setEditingId(hotel.id)
    setImageStatus('')
    setMsg(`Editing ${hotel.name}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleImageFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setImageStatus('Please select a valid image file.')
      return
    }
    if (file.size > 1024 * 1024) {
      setImageStatus('Image must be 1 MB or smaller.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setForm(prev => ({ ...prev, imageUrl: reader.result }))
      setImageStatus(`Uploaded ${file.name}`)
    }
    reader.onerror = () => setImageStatus('Could not read this image.')
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')

    try {
      const payload = toPayload(form)
      if (isEditing) {
        await updateHotel(editingId, payload)
        setMsg('Hotel updated')
      } else {
        await createHotel(payload)
        setMsg('Hotel created')
      }
      resetForm()
      await fetchHotels()
    } catch (err) {
      setMsg(getApiErrorMessage(err, isEditing ? 'Update failed' : 'Create failed'))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hotel?')) return
    setMsg('')
    try {
      await deleteHotel(id)
      if (editingId === id) resetForm()
      await fetchHotels()
      setMsg('Hotel deleted')
    } catch (err) {
      setMsg(getApiErrorMessage(err, 'Delete failed'))
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Hotel management</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-dark">Admin Panel</h1>
        </div>
        {isEditing && (
          <button
            type="button"
            onClick={resetForm}
            className="self-start rounded-full border border-stone-300 px-5 py-2 text-sm font-bold text-dark transition-colors hover:border-primary hover:text-primary md:self-auto"
          >
            Cancel edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[460px_1fr]">
        <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-dark">{isEditing ? 'Edit hotel' : 'Add hotel'}</h2>
          <p className="mt-1 text-sm text-gray-500">
            Use an image URL or upload a small image file. Uploaded files are saved with the hotel record.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Hotel name" value={form.name} onChange={value => setForm({ ...form, name: value })} required />
              <Field label="Location" value={form.location} onChange={value => setForm({ ...form, location: value })} required />
            </div>

            <div>
              <label className="text-sm font-bold text-dark">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="mt-2 w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Price per night" type="number" value={form.pricePerNight} onChange={value => setForm({ ...form, pricePerNight: value })} required min="1" />
              <Field label="Rating" type="number" value={form.rating} onChange={value => setForm({ ...form, rating: value })} min="0" max="5" step="0.1" />
              <Field label="Total rooms" type="number" value={form.totalRooms} onChange={value => setForm({ ...form, totalRooms: value })} min="0" />
              <Field label="Available rooms" type="number" value={form.availableRooms} onChange={value => setForm({ ...form, availableRooms: value })} min="0" />
            </div>

            <div>
              <label className="text-sm font-bold text-dark">Amenities</label>
              <input
                type="text"
                value={form.amenities}
                onChange={e => setForm({ ...form, amenities: e.target.value })}
                placeholder="Free Wi-Fi, Pool, Parking"
                className="mt-2 w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-dark">Image URL</label>
              <input
                type="url"
                value={form.imageUrl.startsWith('data:') ? '' : form.imageUrl}
                onChange={e => {
                  setForm({ ...form, imageUrl: e.target.value })
                  setImageStatus('')
                }}
                placeholder="https://example.com/hotel.jpg"
                className="mt-2 w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[140px_1fr]">
              <img
                src={previewSrc}
                alt="Hotel preview"
                onError={(e) => {
                  e.currentTarget.src = fallbackImage
                  setImageStatus('Image URL could not be loaded. Check the link or upload a file.')
                }}
                className="h-28 w-full rounded-lg border border-stone-200 object-cover"
              />
              <div>
                <label className="block text-sm font-bold text-dark">Upload image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleImageFile(e.target.files?.[0])}
                  className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-teal-800"
                />
                {imageStatus && <p className="mt-2 text-sm text-gray-500">{imageStatus}</p>}
              </div>
            </div>

            {msg && (
              <p className={`rounded-lg px-4 py-3 text-sm font-semibold ${msg.includes('failed') || msg.includes('Could') ? 'bg-red-50 text-red-600' : 'bg-teal-50 text-teal-700'}`}>
                {msg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-white transition-colors hover:bg-teal-800 disabled:opacity-60"
            >
              {loading ? 'Saving...' : isEditing ? 'Update hotel' : 'Create hotel'}
            </button>
          </form>
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-dark">All hotels ({hotels.length})</h2>
            <button
              type="button"
              onClick={fetchHotels}
              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:border-primary hover:text-primary"
            >
              Refresh
            </button>
          </div>

          {listLoading ? (
            <div className="rounded-lg bg-white p-8 text-center text-gray-500">Loading hotels...</div>
          ) : (
            <div className="space-y-3">
              {hotels.map(hotel => (
                <article key={hotel.id} className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <img
                      src={hotel.imageUrl || fallbackImage}
                      alt={hotel.name}
                      onError={(e) => { e.currentTarget.src = fallbackImage }}
                      className="h-28 w-full rounded-lg object-cover sm:w-32"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-lg font-bold text-dark">{hotel.name}</h3>
                      <p className="text-sm font-medium text-gray-500">{hotel.location}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        Rs. {hotel.pricePerNight?.toLocaleString()}/night - {hotel.rating} rating - {hotel.availableRooms} rooms left
                      </p>
                      <p className="mt-2 max-h-10 overflow-hidden text-sm text-gray-500">{hotel.description}</p>
                    </div>
                    <div className="flex gap-2 sm:flex-col">
                      <button
                        type="button"
                        onClick={() => handleEdit(hotel)}
                        className="rounded-full border border-stone-300 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:border-primary hover:text-primary"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(hotel.id)}
                        className="rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-500 transition-colors hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function Field({ label, value, onChange, type = 'text', required = false, ...props }) {
  return (
    <div>
      <label className="text-sm font-bold text-dark">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
        {...props}
      />
    </div>
  )
}
