import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useBucketAllocations } from '@/hooks/useBucketAllocations'
import { useUIStore } from '@/store/uiStore'
import { upsertAllocations } from '@/services/allocations.service'
import { queryKeys } from '@/lib/queryClient'
import { BUCKET_CONFIG, BUCKET_ORDER, DEFAULT_MONTHLY_INCOME } from '@/constants/buckets'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MonthPicker } from '@/components/shared/MonthPicker'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import { AlertTriangle, Save } from 'lucide-react'
import type { BucketKey } from '@/types'

export function SettingsPage() {
  const { activeMonth, setActiveMonth } = useUIStore()
  const { data: allocations, isLoading } = useBucketAllocations(activeMonth)
  const queryClientInstance = useQueryClient()

  const [amounts, setAmounts] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {}
    BUCKET_ORDER.forEach((key) => { defaults[key] = '' })
    return defaults
  })

  // Populate form when data loads — only the 6 editable buckets
  useEffect(() => {
    if (!allocations) return
    const map: Record<string, string> = {}
    allocations.forEach((a) => {
      if (a.bucket !== 'buffer') map[a.bucket] = String(a.amount)
    })
    BUCKET_ORDER.forEach((key) => {
      if (!(key in map)) map[key] = ''
    })
    setAmounts(map)
  }, [allocations])

  const totalAllocated = BUCKET_ORDER.reduce((sum, key) => {
    const val = parseFloat(amounts[key] || '0')
    return sum + (isNaN(val) ? 0 : val)
  }, 0)

  // Buffer = whatever income hasn't been allocated to the 6 buckets
  const bufferAmount = DEFAULT_MONTHLY_INCOME - totalAllocated
  const isOverBudget = bufferAmount < 0

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = BUCKET_ORDER.map((bucket) => ({
        month: activeMonth,
        bucket,
        amount: parseFloat(amounts[bucket] || '0') || 0,
      }))
      return upsertAllocations(payload)
    },
    onSuccess: () => {
      queryClientInstance.invalidateQueries({ queryKey: queryKeys.allocations.byMonth(activeMonth) })
      queryClientInstance.invalidateQueries({ queryKey: queryKeys.monthlyTotals(activeMonth) })
      toast.success('Allocations saved')
    },
    onError: () => {
      toast.error('Failed to save allocations')
    },
  })

  function handleChange(key: BucketKey, value: string) {
    // Allow digits and single decimal point
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmounts((prev) => ({ ...prev, [key]: value }))
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your monthly bucket allocations</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Editing allocations for</span>
        <MonthPicker month={activeMonth} onChange={setActiveMonth} />
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b bg-muted/30">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Monthly Income: {formatCurrency(DEFAULT_MONTHLY_INCOME)}
          </p>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
        ) : (
          <div className="divide-y">
            {BUCKET_ORDER.map((key) => {
              const config = BUCKET_CONFIG[key]
              const val = parseFloat(amounts[key] || '0') || 0
              const pct = DEFAULT_MONTHLY_INCOME > 0 ? (val / DEFAULT_MONTHLY_INCOME) * 100 : 0
              return (
                <div key={key} className="flex items-center gap-4 px-4 py-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-lg leading-none">{config.icon}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{config.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{config.description}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium tabular-nums text-muted-foreground w-12 text-right shrink-0">
                    {val > 0 ? `${pct % 1 === 0 ? pct.toFixed(0) : pct.toFixed(1)}%` : '—'}
                  </span>
                  <div className="relative w-28 shrink-0">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">$</span>
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={amounts[key]}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="pl-6 h-8 text-sm"
                      placeholder="0"
                    />
                  </div>
                </div>
              )
            })}

            {/* Buffer — read-only, auto-calculated as income minus all allocations */}
            <div className="flex items-center gap-4 px-4 py-3 bg-muted/20">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-lg leading-none">{BUCKET_CONFIG.buffer.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate text-muted-foreground">Buffer (auto)</p>
                  <p className="text-xs text-muted-foreground truncate">Whatever's left unallocated</p>
                </div>
              </div>
              <span className={`text-xs font-medium tabular-nums w-12 text-right shrink-0 ${isOverBudget ? 'text-destructive' : 'text-muted-foreground'}`}>
                {bufferAmount !== 0 ? `${Math.abs((bufferAmount / DEFAULT_MONTHLY_INCOME) * 100).toFixed(1)}%` : '—'}
              </span>
              <div className="w-28 shrink-0 px-3 h-8 flex items-center rounded-md border bg-muted/50">
                <span className="text-sm text-muted-foreground mr-1">$</span>
                <span className={`text-sm font-medium tabular-nums ${isOverBudget ? 'text-destructive' : 'text-foreground'}`}>
                  {bufferAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="px-4 py-3 border-t bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Total allocated</span>
            <span className={`text-sm font-semibold tabular-nums ${isOverBudget ? 'text-destructive' : 'text-foreground'}`}>
              {formatCurrency(totalAllocated)} / {formatCurrency(DEFAULT_MONTHLY_INCOME)}
              <span className="ml-2 font-normal text-muted-foreground">
                ({((totalAllocated / DEFAULT_MONTHLY_INCOME) * 100).toFixed(1)}%)
              </span>
            </span>
          </div>
          {isOverBudget ? (
            <div className="flex items-center gap-1.5 mt-2 text-destructive">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span className="text-xs">Over-allocated by {formatCurrency(Math.abs(bufferAmount))}</span>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground mt-1">
              {bufferAmount > 0 ? `${formatCurrency(bufferAmount)} goes to buffer` : 'Fully allocated'}
            </p>
          )}
        </div>
      </div>

      <Button
        onClick={() => saveMutation.mutate()}
        disabled={saveMutation.isPending || isLoading}
        className="gap-2"
      >
        <Save className="h-4 w-4" />
        {saveMutation.isPending ? 'Saving…' : 'Save allocations'}
      </Button>
    </div>
  )
}
