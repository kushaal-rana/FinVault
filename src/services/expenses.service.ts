import { supabase } from '@/lib/supabase'
import type { Expense, ExpenseInsert, ExpenseFilters, MonthlyTotal } from '@/types'
import type { BucketKey } from '@/types'

export async function getExpenses(filters: ExpenseFilters): Promise<Expense[]> {
  let query = supabase
    .from('expenses')
    .select('*')
    .eq('month', filters.month)
    .is('deleted_at', null)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  if (filters.bucket) query = query.eq('bucket', filters.bucket)
  if (filters.category) query = query.eq('category', filters.category)
  if (filters.expense_type) query = query.eq('expense_type', filters.expense_type)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Expense[]
}

export async function getRecentExpenses(month: string, limit = 5): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('month', month)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data ?? []) as Expense[]
}

export async function insertExpense(expense: ExpenseInsert): Promise<Expense> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('expenses')
    .insert({ ...expense, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data as Expense
}

export interface ExpenseUpdate {
  amount: number
  description: string
  bucket: BucketKey
  category: string
  expense_type: string
  date: string
  month: string
  notes?: string
}

export async function updateExpense(id: string, updates: ExpenseUpdate): Promise<Expense> {
  const { data, error } = await supabase
    .from('expenses')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Expense
}

export async function softDeleteExpense(id: string): Promise<void> {
  const { error } = await supabase
    .from('expenses')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

export async function getMonthlyTotals(month: string): Promise<MonthlyTotal[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('bucket, amount')
    .eq('month', month)
    .is('deleted_at', null)

  if (error) throw error

  // Aggregate client-side (Supabase free tier doesn't support rpc groupby easily)
  const totals: Record<string, number> = {}
  for (const row of data ?? []) {
    const bucket = row.bucket as BucketKey
    totals[bucket] = (totals[bucket] ?? 0) + Number(row.amount)
  }

  return Object.entries(totals).map(([bucket, total]) => ({
    bucket: bucket as BucketKey,
    total,
  }))
}

export async function getLast6MonthsTotals(
  months: string[]
): Promise<Array<{ month: string; bucket: BucketKey; total: number }>> {
  const { data, error } = await supabase
    .from('expenses')
    .select('month, bucket, amount')
    .in('month', months)
    .is('deleted_at', null)

  if (error) throw error

  const totals: Record<string, Record<string, number>> = {}
  for (const row of data ?? []) {
    if (!totals[row.month]) totals[row.month] = {}
    totals[row.month][row.bucket] = (totals[row.month][row.bucket] ?? 0) + Number(row.amount)
  }

  const result: Array<{ month: string; bucket: BucketKey; total: number }> = []
  for (const month of Object.keys(totals)) {
    for (const [bucket, total] of Object.entries(totals[month])) {
      result.push({ month, bucket: bucket as BucketKey, total })
    }
  }
  return result
}
