import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/nav/Sidebar'
import { TopBar } from '@/components/nav/TopBar'
import { BottomNav } from '@/components/nav/BottomNav'
import { AddExpenseModal } from '@/components/add-expense/AddExpenseModal'
import { AddExpenseSheet } from '@/components/add-expense/AddExpenseSheet'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { useUIStore } from '@/store/uiStore'

export function AppLayout() {
  const isMobile = useIsMobile()
  const { isAddExpenseOpen, closeAddExpense } = useUIStore()

  return (
    <div className="flex min-h-svh bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-auto p-4 md:p-6 pb-24 md:pb-6">
          <Outlet />
        </main>
        {isMobile && <BottomNav />}
      </div>

      {/* Add Expense — modal on desktop, sheet on mobile */}
      {isMobile ? (
        <AddExpenseSheet open={isAddExpenseOpen} onClose={closeAddExpense} />
      ) : (
        <AddExpenseModal open={isAddExpenseOpen} onClose={closeAddExpense} />
      )}

    </div>
  )
}
