import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BUCKET_CONFIG, BUCKET_ORDER } from '@/constants/buckets'
import { getShortMonthLabel } from '@/lib/utils'
import { useLast6MonthsTotals } from '@/hooks/useLast6MonthsTotals'
import { ChartTooltip } from './ChartTooltip'
import type { BucketKey } from '@/types'

export function MonthlyBarChart() {
  const { data: result, isLoading } = useLast6MonthsTotals()

  if (isLoading) return <Skeleton className="h-64 rounded-xl" />

  if (!result) return null

  const { data, months } = result

  // Build chart data: one entry per month with bucket totals
  const chartData = months.map((month) => {
    const entry: Record<string, string | number> = { month: getShortMonthLabel(month) }
    for (const bucket of BUCKET_ORDER) {
      const found = data.find((d) => d.month === month && d.bucket === bucket)
      entry[bucket] = found?.total ?? 0
    }
    return entry
  })

  const hasData = data.length > 0

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">6-Month Spending Trend</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="h-48 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No data yet — start logging expenses</p>
          </div>
        ) : (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={28} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }} />
                {BUCKET_ORDER.map((bucket: BucketKey) => (
                  <Bar
                    key={bucket}
                    dataKey={bucket}
                    stackId="a"
                    fill={BUCKET_CONFIG[bucket].color}
                    name={BUCKET_CONFIG[bucket].shortLabel}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
