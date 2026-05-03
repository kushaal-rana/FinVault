import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { queryClient } from '@/lib/queryClient'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import App from './App'
import './index.css'

function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const { setSession, setLoading } = useAuthStore()

  useEffect(() => {
    // Hydrate from cache, then verify with server (getSession is cache-only)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { error } = await supabase.auth.getUser()
        if (error) {
          await supabase.auth.signOut()
          setSession(null)
          return
        }
      }
      setSession(session)
    })

    // Keep in sync with auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [setSession, setLoading])

  return <>{children}</>
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthBootstrap>
          <App />
          <Toaster richColors position="top-right" />
        </AuthBootstrap>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)
