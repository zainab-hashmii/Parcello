import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const dashboardPath =
    user?.accountType === 'Admin'
      ? '/admin'
      : user?.accountType === 'Rider'
      ? '/rider'
      : '/customer'

  return (
    <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-brand">
          <span className="inline-block h-3 w-3 rounded-full bg-brand" />
          Parcello
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to={dashboardPath} className="text-sm font-medium text-ink hover:text-brand">
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout()
                  navigate('/')
                }}
                className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-brand hover:bg-orange-100"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-ink hover:text-brand">
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
