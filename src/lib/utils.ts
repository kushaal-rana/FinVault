import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import type { CurrencyCode } from '@/types'

export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'USD',
  exchangeRate: number = 95.67
): string {
  const displayAmount = currency === 'INR' ? amount * exchangeRate : amount
  return formatCurrencyRaw(displayAmount, currency)
}

/** Format a number that is ALREADY in the target currency — no conversion */
export function formatCurrencyRaw(
  amount: number,
  currency: CurrencyCode = 'USD'
): string {
  const locale = currency === 'INR' ? 'en-IN' : 'en-US'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: currency === 'INR' ? 0 : 2,
  }).format(amount)
}

/** Convert user-entered amount to USD for Supabase storage */
export function toStorageAmount(
  enteredAmount: number,
  currency: CurrencyCode,
  exchangeRate: number
): number {
  if (currency === 'INR') {
    return Math.round((enteredAmount / exchangeRate) * 100) / 100
  }
  return enteredAmount
}

/** Convert stored USD amount to display currency (raw number, no formatting) */
export function toDisplayAmount(
  storedAmount: number,
  currency: CurrencyCode,
  exchangeRate: number
): number {
  if (currency === 'INR') {
    return Math.round(storedAmount * exchangeRate * 100) / 100
  }
  return storedAmount
}

export function getCurrencySymbol(currency: CurrencyCode = 'USD'): string {
  return currency === 'INR' ? '₹' : '$'
}

export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy')
  } catch {
    return dateStr
  }
}

export function formatShortDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'MMM d')
  } catch {
    return dateStr
  }
}

export function getCurrentMonth(): string {
  return format(new Date(), 'yyyy-MM')
}

export function getMonthLabel(month: string): string {
  try {
    return format(parseISO(`${month}-01`), 'MMMM yyyy')
  } catch {
    return month
  }
}

export function getShortMonthLabel(month: string): string {
  try {
    return format(parseISO(`${month}-01`), 'MMM yyyy')
  } catch {
    return month
  }
}

export function getPrevMonth(month: string): string {
  const [year, m] = month.split('-').map(Number)
  const d = new Date(year, m - 2, 1)
  return format(d, 'yyyy-MM')
}

export function getNextMonth(month: string): string {
  const [year, m] = month.split('-').map(Number)
  const d = new Date(year, m, 1)
  return format(d, 'yyyy-MM')
}

export function dateToMonth(date: string): string {
  return date.substring(0, 7)
}

export function getLastNMonths(n: number): string[] {
  const months: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() - i)
    months.push(format(d, 'yyyy-MM'))
  }
  return months
}
