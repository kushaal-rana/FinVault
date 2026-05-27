import { cn } from '@/lib/utils'
import { useCurrency } from '@/hooks/useCurrency'

interface CurrencyAmountProps {
  amount: number
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  muted?: boolean
}

export function CurrencyAmount({ amount, className, size = 'md', muted }: CurrencyAmountProps) {
  const { format } = useCurrency()

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-3xl font-bold',
  }

  return (
    <span
      className={cn(
        'tabular-nums font-semibold',
        sizeClasses[size],
        muted && 'text-muted-foreground font-normal',
        className
      )}
    >
      {format(amount)}
    </span>
  )
}
