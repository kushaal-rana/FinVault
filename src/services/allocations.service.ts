import { supabase } from '@/lib/supabase'
import type { BucketAllocation, AllocationUpsert } from '@/types'

export async function getAllocationsByMonth(month: string): Promise<BucketAllocation[]> {
  const { data, error } = await supabase
    .from('bucket_allocations')
    .select('*')
    .eq('month', month)
    .order('bucket')

  if (error) throw error
  return (data ?? []) as BucketAllocation[]
}

export async function upsertAllocations(allocations: AllocationUpsert[]): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('bucket_allocations')
    .upsert(
      allocations.map((a) => ({ ...a, user_id: user.id })),
      { onConflict: 'user_id,month,bucket' }
    )

  if (error) throw error
}
