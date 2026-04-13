import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getMonthLabel, getPrevMonth, getNextMonth, getCurrentMonth } from '@/lib/utils'

interface MonthPickerProps {
  month: string
  onChange: (month: string) => void
}

export function MonthPicker({ month, onChange }: MonthPickerProps) {
  const currentMonth = getCurrentMonth()
  const isCurrentMonth = month === currentMonth

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onChange(getPrevMonth(month))}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="min-w-[120px] text-center text-sm font-medium">
        {getMonthLabel(month)}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onChange(getNextMonth(month))}
        disabled={isCurrentMonth}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
