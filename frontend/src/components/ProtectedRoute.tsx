import { Navigate } from 'react-router-dom'
import { getAuth, isAdminOrGod } from '../api'

interface Props {
  children: React.ReactNode
  adminOnly?: boolean
}

export default function ProtectedRoute({ children, adminOnly = false }: Props) {
  const auth = getAuth()

  if (!auth) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && !isAdminOrGod()) {
    return <Navigate to="/plans" replace />
  }

  return <>{children}</>
}
