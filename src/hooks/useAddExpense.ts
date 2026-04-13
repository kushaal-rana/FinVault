import { useMutation, useQueryClient } from '@tanstack/react-query'
import { insertExpense } from '@/services/expenses.service'
import { queryKeys } from '@/lib/queryClient'
import type { ExpenseInsert } from '@/types'

export function useAddExpense() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (expense: ExpenseInsert) => insertExpense(expense),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.expenses.all })
      qc.invalidateQueries({ queryKey: queryKeys.monthlyTotals(variables.month) })
      qc.invalidateQueries({ queryKey: queryKeys.last6MonthsTotals })
    },
  })
}
