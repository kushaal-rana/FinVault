import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ListFilter, Plus, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/uiStore'

export function BottomNav() {
  const { openAddExpense, expenseFilters } = useUIStore()

  return (
    <>
      {/* Floating Add button — sits ABOVE the nav bar (no overlap), centered */}
      <button
        onClick={() => openAddExpense(expenseFilters.bucket ?? undefined)}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-black/25 transition-transform active:scale-95"
        aria-label="Add expense"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Bottom nav — 3 evenly-spaced tabs */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center border-t bg-background/95 backdrop-blur safe-area-pb">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            cn('flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground')
          }
        >
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </NavLink>

        <NavLink
          to="/expenses"
          className={({ isActive }) =>
            cn('flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground')
          }
        >
          <ListFilter className="h-5 w-5" />
          Expenses
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn('flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground')
          }
        >
          <Settings className="h-5 w-5" />
          Settings
        </NavLink>
      </nav>
    </>
  )
}
