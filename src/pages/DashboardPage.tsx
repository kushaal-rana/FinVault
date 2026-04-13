import { useMemo } from 'react'
import { useUIStore } from '@/store/uiStore'
import { useBucketAllocations } from '@/hooks/useBucketAllocations'
import { useMonthlyTotals } from '@/hooks/useMonthlyTotals'
import { IncomeHeader } from '@/components/dashboard/IncomeHeader'
import { BucketGrid } from '@/components/dashboard/BucketGrid'
import { RecentExpenses } from '@/components/dashboard/RecentExpenses'
import { DonutSummary } from '@/components/charts/DonutSummary'
import { SpendingPieChart } from '@/components/charts/SpendingPieChart'
import { MonthlyBarChart } from '@/components/charts/MonthlyBarChart'
import type { BucketSummary } from '@/types'

export function DashboardPage() {
  const { activeMonth } = useUIStore()
  const { data: allocations, isLoading: allocLoading } = useBucketAllocations(activeMonth)
  const { data: totals, isLoading: totalsLoading } = useMonthlyTotals(activeMonth)

  const isLoading = allocLoading || totalsLoading

  const summaries = useMemo<BucketSummary[]>(() => {
    if (!allocations) return []
    return allocations.map((alloc) => {
      const total = totals?.find((t) => t.bucket === alloc.bucket)?.total ?? 0
      const allocated = alloc.amount
      const spent = total
      const remaining = allocated - spent
      const percentUsed = allocated > 0 ? (spent / allocated) * 100 : 0
      return { bucket: alloc.bucket, allocated, spent, remaining, percentUsed }
    })
  }, [allocations, totals])

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header — income + buffer */}
      <IncomeHeader month={activeMonth} summaries={summaries} isLoading={isLoading} />

      {/* Bucket cards */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Buckets
        </h2>
        <BucketGrid summaries={summaries} isLoading={isLoading} />
      </section>

      {/* Charts row */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DonutSummary summaries={summaries} isLoading={isLoading} />
          <SpendingPieChart summaries={summaries} isLoading={isLoading} />
        </div>
      </section>

      {/* 6-month trend */}
      <MonthlyBarChart />

      {/* Recent transactions */}
      <RecentExpenses month={activeMonth} />
    </div>
  )
}
