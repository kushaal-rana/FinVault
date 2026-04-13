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
      <SheetContent className="max-h-[92svh] flex flex-col">
        <SheetHeader>
          <SheetTitle>Log Expense</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto p-4 pb-10">
          <AddExpenseForm onSuccess={onClose} defaultBucket={defaultBucket} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
