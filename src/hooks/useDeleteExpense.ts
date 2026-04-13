import { useMutation, useQueryClient } from '@tanstack/react-query'
import { softDeleteExpense } from '@/services/expenses.service'
import { queryKeys } from '@/lib/queryClient'

export function useDeleteExpense(month: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => softDeleteExpense(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.expenses.all })
      qc.invalidateQueries({ queryKey: queryKeys.monthlyTotals(month) })
      qc.invalidateQueries({ queryKey: queryKeys.last6MonthsTotals })
    },
  })
}
