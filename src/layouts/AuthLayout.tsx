import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export function AuthLayout() {
  const { session, isLoading } = useAuthStore()

  if (isLoading) return <LoadingSpinner fullPage />
  if (session) return <Navigate to="/" replace />

  return (
    <div className="min-h-svh flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white text-xs font-bold mb-4 shadow-lg shadow-indigo-600/25 tracking-wide">
            PM
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">PMDSPM Tracker</h1>
          <p className="text-sm text-muted-foreground mt-1">Your money, beautifully tracked</p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
