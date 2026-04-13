import { formatCurrency } from '@/lib/utils'

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md text-sm">
      {label && <p className="font-medium mb-1.5 text-foreground">{label}</p>}
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground capitalize">{entry.name.replace(/_/g, ' ')}</span>
          <span className="ml-auto pl-4 font-semibold tabular-nums">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}
