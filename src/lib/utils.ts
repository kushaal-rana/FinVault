import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
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
