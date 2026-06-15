import { cn } from '@/lib/utils'

interface BucketProgressBarProps {
  spent: number
  allocated: number
  color: string
  className?: string
}

export function BucketProgressBar({ spent, allocated, color, className }: BucketProgressBarProps) {
  const rawPercent = allocated > 0 ? (spent / allocated) * 100 : 0
  const barWidth = Math.min(rawPercent, 100)
  // Amber when close to budget (90–100%), red only when truly over (>100%)
  const isOver = rawPercent > 100
  const isClose = rawPercent >= 90 && rawPercent <= 100

  return (
    <div className={cn('h-2 w-full rounded-full bg-secondary overflow-hidden', className)}>
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${barWidth}%`,
          backgroundColor: isOver ? '#ef4444' : isClose ? '#f59e0b' : color,
        }}
      />
    </div>
  )
}
