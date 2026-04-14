'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { BrutalButton } from '@/components/ui/brutal-button'
import { BrutalInput } from '@/components/ui/brutal-input'
import { BrutalCard, BrutalCardContent, BrutalCardHeader, BrutalCardTitle } from '@/components/ui/brutal-card'
import { ColorSwatch } from '@/components/color-swatch'
import { Navigation } from '@/components/navigation'
import { HugeiconsIcon } from '@hugeicons/react'
import { Palette, Refresh, Sparkles, Copy, Link as LinkIcon, InformationCircleIcon } from '@hugeicons/core-free-icons'
import type { HarmonyType } from '@/lib/types/color'

const harmonyTypes = ['complementary', 'analogous', 'triadic', 'monochromatic', 'tetradic', 'split-complementary'] as const

function HomeContent() {
  const [baseColor, setBaseColor] = useState('#3b82f6')
  const [harmonyType, setHarmonyType] = useState<HarmonyType>('complementary')
  const [generatedColors, setGeneratedColors] = useState<string[]>([])
  const [paletteName, setPaletteName] = useState('')

  const harmonyOptions: { value: HarmonyType; label: string; description: string }[] = [
    { value: 'complementary', label: 'Complementary', description: 'Two opposite colors' },
    { value: 'analogous', label: 'Analogous', description: 'Adjacent colors' },
    { value: 'triadic', label: 'Triadic', description: 'Three evenly spaced colors' },
  ]

  const handleGenerate = () => {
    // TODO: wire up color harmony logic
    setGeneratedColors(['#3b82f6', '#f59e0b', '#22c55e', '#ef4444', '#8b5cf6'])
  }

  const handleRandomGenerate = () => {
    // TODO: wire up random palette logic
    setGeneratedColors(['#3b82f6', '#f59e0b', '#22c55e', '#ef4444', '#8b5cf6'])
  }

  const handleSavePalette = () => {
    // TODO: wire up save logic
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-8xl mx-auto">

        <main>
          <div className="grid lg:grid-cols-7 gap-6">
            {/* Generated Palette Display */}
            <div className="lg:col-span-5 border-r-5 border-b-5 flex h-full w-full">
              <BrutalCard className='flex-1'>
                <BrutalCardHeader>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <BrutalCardTitle>Generated Palette</BrutalCardTitle>
                    {generatedColors.length > 0 && (
                      <div className="flex gap-2">
                        <BrutalButton variant="outline" size="sm" onClick={() => {}}>
                          <HugeiconsIcon icon={LinkIcon} className="h-4 w-4 sm:mr-2" aria-hidden="true" />
                          <span className="hidden sm:inline">Share</span>
                        </BrutalButton>
                        <BrutalButton variant="outline" size="sm" onClick={() => {}}>
                          <HugeiconsIcon icon={Copy} className="h-4 w-4 sm:mr-2" aria-hidden="true" />
                          <span className="hidden sm:inline">Copy All</span>
                        </BrutalButton>
                      </div>
                    )}
                  </div>
                </BrutalCardHeader>
                <BrutalCardContent>
                  {generatedColors.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                        {generatedColors.map((color, index) => (
                          <ColorSwatch key={index} color={color} size="lg" />
                        ))}
                      </div>

                      {/* Save Palette Section */}
                      <div className="border-t-3 border-black pt-4 mt-4">
                        <label htmlFor="palette-name" className="block text-sm font-bold mb-2">Palette Name</label>
                        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                          <BrutalInput
                            id="palette-name"
                            name="paletteName"
                            type="text"
                            autoComplete="off"
                            value={paletteName}
                            onChange={(e) => setPaletteName(e.target.value)}
                            placeholder="Enter palette name…"
                            className="h-12 flex-1"
                          />
                          <BrutalButton
                            variant="success"
                            onClick={handleSavePalette}
                            disabled={!paletteName.trim()}
                            className="h-12 w-full sm:w-auto"
                          >
                            Save Palette
                          </BrutalButton>
                        </div>
                        <p className="mt-2 text-sm font-bold">
                          Saving is available for signed-in users.{' '}
                          <Link href="/auth/sign-in" className="underline underline-offset-2">
                            Sign in here
                          </Link>
                          .
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <HugeiconsIcon icon={Palette} className="h-16 w-16 mx-auto mb-4 opacity-30" aria-hidden="true" />
                      <p className="text-lg font-bold text-muted-foreground">
                        Generate a palette to get started
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Choose a harmony type and click Generate Palette
                      </p>
                    </div>
                  )}
                </BrutalCardContent>
              </BrutalCard>
            </div>
            {/* Generator Controls */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Card 1 */}
              <BrutalCard className='border-r-5 border-b-5'>
                <BrutalCardHeader>
                  <BrutalCardTitle>Generator Controls</BrutalCardTitle>
                </BrutalCardHeader>
                <BrutalCardContent className="space-y-4">
                  {/* Base Color Picker */}
                  <div>
                    <label htmlFor="base-color" className="block text-sm font-bold mb-2">Base Color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        id="base-color"
                        name="baseColor"
                        type="color"
                        value={baseColor}
                        onChange={(e) => setBaseColor(e.target.value)}
                        className="h-12 w-12 border-3 border-black cursor-pointer shadow-brutal flex-shrink-0"
                      />
                      <BrutalInput
                        type="text"
                        name="baseColorHex"
                        autoComplete="off"
                        value={baseColor}
                        onChange={(e) => setBaseColor(e.target.value)}
                        placeholder="#000000"
                        className="flex-1 font-mono h-12"
                      />
                    </div>
                  </div>
                  {/* Generate Buttons */}
                  <div className="space-y-2 pt-2">
                    <BrutalButton variant="primary" size="lg" onClick={handleGenerate} className="w-full">
                      <HugeiconsIcon icon={Sparkles} className="h-5 w-5 mr-2" aria-hidden="true" />
                      Generate Palette
                    </BrutalButton>
                    <BrutalButton variant="secondary" size="lg" onClick={handleRandomGenerate} className="w-full">
                      <HugeiconsIcon icon={Refresh} className="h-5 w-5 mr-2" aria-hidden="true" />
                      Random Palette
                    </BrutalButton>
                  </div>
                </BrutalCardContent>
              </BrutalCard>

                {/* Card 2 */}
              <BrutalCard className='border-r-5 border-b-5'>
                <BrutalCardHeader>
                  <BrutalCardTitle>Generator Controls</BrutalCardTitle>
                </BrutalCardHeader>
                <BrutalCardContent className="space-y-4">
                  {/* Harmony Type Selector */}
                  <fieldset>
                    <div className="space-y-2" role="radiogroup" aria-label="Color harmony type">
                      {harmonyOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          role="radio"
                          aria-checked={harmonyType === option.value}
                          onClick={() => setHarmonyType(option.value)}
                          className={`w-full text-left p-3 border-3 border-black font-bold transition-[transform,box-shadow,background-color,color] ${
                            harmonyType === option.value
                              ? 'bg-accent text-accent-foreground shadow-brutal-sm translate-x-0.5 translate-y-0.5'
                              : 'bg-white hover:bg-gray-50 shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5'
                          }`}
                        >
                          <div className="font-bold">{option.label}</div>
                          <div className="text-xs mt-1 opacity-70">{option.description}</div>
                        </button>
                      ))}
                    </div>
                  </fieldset>

                </BrutalCardContent>
              </BrutalCard>

            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            <Navigation />
            <div className="border-3 border-black bg-primary p-6 text-primary-foreground shadow-brutal-xl">
              <p className="text-lg font-bold">Loading palette generator…</p>
            </div>
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  )
}

