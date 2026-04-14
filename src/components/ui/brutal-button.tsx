import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BrutalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'destructive' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const BrutalButton = React.forwardRef<HTMLButtonElement, BrutalButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center font-bold border-3 border-black transition-[transform,box-shadow,background-color,color] duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2',
          'active:translate-x-1 active:translate-y-1 active:shadow-none',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0',
          {
            'bg-primary text-primary-foreground shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5':
              variant === 'primary',
            'bg-secondary text-white shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5':
              variant === 'secondary',
            'bg-accent text-accent-foreground shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5':
              variant === 'accent',
            'bg-success text-success-foreground shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5':
              variant === 'success',
            'bg-destructive text-destructive-foreground shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5':
              variant === 'destructive',
            'bg-white text-black shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5':
              variant === 'outline',
          },
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
BrutalButton.displayName = 'BrutalButton'

export { BrutalButton }
