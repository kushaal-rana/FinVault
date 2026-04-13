import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BucketBadge } from '@/components/shared/BucketBadge'
import { formatCurrency, formatShortDate } from '@/lib/utils'
import { useRecentExpenses } from '@/hooks/useExpenses'

interface RecentExpensesProps {
  month: string
}

export function RecentExpenses({ month }: RecentExpensesProps) {
  const { data: expenses, isLoading } = useRecentExpenses(month)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Recent Transactions</CardTitle>
          <Link to="/expenses" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : !expenses?.length ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-2xl mb-2">📭</p>
            <p className="text-sm text-muted-foreground">No expenses yet this month</p>
            <p className="text-xs text-muted-foreground mt-1">Click "Add Expense" to get started</p>
          </div>
        ) : (
          <div className="space-y-1">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between rounded-lg px-2 py-2.5 hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <BucketBadge bucket={expense.bucket} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{expense.description}</p>
                    <p className="text-xs text-muted-foreground">{formatShortDate(expense.date)}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold tabular-nums shrink-0 ml-3">
                  {formatCurrency(expense.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
