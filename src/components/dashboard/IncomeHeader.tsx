import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, getMonthLabel } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import type { BucketSummary } from '@/types'

interface IncomeHeaderProps {
  month: string
  summaries: BucketSummary[]
  isLoading?: boolean
}

export function IncomeHeader({ month, summaries, isLoading }: IncomeHeaderProps) {
  const totalIncome = summaries.reduce((sum, s) => sum + s.allocated, 0)
  const totalSpent = summaries.reduce((sum, s) => sum + s.spent, 0)
  const remaining = totalIncome - totalSpent
  const overallPercent = totalIncome > 0 ? Math.round((totalSpent / totalIncome) * 100) : 0

  if (isLoading) {
    return <Skeleton className="h-28 rounded-xl" />
  }

  if (totalIncome === 0) {
    return (
      <Card className="bg-gradient-to-r from-slate-900 to-slate-700 text-white border-0">
        <CardContent className="p-5">
          <p className="text-slate-400 text-sm font-medium mb-1">{getMonthLabel(month)}</p>
          <p className="text-slate-300 text-sm">
            No allocations set for this month.{' '}
            <span className="text-white font-medium">Go to Settings to set up your buckets.</span>
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-r from-slate-900 to-slate-700 text-white border-0">
      <CardContent className="p-5">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">{getMonthLabel(month)}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums">{formatCurrency(totalSpent)}</span>
              <span className="text-slate-400 text-sm">spent of {formatCurrency(totalIncome)}</span>
            </div>
            <div className="mt-2 h-1.5 w-48 rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-white/80 transition-all duration-700"
                style={{ width: `${Math.min(overallPercent, 100)}%` }}
              />
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-xs mb-1">Remaining</p>
            <p className="text-xl font-bold tabular-nums">{formatCurrency(remaining)}</p>
            <p className="text-slate-400 text-xs">{overallPercent}% of income used</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
