import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useDeleteExpense } from '@/hooks/useDeleteExpense'
import { useUIStore } from '@/store/uiStore'
import { toast } from 'sonner'

interface DeleteExpenseDialogProps {
  expenseId: string | null
  onClose: () => void
}

export function DeleteExpenseDialog({ expenseId, onClose }: DeleteExpenseDialogProps) {
  const { activeMonth } = useUIStore()
  const deleteMutation = useDeleteExpense(activeMonth)

  async function handleDelete() {
    if (!expenseId) return
    try {
      await deleteMutation.mutateAsync(expenseId)
      toast.success('Expense deleted')
      onClose()
    } catch {
      toast.error('Failed to delete expense')
    }
  }

  return (
    <Dialog open={!!expenseId} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle>Delete expense?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. The expense will be permanently removed from your records.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
