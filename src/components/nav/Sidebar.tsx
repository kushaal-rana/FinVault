import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ListFilter, Settings, LogOut, Plus, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/hooks/useAuth'
import { useUIStore } from '@/store/uiStore'
import { useTheme } from '@/hooks/useTheme'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/expenses', icon: ListFilter, label: 'Expenses', end: false },
  { to: '/settings', icon: Settings, label: 'Settings', end: false },
]

export function Sidebar() {
  const { signOut } = useAuth()
  const { openAddExpense } = useUIStore()
  const { isDark, toggle } = useTheme()

  return (
    <aside className="flex h-screen w-60 flex-col border-r bg-card px-3 py-4 sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 mb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
          P
        </div>
        <span className="font-semibold text-sm">PMDSPM Tracker</span>
      </div>

      {/* Add Expense CTA */}
      <Button className="mb-4 gap-2" onClick={() => openAddExpense()}>
        <Plus className="h-4 w-4" />
        Add Expense
      </Button>

      <Separator className="mb-4" />

      {/* Nav links */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Theme + Sign out */}
      <Separator className="mb-3" />
      <button
        onClick={toggle}
        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors w-full mb-1"
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        {isDark ? 'Light mode' : 'Dark mode'}
      </button>
      <button
        onClick={signOut}
        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors w-full"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </aside>
  )
}
