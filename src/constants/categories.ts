import type { CategoryKey, ExpenseType } from '@/types'

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  groceries: 'Groceries',
  rent: 'Rent',
  wifi: 'WiFi',
  utilities: 'Utilities',
  rental_insurance: 'Rental Insurance',
  electricity: 'Electricity',
  subscription: 'Subscription',
  stocks: 'Stocks',
  other: 'Other',
}

export const EXPENSE_TYPE_LABELS: Record<ExpenseType, string> = {
  own: 'Own',
  split: 'Split',
  pending: 'Pending',
}
