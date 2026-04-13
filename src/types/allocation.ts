import type { BucketKey } from './bucket'

export interface BucketAllocation {
  id: string
  user_id: string
  month: string
  bucket: BucketKey
  amount: number
  created_at: string
  updated_at: string
}

export interface AllocationUpsert {
  month: string
  bucket: BucketKey
  amount: number
}
