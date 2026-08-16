import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const navLinkClass = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
      isActive ? 'bg-teal-50 text-primary' : 'text-gray-600 hover:bg-gray-100 hover:text-dark'
    }`

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="font-display text-2xl font-bold text-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
        >
          Stay<span className="text-primary">Finder</span>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <NavLink to="/search" className={navLinkClass}>
            Explore
          </NavLink>

          {user ? (
            <>
              <NavLink to="/bookings" className={navLinkClass}>
                My Bookings
              </NavLink>
              {user.role === 'ADMIN' && (
                <NavLink to="/admin" className={navLinkClass}>
                  Admin
                </NavLink>
              )}
              <span className="hidden max-w-32 truncate text-sm text-gray-500 sm:inline">{user.name}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <Link
                to="/register"
                className="rounded-full bg-dark px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
