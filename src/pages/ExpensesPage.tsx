import { useState } from 'react'
import { useExpenses } from '@/hooks/useExpenses'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useUIStore } from '@/store/uiStore'
import { ExpenseFilters } from '@/components/expenses/ExpenseFilters'
import { ExpenseTable } from '@/components/expenses/ExpenseTable'
import { ExpenseList } from '@/components/expenses/ExpenseList'
import { EmptyState } from '@/components/expenses/EmptyState'
import { DeleteExpenseDialog } from '@/components/expenses/DeleteExpenseDialog'
import { EditExpenseDialog } from '@/components/expenses/EditExpenseDialog'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import type { Expense } from '@/types'

export function ExpensesPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editExpense, setEditExpense] = useState<Expense | null>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const { activeMonth, expenseFilters } = useUIStore()

  const filters = {
    month: activeMonth,
    bucket: expenseFilters.bucket ?? undefined,
    category: expenseFilters.category ?? undefined,
    expense_type: expenseFilters.expense_type ?? undefined,
  }

  const { data: allExpenses } = useExpenses({ month: activeMonth })
  const { data: filteredExpenses, isLoading } = useExpenses(filters)

  const totalCount = allExpenses?.length ?? 0
  const filteredCount = filteredExpenses?.length ?? 0
  const hasActiveFilters = !!(expenseFilters.bucket || expenseFilters.category || expenseFilters.expense_type)
  const displayedExpenses = hasActiveFilters ? (filteredExpenses ?? []) : (allExpenses ?? [])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Track and manage your spending</p>
      </div>

      <ExpenseFilters
        totalCount={totalCount}
        filteredCount={hasActiveFilters ? filteredCount : totalCount}
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner />
        </div>
      ) : displayedExpenses.length === 0 ? (
        <EmptyState filtered={hasActiveFilters} />
      ) : isMobile ? (
        <ExpenseList expenses={displayedExpenses} onDelete={setDeleteId} onEdit={setEditExpense} />
      ) : (
        <ExpenseTable expenses={displayedExpenses} onDelete={setDeleteId} onEdit={setEditExpense} />
      )}

      <DeleteExpenseDialog
        expenseId={deleteId}
        onClose={() => setDeleteId(null)}
      />
      <EditExpenseDialog
        expense={editExpense}
        onClose={() => setEditExpense(null)}
      />
    </div>
  )
}
