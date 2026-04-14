import type { HarmonyType, HSL } from '@/lib/types/color'
import { hexToHsl, hslToHex, adjustHue } from './color-utils'

const MIN_LIGHTNESS = 32

function normalizeLightness(hsl: HSL): HSL {
  return {
    ...hsl,
    l: Math.max(hsl.l, MIN_LIGHTNESS),
  }
}

function toBalancedHex(hsl: HSL): string {
  return hslToHex(normalizeLightness(hsl))
}

/**
 * Generate complementary color scheme (2 colors)
 * Base color + color 180° opposite on the color wheel
 */
export function generateComplementary(baseColor: string): string[] {
  const hsl = hexToHsl(baseColor)
  const complementHue = adjustHue(hsl.h, 180)
  
  return [
    toBalancedHex(hsl),
    toBalancedHex({ ...hsl, h: complementHue }),
  ]
}

/**
 * Generate analogous color scheme (3-5 colors)
 * Base color + adjacent colors on the color wheel (typically 30° apart)
 */
export function generateAnalogous(baseColor: string, count: number = 5): string[] {
  const hsl = hexToHsl(baseColor)
  const colors: string[] = []
  const step = 30

  for (let i = 0; i < count; i++) {
    const offset = (i - Math.floor(count / 2)) * step
    const newHue = adjustHue(hsl.h, offset)
    colors.push(toBalancedHex({ ...hsl, h: newHue }))
  }

  return colors
}

/**
 * Generate triadic color scheme (3 colors)
 * Base color + two colors 120° apart on the color wheel
 */
export function generateTriadic(baseColor: string): string[] {
  const hsl = hexToHsl(baseColor)
  
  return [
    toBalancedHex(hsl),
    toBalancedHex({ ...hsl, h: adjustHue(hsl.h, 120) }),
    toBalancedHex({ ...hsl, h: adjustHue(hsl.h, 240) }),
  ]
}

/**
 * Generate monochromatic color scheme (5 colors)
 * Base color with varying lightness and saturation
 */
export function generateMonochromatic(baseColor: string, count: number = 5): string[] {
  const hsl = hexToHsl(baseColor)
  const colors: string[] = []

  // Generate colors with different lightness values
  const lightnessValues = [32, 45, 60, 75, 90]
  
  if (count === 5) {
    for (const lightness of lightnessValues) {
      colors.push(toBalancedHex({ ...hsl, l: lightness }))
    }
  } else {
    // For custom count, distribute evenly
    for (let i = 0; i < count; i++) {
      const lightness = MIN_LIGHTNESS + (58 / (count - 1)) * i
      colors.push(toBalancedHex({ ...hsl, l: Math.round(lightness) }))
    }
  }

  return colors
}

/**
 * Generate tetradic (double complementary) color scheme (4 colors)
 * Two pairs of complementary colors
 */
export function generateTetradic(baseColor: string): string[] {
  const hsl = hexToHsl(baseColor)
  
  return [
    toBalancedHex(hsl),
    toBalancedHex({ ...hsl, h: adjustHue(hsl.h, 90) }),
    toBalancedHex({ ...hsl, h: adjustHue(hsl.h, 180) }),
    toBalancedHex({ ...hsl, h: adjustHue(hsl.h, 270) }),
  ]
}

/**
 * Generate split-complementary color scheme (3 colors)
 * Base color + two colors adjacent to its complement
 */
export function generateSplitComplementary(baseColor: string): string[] {
  const hsl = hexToHsl(baseColor)
  const complementHue = adjustHue(hsl.h, 180)
  
  return [
    toBalancedHex(hsl),
    toBalancedHex({ ...hsl, h: adjustHue(complementHue, -30) }),
    toBalancedHex({ ...hsl, h: adjustHue(complementHue, 30) }),
  ]
}

/**
 * Main function to generate color harmony based on type
 */
export function generateColorHarmony(
  baseColor: string,
  harmonyType: HarmonyType,
  count?: number
): string[] {
  switch (harmonyType) {
    case 'complementary':
      return generateComplementary(baseColor)
    case 'analogous':
      return generateAnalogous(baseColor, count || 5)
    case 'triadic':
      return generateTriadic(baseColor)
    case 'monochromatic':
      return generateMonochromatic(baseColor, count || 5)
    case 'tetradic':
      return generateTetradic(baseColor)
    case 'split-complementary':
      return generateSplitComplementary(baseColor)
    default:
      return [baseColor]
  }
}

/**
 * Generate random palette with specified harmony type
 */
export function generateRandomPalette(harmonyType: HarmonyType, count?: number): string[] {
  const randomBase: HSL = {
    h: Math.floor(Math.random() * 360),
    s: 60 + Math.floor(Math.random() * 30),
    l: 42 + Math.floor(Math.random() * 26),
  }
  const baseColor = hslToHex(randomBase)
  return generateColorHarmony(baseColor, harmonyType, count)
}
