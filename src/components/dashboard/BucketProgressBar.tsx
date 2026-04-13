import { cn } from '@/lib/utils'

interface BucketProgressBarProps {
  spent: number
  allocated: number
  color: string
  className?: string
}

export function BucketProgressBar({ spent, allocated, color, className }: BucketProgressBarProps) {
  const percent = allocated > 0 ? Math.min((spent / allocated) * 100, 100) : 0
  const isWarning = percent >= 75 && percent < 90
  const isDanger = percent >= 90

  return (
    <div className={cn('h-2 w-full rounded-full bg-secondary overflow-hidden', className)}>
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${percent}%`,
          backgroundColor: isDanger ? '#ef4444' : isWarning ? '#f59e0b' : color,
        }}
      />
    </div>
  )
}
