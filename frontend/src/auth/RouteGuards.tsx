import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './auth-context'

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center text-muted-foreground" role="status">
      Loading…
    </div>
  )
}

export function ProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) return <Loading />
  return user ? <Outlet /> : <Navigate to="/signin" replace />
}

export function PublicOnlyRoute() {
  const { user, loading } = useAuth()
  if (loading) return <Loading />
  return user ? <Navigate to="/" replace /> : <Outlet />
}
