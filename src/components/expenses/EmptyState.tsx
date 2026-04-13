import { Button } from '@/components/ui/button'
import { useUIStore } from '@/store/uiStore'

interface EmptyStateProps {
  filtered?: boolean
}

export function EmptyState({ filtered }: EmptyStateProps) {
  const { openAddExpense, resetExpenseFilters } = useUIStore()

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <p className="text-5xl">{filtered ? '🔍' : '📭'}</p>
      <h3 className="text-base font-semibold">
        {filtered ? 'No matching expenses' : 'No expenses yet'}
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        {filtered
          ? 'Try adjusting your filters to see more results.'
          : 'Start tracking your spending by logging your first expense.'}
      </p>
      {filtered ? (
        <Button variant="outline" size="sm" onClick={resetExpenseFilters}>
          Clear filters
        </Button>
      ) : (
        <Button size="sm" onClick={() => openAddExpense()}>
          Add first expense
        </Button>
      )}
    </div>
  )
}
