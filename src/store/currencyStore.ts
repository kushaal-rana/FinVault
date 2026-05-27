import { create } from 'zustand'
import type { CurrencyCode } from '@/types'

const STORAGE_KEY_CURRENCY = 'pmdspm-currency'
const STORAGE_KEY_RATE = 'pmdspm-exchange-rate'
const DEFAULT_RATE = 95.67

function loadCurrency(): CurrencyCode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CURRENCY)
    if (stored === 'INR' || stored === 'USD') return stored
  } catch { /* noop */ }
  return 'USD'
}

function loadRate(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_RATE)
    if (stored) {
      const parsed = parseFloat(stored)
      if (!isNaN(parsed) && parsed > 0) return parsed
    }
  } catch { /* noop */ }
  return DEFAULT_RATE
}

interface CurrencyState {
  currency: CurrencyCode
  exchangeRate: number
  setCurrency: (c: CurrencyCode) => void
  setExchangeRate: (rate: number) => void
}

export const useCurrencyStore = create<CurrencyState>((set) => ({
  currency: loadCurrency(),
  exchangeRate: loadRate(),

  setCurrency: (currency) => {
    localStorage.setItem(STORAGE_KEY_CURRENCY, currency)
    set({ currency })
  },

  setExchangeRate: (exchangeRate) => {
    localStorage.setItem(STORAGE_KEY_RATE, String(exchangeRate))
    set({ exchangeRate })
  },
}))
