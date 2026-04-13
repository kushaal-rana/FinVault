import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { AddExpenseForm } from './AddExpenseForm'
import { useUIStore } from '@/store/uiStore'

interface AddExpenseSheetProps {
  open: boolean
  onClose: () => void
}

export function AddExpenseSheet({ open, onClose }: AddExpenseSheetProps) {
  const { defaultBucket } = useUIStore()

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="max-h-[92svh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Log Expense</SheetTitle>
        </SheetHeader>
        <div className="p-4 pb-8">
          <AddExpenseForm onSuccess={onClose} defaultBucket={defaultBucket} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
