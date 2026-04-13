import { cn } from '@/lib/utils'
import { CATEGORY_LABELS } from '@/constants/categories'
import type { CategoryKey } from '@/types'

interface CategoryBadgeProps {
  category: CategoryKey
  className?: string
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground',
        className
      )}
    >
      {CATEGORY_LABELS[category]}
    </span>
  )
}
