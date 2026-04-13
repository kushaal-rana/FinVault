import { BucketCard } from './BucketCard'
import { Skeleton } from '@/components/ui/skeleton'
import { BUCKET_ORDER } from '@/constants/buckets'
import type { BucketSummary } from '@/types'

interface BucketGridProps {
  summaries: BucketSummary[]
  isLoading?: boolean
}

export function BucketGrid({ summaries, isLoading }: BucketGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    )
  }

  const summaryMap = new Map(summaries.map((s) => [s.bucket, s]))

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {BUCKET_ORDER.map((bucket) => {
        const summary = summaryMap.get(bucket)
        return (
          <BucketCard
            key={bucket}
            bucket={bucket}
            allocated={summary?.allocated ?? 0}
            spent={summary?.spent ?? 0}
          />
        )
      })}
    </div>
  )
}
