import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as loginApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await loginApi(form)
      login(res.data, res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl p-10 shadow-sm w-full max-w-md">
        <h1 className="font-display text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-gray-400 text-sm mb-8">Login to your StayFinder account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          No account?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
        </p>

        <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-400 text-center">
          Admin: admin@stayfinder.com / admin123
        </div>
      </div>
    </div>
  )
}
