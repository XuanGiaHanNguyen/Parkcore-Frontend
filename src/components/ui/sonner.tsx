'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast !rounded-none border-3 border-black shadow-brutal group-[.toaster]:bg-card group-[.toaster]:text-card-foreground',
          title: 'font-black',
          description: 'font-medium group-[.toast]:text-muted-foreground',
          actionButton:
            '!rounded-none border-3 border-black bg-primary font-bold text-primary-foreground shadow-brutal-sm',
          cancelButton:
            '!rounded-none border-3 border-black bg-white font-bold text-black shadow-brutal-sm',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
