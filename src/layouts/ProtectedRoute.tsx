import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, isLoading } = useAuthStore()

  if (isLoading) return <LoadingSpinner fullPage />
  if (!session) return <Navigate to="/login" replace />

  return <>{children}</>
}
