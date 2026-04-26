import { Plus, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MonthPicker } from '@/components/shared/MonthPicker'
import { useUIStore } from '@/store/uiStore'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { useTheme } from '@/hooks/useTheme'

export function TopBar() {
  const { activeMonth, setActiveMonth, openAddExpense, expenseFilters } = useUIStore()
  const isMobile = useIsMobile()
  const { isDark, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 backdrop-blur px-4 md:px-6">
      <MonthPicker month={activeMonth} onChange={setActiveMonth} />
      <div className="flex-1" />
      <button
        onClick={toggle}
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
      {!isMobile && (
        <Button size="sm" className="gap-2" onClick={() => openAddExpense(expenseFilters.bucket ?? undefined)}>
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      )}
    </header>
  )
}
