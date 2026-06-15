import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrency } from '@/hooks/useCurrency'
import { useProfile } from '@/hooks/useProfile'
import type { BucketSummary } from '@/types'

interface DonutSummaryProps {
  summaries: BucketSummary[]
  isLoading?: boolean
}

export function DonutSummary({ summaries, isLoading }: DonutSummaryProps) {
  const { format } = useCurrency()
  const { data: profile } = useProfile()
  const monthlyIncomeUSD = profile?.monthly_income ?? 0
  const totalSpent = summaries.reduce((sum, s) => sum + s.spent, 0)
  const remaining = Math.max(monthlyIncomeUSD - totalSpent, 0)
  const percent = monthlyIncomeUSD > 0 ? Math.round((totalSpent / monthlyIncomeUSD) * 100) : 0

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
            <p className="font-semibold tabular-nums">{format(totalSpent)}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-xs">Remaining</p>
            <p className="font-semibold tabular-nums">{format(remaining)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
