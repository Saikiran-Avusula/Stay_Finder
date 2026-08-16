import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-dark' : 'text-gray-600 hover:text-dark'
    }`

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl font-bold text-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 rounded-lg">
          Stay<span className="text-primary">Finder</span>
        </Link>

        <div className="flex items-center gap-6">
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
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{user.name}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-red-400 text-white text-sm px-4 py-2 rounded-full hover:bg-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70 focus-visible:ring-offset-2"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <Link to="/register" className="bg-blue-700 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
