'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Tick01Icon } from '@hugeicons/core-free-icons'
import { getBestTextColor } from '@/lib/utils/color-utils'
import { cn } from '@/lib/utils'

interface ColorSwatchProps {
  color: string
  size?: 'sm' | 'md' | 'lg'
  showInfo?: boolean
  className?: string
}

export function ColorSwatch({ color, size = 'md', showInfo = true, className }: ColorSwatchProps) {
  const [copied, setCopied] = useState(false)
  const textColor = getBestTextColor(color)

  const handleCopy = async (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault()
    await navigator.clipboard.writeText(color)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleCopy(e)
    }
  }

  const sizeClasses = {
    sm: 'h-16',
    md: 'h-24',
    lg: 'h-32',
  }

  return (
    <button
      onClick={handleCopy}
      onKeyDown={handleKeyDown}
      aria-label={copied ? `Copied ${color.toUpperCase()}` : `Copy color ${color.toUpperCase()}`}
      className={cn(
        'relative group border-3 border-black shadow-brutal overflow-hidden transition-[transform,box-shadow,opacity] hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 focus-visible:shadow-brutal-sm focus-visible:translate-x-0.5 focus-visible:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black cursor-pointer w-full',
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: color }}
      title={`Click to copy ${color}`}
    >
      {showInfo && (
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20"
          style={{ color: textColor }}
        >
          {copied ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white text-black border-2 border-black font-mono text-sm font-bold shadow-brutal-sm">
              <HugeiconsIcon icon={Tick01Icon} className="h-4 w-4" aria-hidden="true" />
              Copied!
            </div>
          ) : (
            <div className="px-3 py-1.5 bg-white text-black border-2 border-black font-mono text-sm font-bold shadow-brutal-sm">
              {color.toUpperCase()}
            </div>
          )}
        </div>
      )}
    </button>
  )
}
