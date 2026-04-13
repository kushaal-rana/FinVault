import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryClient'
import { getExpenses, getRecentExpenses } from '@/services/expenses.service'
import type { ExpenseFilters } from '@/types'

export function useExpenses(filters: ExpenseFilters) {
  return useQuery({
    queryKey: queryKeys.expenses.list(filters),
    queryFn: () => getExpenses(filters),
    enabled: !!filters.month,
  })
}

export function useRecentExpenses(month: string) {
  return useQuery({
    queryKey: queryKeys.expenses.recent(month),
    queryFn: () => getRecentExpenses(month),
    enabled: !!month,
  })
}
