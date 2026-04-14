import type { Palette } from '@/lib/types/color'

export function exportAsJSON(palette: Palette) {
  const exportData = {
    name: palette.name,
    colors: palette.colors,
    harmonyType: palette.harmonyType,
    tags: palette.tags,
  }

  const dataStr = JSON.stringify(exportData, null, 2)
  downloadFile(dataStr, `${sanitizeFilename(palette.name)}.json`, 'application/json')
}

export function exportAsCSS(palette: Palette) {
  const cssVars = palette.colors
    .map((color, index) => `  --color-${index + 1}: ${color};`)
    .join('\n')

  const cssContent = `:root {\n${cssVars}\n}\n\n/* ${palette.name} - ${palette.harmonyType} harmony */`

  downloadFile(cssContent, `${sanitizeFilename(palette.name)}.css`, 'text/css')
}

export function exportAsSCSS(palette: Palette) {
  const scssVars = palette.colors
    .map((color, index) => `$color-${index + 1}: ${color};`)
    .join('\n')

  const scssContent = `// ${palette.name} - ${palette.harmonyType} harmony\n\n${scssVars}\n`

  downloadFile(scssContent, `${sanitizeFilename(palette.name)}.scss`, 'text/plain')
}

export function exportAsTailwind(palette: Palette) {
  const themeVars = palette.colors
    .map((color, index) => `  --color-palette-${index + 1}: ${color};`)
    .join('\n')

  const tailwindV4Theme = `/* ${palette.name} - ${palette.harmonyType} harmony */
@import "tailwindcss";

@theme {
${themeVars}
}

/* Usage examples:
   bg-palette-1 text-palette-2 border-palette-3
*/
`

  downloadFile(tailwindV4Theme, 'globals.css', 'text/css')
}

export function exportAsSVG(palette: Palette) {
  const swatchWidth = 100
  const swatchHeight = 100
  const totalWidth = swatchWidth * palette.colors.length
  const totalHeight = swatchHeight

  const rects = palette.colors
    .map(
      (color, index) =>
        `<rect x="${index * swatchWidth}" y="0" width="${swatchWidth}" height="${swatchHeight}" fill="${color}"/>`
    )
    .join('\n  ')

  const svgContent = `<svg width="${totalWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
  <title>${palette.name}</title>
  ${rects}
</svg>`

  downloadFile(svgContent, `${sanitizeFilename(palette.name)}.svg`, 'image/svg+xml')
}

export function copyToClipboard(palette: Palette, format: 'hex' | 'rgb' | 'hsl' = 'hex') {
  let text = ''

  if (format === 'hex') {
    text = palette.colors.join(', ')
  }
  // Can add RGB and HSL formats later
  
  navigator.clipboard.writeText(text)
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-z0-9]/gi, '-').toLowerCase()
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
