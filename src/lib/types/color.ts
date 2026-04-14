export interface RGB {
  r: number // 0-255
  g: number // 0-255
  b: number // 0-255
}

export interface HSL {
  h: number // 0-360
  s: number // 0-100
  l: number // 0-100
}

export interface Color {
  hex: string
  rgb: RGB
  hsl: HSL
}

export type HarmonyType = 'complementary' | 'analogous' | 'triadic' | 'monochromatic' | 'tetradic' | 'split-complementary'

export interface Palette {
  id?: number
  userId?: string
  name: string
  colors: string[] // Array of hex colors
  harmonyType: HarmonyType
  isFavorite: boolean
  tags: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Collection {
  id?: number
  name: string
  description?: string
  color: string
  createdAt?: Date
  updatedAt?: Date
}
