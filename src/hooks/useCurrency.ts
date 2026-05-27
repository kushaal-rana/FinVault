import { useCurrencyStore } from '@/store/currencyStore'
import { formatCurrency, formatCurrencyRaw, getCurrencySymbol, toStorageAmount, toDisplayAmount } from '@/lib/utils'

export function useCurrency() {
  const { currency, exchangeRate, setCurrency, setExchangeRate } = useCurrencyStore()

  return {
    currency,
    exchangeRate,
    setCurrency,
    setExchangeRate,
    /** Format a stored USD amount for display in the active currency */
    format: (amount: number) => formatCurrency(amount, currency, exchangeRate),
    /** Format a number that's already in display currency — no conversion */
    formatRaw: (amount: number) => formatCurrencyRaw(amount, currency),
    /** Active currency symbol ($ or ₹) */
    symbol: getCurrencySymbol(currency),
    /** Convert user-entered amount to USD for DB storage */
    toStorage: (entered: number) => toStorageAmount(entered, currency, exchangeRate),
    /** Convert stored USD amount to display currency (raw number) */
    toDisplay: (stored: number) => toDisplayAmount(stored, currency, exchangeRate),
  }
}
