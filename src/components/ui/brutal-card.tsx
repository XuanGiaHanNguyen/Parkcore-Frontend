import * as React from 'react'
import { cn } from '@/lib/utils'

const BrutalCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'bg-white border-3 border-black shadow-brutal',
      className
    )}
    {...props}
  />
))
BrutalCard.displayName = 'BrutalCard'

const BrutalCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col gap-2 p-4 border-b-3 border-black', className)}
    {...props}
  />
))
BrutalCardHeader.displayName = 'BrutalCardHeader'

const BrutalCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-xl font-bold leading-none tracking-tight', className)}
    {...props}
  />
))
BrutalCardTitle.displayName = 'BrutalCardTitle'

const BrutalCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
BrutalCardDescription.displayName = 'BrutalCardDescription'

const BrutalCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-4', className)} {...props} />
))
BrutalCardContent.displayName = 'BrutalCardContent'

const BrutalCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-4 border-t-3 border-black', className)}
    {...props}
  />
))
BrutalCardFooter.displayName = 'BrutalCardFooter'

export {
  BrutalCard,
  BrutalCardHeader,
  BrutalCardFooter,
  BrutalCardTitle,
  BrutalCardDescription,
  BrutalCardContent,
}
