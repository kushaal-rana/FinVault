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
        'inline-flex items-center justify-center gap-1 rounded-full font-medium whitespace-nowrap shrink-0',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs min-w-[88px]' : 'px-3 py-1 text-xs min-w-[96px]',
        className
      )}
      style={{
        backgroundColor: `${config.color}22`,
        color: config.color,
        border: `1px solid ${config.color}44`,
      }}
    >
      <span className="text-[11px] leading-none">{config.icon}</span>
      {config.shortLabel}
    </span>
  )
}
