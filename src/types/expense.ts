import type { BucketKey } from './bucket'

export const CATEGORY_KEYS = [
  'groceries',
  'rent',
  'wifi',
  'utilities',
  'rental_insurance',
  'electricity',
  'subscription',
  'stocks',
  'other',
] as const

export const EXPENSE_TYPE_KEYS = ['own', 'split', 'pending'] as const

export type CategoryKey = (typeof CATEGORY_KEYS)[number]
export type ExpenseType = (typeof EXPENSE_TYPE_KEYS)[number]

export interface Expense {
  id: string
  user_id: string
  amount: number
  description: string
  bucket: BucketKey
  category: CategoryKey
  expense_type: ExpenseType
  date: string
  month: string
  notes?: string | null
  deleted_at?: string | null
  created_at: string
  updated_at: string
}

export interface ExpenseInsert {
  amount: number
  description: string
  bucket: BucketKey
  category: CategoryKey
  expense_type: ExpenseType
  date: string
  month: string
  notes?: string
}

export interface ExpenseFilters {
  month: string
  bucket?: BucketKey | null
  category?: CategoryKey | null
  expense_type?: ExpenseType | null
}

export interface MonthlyTotal {
  bucket: BucketKey
  total: number
}
