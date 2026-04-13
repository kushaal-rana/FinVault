import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { BucketProgressBar } from './BucketProgressBar'
import { BUCKET_CONFIG } from '@/constants/buckets'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/uiStore'
import type { BucketKey } from '@/types'

interface BucketCardProps {
  bucket: BucketKey
  allocated: number
  spent: number
}

export function BucketCard({ bucket, allocated, spent }: BucketCardProps) {
  const config = BUCKET_CONFIG[bucket]
  const remaining = allocated - spent
  const percent = allocated > 0 ? Math.min(Math.round((spent / allocated) * 100), 100) : 0
  const isOver = spent > allocated
  const navigate = useNavigate()
  const { setExpenseFilters } = useUIStore()

  function handleClick() {
    setExpenseFilters({ bucket })
    navigate('/expenses')
  }

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-l-4',
        `border-l-[${config.color}]`
      )}
      style={{ borderLeftColor: config.color }}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-base">{config.icon}</span>
              <span className="text-sm font-semibold text-foreground">{config.label}</span>
            </div>
            <p className="text-xs text-muted-foreground">{config.description}</p>
          </div>
          <span
            className={cn('text-xs font-bold tabular-nums', isOver ? 'text-red-500' : 'text-muted-foreground')}
          >
            {percent}%
          </span>
        </div>

        <div className="space-y-2">
          <BucketProgressBar spent={spent} allocated={allocated} color={config.color} />
          <div className="flex items-center justify-between text-xs">
            <span className="tabular-nums font-semibold text-foreground">{formatCurrency(spent)} spent</span>
            <span className={cn('tabular-nums font-medium', isOver ? 'text-red-500' : 'text-muted-foreground')}>
              {isOver ? `-${formatCurrency(Math.abs(remaining))} over` : `${formatCurrency(remaining)} left`}
              {' / '}{formatCurrency(allocated)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
