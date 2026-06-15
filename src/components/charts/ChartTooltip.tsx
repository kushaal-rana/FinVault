import { useCurrency } from '@/hooks/useCurrency'

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
  showTotal?: boolean
}

export function ChartTooltip({ active, payload, label, showTotal }: ChartTooltipProps) {
  const { format } = useCurrency()
  if (!active || !payload?.length) return null

  const total = payload.reduce((sum, e) => sum + (e.value || 0), 0)

  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md text-sm">
      {label && <p className="font-medium mb-1.5 text-foreground">{label}</p>}
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground capitalize">{entry.name.replace(/_/g, ' ')}</span>
          <span className="ml-auto pl-4 font-semibold tabular-nums">{format(entry.value)}</span>
        </div>
      ))}
      {showTotal && (
        <div className="mt-1.5 pt-1.5 border-t flex items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
          <span className="text-foreground font-medium">Total</span>
          <span className="ml-auto pl-4 font-bold tabular-nums">{format(total)}</span>
        </div>
      )}
    </div>
  )
}
