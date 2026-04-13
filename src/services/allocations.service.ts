import { supabase } from '@/lib/supabase'
import type { BucketAllocation, AllocationUpsert } from '@/types'
import type { BucketKey } from '@/types'
import { DEFAULT_MONTHLY_ALLOCATIONS } from '@/constants/buckets'

export async function getAllocationsByMonth(month: string): Promise<BucketAllocation[]> {
  const { data, error } = await supabase
    .from('bucket_allocations')
    .select('*')
    .eq('month', month)
    .order('bucket')

  if (error) throw error

  // If no allocations exist for this month, seed from defaults
  if (!data || data.length === 0) {
    return seedDefaultAllocations(month)
  }

  return data as BucketAllocation[]
}

async function seedDefaultAllocations(month: string): Promise<BucketAllocation[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const inserts: AllocationUpsert[] = (Object.keys(DEFAULT_MONTHLY_ALLOCATIONS) as BucketKey[]).map(
    (bucket) => ({
      month,
      bucket,
      amount: DEFAULT_MONTHLY_ALLOCATIONS[bucket],
    })
  )

  const { data, error } = await supabase
    .from('bucket_allocations')
    .upsert(inserts.map((i) => ({ ...i, user_id: user.id })), {
      onConflict: 'user_id,month,bucket',
    })
    .select()

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
