import { ExpenseRow } from './ExpenseRow'
import { formatCurrency } from '@/lib/utils'
import type { Expense } from '@/types'

interface ExpenseTableProps {
  expenses: Expense[]
  onDelete: (id: string) => void
  onEdit: (expense: Expense) => void
}

export function ExpenseTable({ expenses, onDelete, onEdit }: ExpenseTableProps) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40">
            <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
            <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Description</th>
            <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Category</th>
            <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Bucket</th>
            <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</th>
            <th className="py-3 px-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Amount</th>
            <th className="py-3 px-4 w-10" />
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <ExpenseRow key={expense.id} expense={expense} onDelete={onDelete} onEdit={onEdit} variant="table" />
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t bg-muted/40">
            <td colSpan={5} className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Total · {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
            </td>
            <td className="py-3 px-4 text-right text-sm font-bold tabular-nums">
              {formatCurrency(total)}
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
