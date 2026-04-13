import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryClient'
import { getAllocationsByMonth } from '@/services/allocations.service'

export function useBucketAllocations(month: string) {
  return useQuery({
    queryKey: queryKeys.allocations.byMonth(month),
    queryFn: () => getAllocationsByMonth(month),
    enabled: !!month,
  })
}
