'use client'

import { useState } from 'react'
import { ColorSwatch } from './color-swatch'
import { BrutalButton } from './ui/brutal-button'
import { ExportModal } from './export-modal'
import { HugeiconsIcon } from '@hugeicons/react'
import { Heart, Delete02Icon, FolderAddIcon, Download } from '@hugeicons/core-free-icons'
import type { Palette } from '@/lib/types/color'

interface PaletteDisplayProps {
  palette: Palette
  onToggleFavorite?: (id: number) => void
  onDelete?: (id: number) => void
  onAddToCollection?: (id: number) => void
  isFavoritePending?: boolean
}

export function PaletteDisplay({
  palette,
  onToggleFavorite,
  onDelete,
  onAddToCollection,
  isFavoritePending = false,
}: PaletteDisplayProps) {
  const [showExportModal, setShowExportModal] = useState(false)

  return (
    <>
    <div className="bg-white border-3 border-black shadow-brutal p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-xl font-bold">{palette.name}</h3>
          <p className="text-sm text-muted-foreground font-medium mt-1">
            {palette.harmonyType.charAt(0).toUpperCase() + palette.harmonyType.slice(1)} Harmony
          </p>
          {palette.tags && palette.tags.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {palette.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs font-bold bg-accent text-accent-foreground border-2 border-black"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="grid grid-cols-4 gap-2 self-start sm:flex">
          {onToggleFavorite && palette.id && (
            <BrutalButton
              variant="outline"
              size="sm"
              onClick={() => onToggleFavorite(palette.id!)}
              disabled={isFavoritePending}
              className={`${palette.isFavorite ? 'bg-secondary text-white' : ''} ${isFavoritePending ? 'opacity-80' : ''}`}
              aria-label={palette.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <HugeiconsIcon
                icon={Heart}
                className={`h-4 w-4 transition-transform ${palette.isFavorite ? 'fill-current scale-110' : ''} ${isFavoritePending ? 'animate-pulse' : ''}`}
                aria-hidden="true"
              />
            </BrutalButton>
          )}
          {onAddToCollection && palette.id && (
            <BrutalButton
              variant="outline"
              size="sm"
              onClick={() => onAddToCollection(palette.id!)}
              aria-label="Add to collection"
            >
              <HugeiconsIcon icon={FolderAddIcon} className="h-4 w-4" aria-hidden="true" />
            </BrutalButton>
          )}
          <BrutalButton
            variant="outline"
            size="sm"
            onClick={() => setShowExportModal(true)}
            aria-label="Export palette"
          >
            <HugeiconsIcon icon={Download} className="h-4 w-4" aria-hidden="true" />
          </BrutalButton>
          {onDelete && palette.id && (
            <BrutalButton
              variant="destructive"
              size="sm"
              onClick={() => onDelete(palette.id!)}
              aria-label="Delete palette"
            >
              <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4" aria-hidden="true" />
            </BrutalButton>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {palette.colors.map((color, index) => (
          <ColorSwatch key={index} color={color} size="md" />
        ))}
      </div>
    </div>
    {showExportModal && (
      <ExportModal palette={palette} onClose={() => setShowExportModal(false)} />
    )}
    </>
  )
}
