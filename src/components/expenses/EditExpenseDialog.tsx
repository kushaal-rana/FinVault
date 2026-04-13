import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BUCKET_CONFIG, BUCKET_ORDER } from '@/constants/buckets'
import { CATEGORY_LABELS, EXPENSE_TYPE_LABELS } from '@/constants/categories'
import { CATEGORY_KEYS, EXPENSE_TYPE_KEYS } from '@/types'
import { useUpdateExpense } from '@/hooks/useUpdateExpense'
import { useUIStore } from '@/store/uiStore'
import { dateToMonth, formatCurrency } from '@/lib/utils'
import type { Expense, BucketKey, CategoryKey, ExpenseType } from '@/types'

const SPLIT_WAYS = 3

const schema = z.object({
  amount: z.coerce.number().positive('Amount must be positive').max(999999.99, 'Amount too large'),
  description: z.string().min(1, 'Description is required').max(200).trim(),
  bucket: z.enum(['passive_income', 'must', 'desire', 'self_pampering', 'personal_growth', 'make_a_difference', 'buffer'] as const),
  category: z.enum(CATEGORY_KEYS),
  expense_type: z.enum(EXPENSE_TYPE_KEYS),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
  notes: z.string().max(500).optional(),
})

type FormValues = z.infer<typeof schema>

interface EditExpenseDialogProps {
  expense: Expense | null
  onClose: () => void
}

export function EditExpenseDialog({ expense, onClose }: EditExpenseDialogProps) {
  const { activeMonth } = useUIStore()
  const updateMutation = useUpdateExpense(activeMonth)

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  // Pre-fill form when expense changes
  useEffect(() => {
    if (!expense) return
    reset({
      // For split expenses, show the stored share × 3 so the user sees the original total
      amount: expense.expense_type === 'split'
        ? Math.round(expense.amount * SPLIT_WAYS * 100) / 100
        : expense.amount,
      description: expense.description,
      bucket: expense.bucket,
      category: expense.category,
      expense_type: expense.expense_type,
      date: expense.date,
      notes: expense.notes ?? '',
    })
  }, [expense, reset])

  const selectedBucket = watch('bucket')
  const watchedAmount = watch('amount')
  const watchedType = watch('expense_type')

  const isSplit = watchedType === 'split'
  const rawAmount = Number(watchedAmount) || 0
  const yourShare = rawAmount > 0 ? rawAmount / SPLIT_WAYS : null

  async function onSubmit(values: FormValues) {
    if (!expense) return
    try {
      const storedAmount = values.expense_type === 'split'
        ? Math.round((values.amount / SPLIT_WAYS) * 100) / 100
        : values.amount

      await updateMutation.mutateAsync({
        id: expense.id,
        updates: {
          ...values,
          amount: storedAmount,
          notes: values.notes || undefined,
          month: dateToMonth(values.date),
          bucket: values.bucket as BucketKey,
          category: values.category as CategoryKey,
          expense_type: values.expense_type as ExpenseType,
        },
      })
      toast.success('Expense updated')
      onClose()
    } catch {
      toast.error('Failed to update expense')
    }
  }

  return (
    <Dialog open={!!expense} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          {/* Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-amount">{isSplit ? 'Total bill amount' : 'Amount'}</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="pl-7 text-lg font-semibold"
                {...register('amount')}
              />
            </div>
            {isSplit && yourShare !== null && (
              <p className="text-xs text-muted-foreground">
                Your share: <span className="font-semibold text-foreground">{formatCurrency(yourShare)}</span>
                <span className="ml-1">(÷{SPLIT_WAYS} ways)</span>
              </p>
            )}
            {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-description">Description</Label>
            <Input id="edit-description" placeholder="What was this for?" {...register('description')} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          {/* Bucket + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Bucket</Label>
              <Select value={selectedBucket} onValueChange={(v) => setValue('bucket', v as BucketKey)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BUCKET_ORDER.map((key) => {
                    const config = BUCKET_CONFIG[key]
                    return (
                      <SelectItem key={key} value={key}>
                        <span className="flex items-center gap-2">
                          <span>{config.icon}</span>
                          {config.shortLabel}
                        </span>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={watch('category')} onValueChange={(v) => setValue('category', v as CategoryKey)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_KEYS.map((key) => (
                    <SelectItem key={key} value={key}>{CATEGORY_LABELS[key]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Type + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={watch('expense_type')} onValueChange={(v) => setValue('expense_type', v as ExpenseType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_TYPE_KEYS.map((key) => (
                    <SelectItem key={key} value={key}>{EXPENSE_TYPE_LABELS[key]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-date">Date</Label>
              <Input id="edit-date" type="date" {...register('date')} />
              {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-notes">Notes <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Input id="edit-notes" placeholder="Any additional notes..." {...register('notes')} />
          </div>

          <div className="flex gap-2 justify-end mt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting || updateMutation.isPending}>
              {isSubmitting || updateMutation.isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
