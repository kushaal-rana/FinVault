import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  fullPage?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinner({ fullPage, className, size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }

  const spinner = (
    <svg
      className={cn('animate-spin text-muted-foreground', sizeClasses[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        {spinner}
      </div>
    )
  }

  return spinner
}
