import { supabase } from '@/lib/supabase'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
}

export async function getProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, avatar_url')
    .eq('id', user.id)
    .single()

  if (error) return null
  return data as Profile
}

export async function updateProfile(updates: { full_name?: string }): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', user.id)

  if (error) throw error
}
