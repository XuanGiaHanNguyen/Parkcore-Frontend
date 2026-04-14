'use client'

import { BrutalButton } from './ui/brutal-button'
import { BrutalCard, BrutalCardContent, BrutalCardHeader, BrutalCardTitle } from './ui/brutal-card'
import { HugeiconsIcon } from '@hugeicons/react'
import { Cancel01Icon, File02Icon, FileScriptIcon, Palette, Image } from '@hugeicons/core-free-icons'
import { exportAsJSON, exportAsCSS, exportAsSCSS, exportAsTailwind, exportAsSVG } from '@/lib/utils/export-utils'

interface ExportModalProps {
  palette: import('@/lib/types/color').Palette
  onClose: () => void
}

export function ExportModal({ palette, onClose }: ExportModalProps) {
  const exportOptions = [
    {
      label: 'JSON',
      description: 'Export as JSON data',
      icon: File02Icon,
      action: () => exportAsJSON(palette),
      color: 'bg-primary',
    },
    {
      label: 'CSS',
      description: 'CSS custom properties',
      icon: FileScriptIcon,
      action: () => exportAsCSS(palette),
      color: 'bg-secondary',
    },
    {
      label: 'SCSS',
      description: 'SCSS variables',
      icon: FileScriptIcon,
      action: () => exportAsSCSS(palette),
      color: 'bg-accent',
    },
    {
      label: 'Tailwind',
      description: 'Tailwind v4 @theme file',
      icon: Palette,
      action: () => exportAsTailwind(palette),
      color: 'bg-cyan',
    },
    {
      label: 'SVG',
      description: 'SVG color swatches',
      icon: Image,
      action: () => exportAsSVG(palette),
      color: 'bg-success',
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] sm:items-center sm:p-4">
      <BrutalCard className="max-h-[88svh] w-full overflow-auto border-4 border-black shadow-brutal-xl sm:max-h-[90vh] sm:max-w-2xl">
        <BrutalCardHeader>
          <div className="flex items-center justify-between">
            <BrutalCardTitle>Export Palette: {palette.name}</BrutalCardTitle>
            <BrutalButton variant="outline" size="sm" onClick={onClose} aria-label="Close export modal">
              <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" aria-hidden="true" />
            </BrutalButton>
          </div>
        </BrutalCardHeader>
        <BrutalCardContent>
          <p className="text-sm text-muted-foreground mb-4 font-medium">
            Choose a format to export your color palette
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {exportOptions.map((option) => {
              return (
                <button
                  key={option.label}
                  onClick={() => {
                    option.action()
                    setTimeout(onClose, 300)
                  }}
                  className={`${option.color} text-white p-4 border-3 border-black shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-[transform,box-shadow,background-color,color] text-left`}
                >
                  <div className="flex items-start gap-3">
                    <HugeiconsIcon icon={option.icon} className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <div className="font-bold text-lg">{option.label}</div>
                      <div className="text-sm mt-1 opacity-90">{option.description}</div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-6 pt-6 border-t-3 border-black">
            <h4 className="font-bold mb-3">Color Preview</h4>
            <div className="flex gap-2">
              {palette.colors.map((color, index) => (
                <div
                  key={index}
                  className="flex-1 h-16 border-3 border-black"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </BrutalCardContent>
      </BrutalCard>
    </div>
  )
}
