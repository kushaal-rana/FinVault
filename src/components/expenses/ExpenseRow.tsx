import { Trash2, Pencil } from 'lucide-react'
import { BucketBadge } from '@/components/shared/BucketBadge'
import { CategoryBadge } from '@/components/shared/CategoryBadge'
import { formatCurrency, formatShortDate } from '@/lib/utils'
import { EXPENSE_TYPE_LABELS } from '@/constants/categories'
import { cn } from '@/lib/utils'
import { BUCKET_CONFIG } from '@/constants/buckets'
import type { Expense } from '@/types'

interface ExpenseRowProps {
  expense: Expense
  onDelete: (id: string) => void
  onEdit: (expense: Expense) => void
  variant: 'table' | 'card'
}

export function ExpenseRow({ expense, onDelete, onEdit, variant }: ExpenseRowProps) {
  const bucketColor = BUCKET_CONFIG[expense.bucket]?.color ?? '#64748b'

  if (variant === 'card') {
    return (
      <div
        className="flex items-center gap-3 rounded-lg border bg-card p-3 hover:shadow-sm transition-shadow"
        style={{ borderLeftColor: bucketColor, borderLeftWidth: 3 }}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium truncate">{expense.description}</span>
            {expense.expense_type !== 'own' && (
              <span className="text-xs text-muted-foreground">
                ({EXPENSE_TYPE_LABELS[expense.expense_type]})
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <BucketBadge bucket={expense.bucket} size="sm" />
            <CategoryBadge category={expense.category} />
            <span className="text-xs text-muted-foreground">{formatShortDate(expense.date)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-sm font-semibold tabular-nums mr-1">{formatCurrency(expense.amount)}</span>
          <button
            onClick={() => onEdit(expense)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
            aria-label="Edit expense"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded"
            aria-label="Delete expense"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    )
  }

  // Table row variant
  return (
    <tr className="border-b last:border-0 hover:bg-muted/30 transition-colors">
      <td className="py-3 px-4 text-sm text-muted-foreground whitespace-nowrap">
        {formatShortDate(expense.date)}
      </td>
      <td className="py-3 px-4">
        <span className="text-sm font-medium">{expense.description}</span>
        {expense.notes && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">{expense.notes}</p>
        )}
      </td>
      <td className="py-3 px-4">
        <CategoryBadge category={expense.category} />
      </td>
      <td className="py-3 px-4">
        <BucketBadge bucket={expense.bucket} size="sm" />
      </td>
      <td className="py-3 px-4">
        <span className={cn(
          'text-xs font-medium px-2 py-0.5 rounded-full',
          expense.expense_type === 'pending' ? 'bg-amber-50 text-amber-700' :
          expense.expense_type === 'split' ? 'bg-blue-50 text-blue-700' :
          'bg-secondary text-secondary-foreground'
        )}>
          {EXPENSE_TYPE_LABELS[expense.expense_type]}
        </span>
      </td>
      <td className="py-3 px-4 text-right">
        <span className="text-sm font-semibold tabular-nums">{formatCurrency(expense.amount)}</span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(expense)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
            aria-label="Edit expense"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded"
            aria-label="Delete expense"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  )
}
