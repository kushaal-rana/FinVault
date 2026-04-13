import { QueryClient } from '@tanstack/react-query'
import type { BucketKey, CategoryKey, ExpenseType } from '@/types'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      gcTime: 1000 * 60 * 10,   // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export const queryKeys = {
  expenses: {
    all: ['expenses'] as const,
    list: (filters: { month: string; bucket?: BucketKey | null; category?: CategoryKey | null; expense_type?: ExpenseType | null }) =>
      ['expenses', 'list', filters] as const,
    recent: (month: string) => ['expenses', 'recent', month] as const,
  },
  allocations: {
    all: ['allocations'] as const,
    byMonth: (month: string) => ['allocations', month] as const,
  },
  monthlyTotals: (month: string) => ['monthly-totals', month] as const,
  last6MonthsTotals: ['last-6-months-totals'] as const,
}
