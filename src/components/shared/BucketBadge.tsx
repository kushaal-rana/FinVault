import { cn } from '@/lib/utils'
import { BUCKET_CONFIG } from '@/constants/buckets'
import type { BucketKey } from '@/types'

interface BucketBadgeProps {
  bucket: BucketKey
  size?: 'sm' | 'md'
  className?: string
}

export function BucketBadge({ bucket, size = 'md', className }: BucketBadgeProps) {
  const config = BUCKET_CONFIG[bucket]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        config.lightBg,
        config.textColor,
        className
      )}
    >
      <span>{config.icon}</span>
      {config.shortLabel}
    </span>
  )
}
