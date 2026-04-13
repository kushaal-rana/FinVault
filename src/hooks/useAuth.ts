import { useAuthStore } from '@/store/authStore'
import { signInWithPassword, sendMagicLink, signOut as signOutService } from '@/services/auth.service'
import { queryClient } from '@/lib/queryClient'

export function useAuth() {
  const { session, user, isLoading, setSession } = useAuthStore()

  async function login(email: string, password: string) {
    return signInWithPassword(email, password)
  }

  async function sendLink(email: string) {
    return sendMagicLink(email)
  }

  async function signOut() {
    await signOutService()
    setSession(null)
    queryClient.clear()
  }

  return { session, user, isLoading, login, sendLink, signOut }
}
