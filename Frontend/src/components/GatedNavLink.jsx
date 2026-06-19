import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Nav link that requires sign-in: logged-in users go straight to `to`,
// logged-out users are sent to /login and bounced to `to` after auth.
export default function GatedNavLink({ to, className, style, onClick, children }) {
  const { user } = useAuth()

  return (
    <Link
      to={user ? to : '/login'}
      state={user ? undefined : { from: to }}
      className={className}
      style={style}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}
