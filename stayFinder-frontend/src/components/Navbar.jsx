import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl font-bold text-dark">
          Stay<span className="text-primary">Finder</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/search" className="text-gray-600 hover:text-dark transition-colors text-sm font-medium">
            Explore
          </Link>

          {user ? (
            <>
              <Link to="/bookings" className="text-gray-600 hover:text-dark transition-colors text-sm font-medium">
                My Bookings
              </Link>
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="text-gray-600 hover:text-dark transition-colors text-sm font-medium">
                  Admin
                </Link>
              )}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-400 text-white text-sm px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-dark transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-blue-700 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
