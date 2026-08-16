import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getApiErrorMessage, login as loginApi } from '../services/api'
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
      setError(getApiErrorMessage(err, 'Login failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl grid-cols-1 items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_440px]">
      <section className="hidden lg:block">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Welcome back</p>
        <h1 className="mt-3 font-display text-5xl font-bold leading-tight text-dark">
          Manage your stays from one clean dashboard.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600">
          Sign in to book rooms, review upcoming trips, and manage cancellations without calling the hotel desk.
        </p>
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-display text-3xl font-bold text-dark">Login</h2>
        <p className="mt-2 text-sm text-gray-500">Use your StayFinder account details.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-bold text-dark">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="mt-2 w-full rounded-lg border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-dark">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="mt-2 w-full rounded-lg border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-white transition-colors hover:bg-teal-800 disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          No account?{' '}
          <Link to="/register" className="font-bold text-primary hover:underline">Sign up</Link>
        </p>

        <div className="mt-5 rounded-lg bg-stone-50 p-4 text-sm text-gray-600">
          <p className="font-bold text-dark">Demo admin</p>
          <p>admin@stayfinder.com / admin123</p>
        </div>
      </section>
    </main>
  )
}
