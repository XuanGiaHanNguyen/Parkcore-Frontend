import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BrutalInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const BrutalInput = React.forwardRef<HTMLInputElement, BrutalInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full border-3 border-black bg-white px-3 py-2 text-sm font-medium',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
BrutalInput.displayName = 'BrutalInput'

export { BrutalInput }
