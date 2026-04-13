import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryClient'
import { getMonthlyTotals } from '@/services/expenses.service'

export function useMonthlyTotals(month: string) {
  return useQuery({
    queryKey: queryKeys.monthlyTotals(month),
    queryFn: () => getMonthlyTotals(month),
    enabled: !!month,
  })
}
