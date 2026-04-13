import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryClient'
import { getLast6MonthsTotals } from '@/services/expenses.service'
import { getLastNMonths } from '@/lib/utils'

export function useLast6MonthsTotals() {
  const months = getLastNMonths(6)

  return useQuery({
    queryKey: queryKeys.last6MonthsTotals,
    queryFn: () => getLast6MonthsTotals(months),
    select: (data) => ({ data, months }),
  })
}
