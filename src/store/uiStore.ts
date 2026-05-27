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
  sidebarCollapsed: boolean
  setActiveMonth: (month: string) => void
  openAddExpense: (defaultBucket?: BucketKey) => void
  closeAddExpense: () => void
  setExpenseFilters: (filters: Partial<ExpenseFiltersState>) => void
  resetExpenseFilters: () => void
  toggleSidebar: () => void
}

const defaultFilters: ExpenseFiltersState = {
  bucket: null,
  category: null,
  expense_type: null,
}

const SIDEBAR_KEY = 'pmdspm-sidebar-collapsed'

function loadSidebar(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_KEY) === 'true'
  } catch {
    return false
  }
}

export const useUIStore = create<UIState>((set) => ({
  activeMonth: getCurrentMonth(),
  isAddExpenseOpen: false,
  defaultBucket: null,
  expenseFilters: defaultFilters,
  sidebarCollapsed: loadSidebar(),

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

  toggleSidebar: () =>
    set((state) => {
      const next = !state.sidebarCollapsed
      try { localStorage.setItem(SIDEBAR_KEY, String(next)) } catch { /* noop */ }
      return { sidebarCollapsed: next }
    }),
}))
