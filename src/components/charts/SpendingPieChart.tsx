import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BUCKET_CONFIG } from '@/constants/buckets'
import { formatCurrency } from '@/lib/utils'
import { ChartTooltip } from './ChartTooltip'
import type { BucketSummary } from '@/types'

interface SpendingPieChartProps {
  summaries: BucketSummary[]
  isLoading?: boolean
}

export function SpendingPieChart({ summaries, isLoading }: SpendingPieChartProps) {
  const data = summaries
    .filter((s) => s.spent > 0)
    .map((s) => ({
      name: BUCKET_CONFIG[s.bucket].shortLabel,
      value: s.spent,
      color: BUCKET_CONFIG[s.bucket].color,
    }))

  if (isLoading) return <Skeleton className="h-52 rounded-xl" />

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Spending by Bucket</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-40 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No spending data yet</p>
          </div>
        ) : (
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={65}
                  dataKey="value"
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {data.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        {/* Custom legend */}
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-1.5 text-xs">
              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground truncate">{entry.name}</span>
              <span className="ml-auto font-medium tabular-nums">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
