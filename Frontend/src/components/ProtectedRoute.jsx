import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (role && user.accountType !== role) return <Navigate to="/" replace />

  return children
}
