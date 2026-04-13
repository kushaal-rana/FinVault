import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateExpense } from '@/services/expenses.service'
import { queryKeys } from '@/lib/queryClient'
import type { ExpenseUpdate } from '@/services/expenses.service'

export function useUpdateExpense(month: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ExpenseUpdate }) =>
      updateExpense(id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.expenses.all })
      qc.invalidateQueries({ queryKey: queryKeys.monthlyTotals(month) })
      qc.invalidateQueries({ queryKey: queryKeys.last6MonthsTotals })
    },
  })
}
