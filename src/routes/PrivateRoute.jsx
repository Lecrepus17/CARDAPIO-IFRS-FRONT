import { Navigate, Outlet } from 'react-router-dom'

export default function PrivateRoute({ requiredRole }) {
  const token = localStorage.getItem('@CardapioIFRS:token') || localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const userRole = (user?.role || '').toUpperCase()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && userRole !== requiredRole.toUpperCase()) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}