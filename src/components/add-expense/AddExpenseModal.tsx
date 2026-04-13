import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AddExpenseForm } from './AddExpenseForm'
import { useUIStore } from '@/store/uiStore'

interface AddExpenseModalProps {
  open: boolean
  onClose: () => void
}

export function AddExpenseModal({ open, onClose }: AddExpenseModalProps) {
  const { defaultBucket } = useUIStore()

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Log Expense</DialogTitle>
        </DialogHeader>
        <AddExpenseForm onSuccess={onClose} defaultBucket={defaultBucket} />
      </DialogContent>
    </Dialog>
  )
}
