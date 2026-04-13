import { create } from 'zustand'
import { getCurrentMonth } from '@/lib/utils'
import type { BucketKey, CategoryKey, ExpenseType } from '@/types'

interface ExpenseFiltersState {
  bucket: BucketKey | null
  category: CategoryKey | null
  expense_type: ExpenseType | null
}

interface UIState {
  activeMonth: string
  isAddExpenseOpen: boolean
  defaultBucket: BucketKey | null
  expenseFilters: ExpenseFiltersState
  setActiveMonth: (month: string) => void
  openAddExpense: (defaultBucket?: BucketKey) => void
  closeAddExpense: () => void
  setExpenseFilters: (filters: Partial<ExpenseFiltersState>) => void
  resetExpenseFilters: () => void
}

const defaultFilters: ExpenseFiltersState = {
  bucket: null,
  category: null,
  expense_type: null,
}

export const useUIStore = create<UIState>((set) => ({
  activeMonth: getCurrentMonth(),
  isAddExpenseOpen: false,
  defaultBucket: null,
  expenseFilters: defaultFilters,

  setActiveMonth: (month) => set({ activeMonth: month }),

  openAddExpense: (defaultBucket) =>
    set({ isAddExpenseOpen: true, defaultBucket: defaultBucket ?? null }),

  closeAddExpense: () =>
    set({ isAddExpenseOpen: false, defaultBucket: null }),

  setExpenseFilters: (filters) =>
    set((state) => ({
      expenseFilters: { ...state.expenseFilters, ...filters },
    })),

  resetExpenseFilters: () => set({ expenseFilters: defaultFilters }),
}))
