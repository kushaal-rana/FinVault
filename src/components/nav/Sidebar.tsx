import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ListFilter, Settings, LogOut, Plus, Sun, Moon, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
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
  const { openAddExpense, sidebarCollapsed, toggleSidebar } = useUIStore()
  const { isDark, toggle } = useTheme()

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r bg-card py-4 sticky top-0 transition-[width] duration-200',
        sidebarCollapsed ? 'w-16 px-2' : 'w-60 px-3'
      )}
    >
      {/* Logo + collapse toggle */}
      <div className={cn('flex items-center mb-6', sidebarCollapsed ? 'justify-center' : 'justify-between px-2')}>
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold shrink-0">
              P
            </div>
            <span className="font-semibold text-sm truncate">PMDSPM Tracker</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors shrink-0"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      {/* Add Expense CTA */}
      {sidebarCollapsed ? (
        <button
          onClick={() => openAddExpense()}
          className="mb-4 mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          aria-label="Add expense"
          title="Add expense"
        >
          <Plus className="h-4 w-4" />
        </button>
      ) : (
        <Button className="mb-4 gap-2" onClick={() => openAddExpense()}>
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      )}

      <Separator className="mb-4" />

      {/* Nav links */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={sidebarCollapsed ? label : undefined}
            className={({ isActive }) =>
              cn(
                'flex items-center rounded-md text-sm font-medium transition-colors',
                sidebarCollapsed ? 'justify-center h-10 w-10 mx-auto' : 'gap-3 px-3 py-2',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!sidebarCollapsed && label}
          </NavLink>
        ))}
      </nav>

      {/* Theme + Sign out */}
      <Separator className="mb-3" />
      <button
        onClick={toggle}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={sidebarCollapsed ? (isDark ? 'Light mode' : 'Dark mode') : undefined}
        className={cn(
          'flex items-center rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors mb-1',
          sidebarCollapsed ? 'justify-center h-10 w-10 mx-auto' : 'gap-3 px-3 py-2 w-full'
        )}
      >
        {isDark ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
        {!sidebarCollapsed && (isDark ? 'Light mode' : 'Dark mode')}
      </button>
      <button
        onClick={signOut}
        title={sidebarCollapsed ? 'Sign out' : undefined}
        className={cn(
          'flex items-center rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors',
          sidebarCollapsed ? 'justify-center h-10 w-10 mx-auto' : 'gap-3 px-3 py-2 w-full'
        )}
      >
        <LogOut className="h-4 w-4 shrink-0" />
        {!sidebarCollapsed && 'Sign out'}
      </button>
    </aside>
  )
}
