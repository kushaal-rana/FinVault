import { ExpenseRow } from './ExpenseRow'
import type { Expense } from '@/types'

interface ExpenseListProps {
  expenses: Expense[]
  onDelete: (id: string) => void
  onEdit: (expense: Expense) => void
}

export function ExpenseList({ expenses, onDelete, onEdit }: ExpenseListProps) {
  return (
    <div className="space-y-2">
      {expenses.map((expense) => (
        <ExpenseRow key={expense.id} expense={expense} onDelete={onDelete} onEdit={onEdit} variant="card" />
      ))}
    </div>
  )
}
