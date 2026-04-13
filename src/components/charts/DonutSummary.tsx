import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import { ChartTooltip } from './ChartTooltip'
import { DEFAULT_MONTHLY_INCOME } from '@/constants/buckets'
import type { BucketSummary } from '@/types'

interface DonutSummaryProps {
  summaries: BucketSummary[]
  isLoading?: boolean
}

export function DonutSummary({ summaries, isLoading }: DonutSummaryProps) {
  const totalSpent = summaries.reduce((sum, s) => sum + s.spent, 0)
  const remaining = Math.max(DEFAULT_MONTHLY_INCOME - totalSpent, 0)
  const percent = Math.round((totalSpent / DEFAULT_MONTHLY_INCOME) * 100)

  const data = [
    { name: 'Spent', value: totalSpent, color: '#1e293b' },
    { name: 'Remaining', value: remaining, color: '#e2e8f0' },
  ]

  if (isLoading) return <Skeleton className="h-52 rounded-xl" />

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Monthly Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={72}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold tabular-nums">{percent}%</span>
            <span className="text-xs text-muted-foreground">used</span>
          </div>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Spent</p>
            <p className="font-semibold tabular-nums">{formatCurrency(totalSpent)}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-xs">Remaining</p>
            <p className="font-semibold tabular-nums">{formatCurrency(remaining)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
