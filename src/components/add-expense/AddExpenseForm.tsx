import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BUCKET_CONFIG, BUCKET_ORDER } from '@/constants/buckets'
import { CATEGORY_LABELS, EXPENSE_TYPE_LABELS } from '@/constants/categories'
import { CATEGORY_KEYS, EXPENSE_TYPE_KEYS } from '@/types'
import { useAddExpense } from '@/hooks/useAddExpense'
import { dateToMonth, formatCurrency } from '@/lib/utils'
import type { BucketKey, CategoryKey, ExpenseType } from '@/types'

// Split bills are always divided 3 ways (Wi-Fi, utilities, electricity)
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

interface AddExpenseFormProps {
  onSuccess: () => void
  defaultBucket?: BucketKey | null
}

export function AddExpenseForm({ onSuccess, defaultBucket }: AddExpenseFormProps) {
  const addExpense = useAddExpense()

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: undefined,
      description: '',
      bucket: defaultBucket ?? 'must',
      category: 'other',
      expense_type: 'own',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
  })

  const selectedBucket = watch('bucket')
  const watchedAmount = watch('amount')
  const watchedType = watch('expense_type')

  const isSplit = watchedType === 'split'
  const rawAmount = Number(watchedAmount) || 0
  const yourShare = rawAmount > 0 ? rawAmount / SPLIT_WAYS : null

  async function onSubmit(values: FormValues) {
    try {
      // For split expenses, store the user's share (total ÷ 3), not the full bill
      const storedAmount = values.expense_type === 'split'
        ? Math.round((values.amount / SPLIT_WAYS) * 100) / 100
        : values.amount

      await addExpense.mutateAsync({
        ...values,
        amount: storedAmount,
        notes: values.notes || undefined,
        month: dateToMonth(values.date),
        bucket: values.bucket as BucketKey,
        category: values.category as CategoryKey,
        expense_type: values.expense_type as ExpenseType,
      })
      toast.success('Expense added!')
      onSuccess()
    } catch {
      toast.error('Failed to add expense. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Amount */}
      <div className="space-y-1.5">
        <Label htmlFor="amount">{isSplit ? 'Total bill amount' : 'Amount'}</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
          <Input
            id="amount"
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
        {isSplit && yourShare === null && (
          <p className="text-xs text-muted-foreground">Enter the total bill — your share (÷{SPLIT_WAYS}) will be saved</p>
        )}
        {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Input id="description" placeholder="What was this for?" {...register('description')} />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      {/* Bucket + Category row */}
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
          <Select defaultValue="other" onValueChange={(v) => setValue('category', v as CategoryKey)}>
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

      {/* Type + Date row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Type</Label>
          <Select defaultValue="own" onValueChange={(v) => setValue('expense_type', v as ExpenseType)}>
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
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" {...register('date')} />
          {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes <span className="text-muted-foreground font-normal">(optional)</span></Label>
        <Input id="notes" placeholder="Any additional notes..." {...register('notes')} />
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2">
        {isSubmitting
          ? 'Adding...'
          : isSplit && yourShare !== null
            ? `Add expense — ${formatCurrency(yourShare)}`
            : 'Add Expense'}
      </Button>
    </form>
  )
}
