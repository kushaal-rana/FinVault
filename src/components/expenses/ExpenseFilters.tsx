import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MonthPicker } from '@/components/shared/MonthPicker'
import { BUCKET_CONFIG, BUCKET_ORDER } from '@/constants/buckets'
import { CATEGORY_LABELS, EXPENSE_TYPE_LABELS } from '@/constants/categories'
import { CATEGORY_KEYS, EXPENSE_TYPE_KEYS } from '@/types'
import { useUIStore } from '@/store/uiStore'
import type { BucketKey, CategoryKey, ExpenseType } from '@/types'

interface ExpenseFiltersProps {
  totalCount: number
  filteredCount: number
}

export function ExpenseFilters({ totalCount, filteredCount }: ExpenseFiltersProps) {
  const { activeMonth, setActiveMonth, expenseFilters, setExpenseFilters, resetExpenseFilters } = useUIStore()

  const hasActiveFilters = !!(expenseFilters.bucket || expenseFilters.category || expenseFilters.expense_type)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <MonthPicker month={activeMonth} onChange={setActiveMonth} />

        <div className="w-36">
          <Select
            value={expenseFilters.bucket ?? 'all'}
            onValueChange={(v) => setExpenseFilters({ bucket: v === 'all' ? null : v as BucketKey })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="All buckets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All buckets</SelectItem>
              {BUCKET_ORDER.map((key) => (
                <SelectItem key={key} value={key}>
                  {BUCKET_CONFIG[key].icon} {BUCKET_CONFIG[key].shortLabel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-36">
          <Select
            value={expenseFilters.category ?? 'all'}
            onValueChange={(v) => setExpenseFilters({ category: v === 'all' ? null : v as CategoryKey })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORY_KEYS.map((key) => (
                <SelectItem key={key} value={key}>{CATEGORY_LABELS[key]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-28">
          <Select
            value={expenseFilters.expense_type ?? 'all'}
            onValueChange={(v) => setExpenseFilters({ expense_type: v === 'all' ? null : v as ExpenseType })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {EXPENSE_TYPE_KEYS.map((key) => (
                <SelectItem key={key} value={key}>{EXPENSE_TYPE_LABELS[key]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs" onClick={resetExpenseFilters}>
            <X className="h-3 w-3" />
            Clear filters
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {hasActiveFilters
          ? `${filteredCount} of ${totalCount} expenses`
          : `${totalCount} expense${totalCount !== 1 ? 's' : ''}`}
      </p>
    </div>
  )
}
