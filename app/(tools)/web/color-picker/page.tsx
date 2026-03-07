"use client"

import * as React from "react"
import { ToolCard } from "@/components/tool-card"
import { Input } from "@/components/ui/input"
import { Palette, AlertCircle } from "lucide-react"
import { colord, extend } from "colord"
import namesPlugin from "colord/plugins/names"

extend([namesPlugin])

// --- Main Component ---

export default function ColorPickerPage() {
  const [inputValue, setInputValue] = React.useState("#3b82f6") // Default Tailwind Blue-500
  const [colorHex, setColorHex] = React.useState("#3b82f6")
  const [error, setError] = React.useState<string | null>(null)

  // Validate hex/rgb/hsl on change
  const handleColorChange = (value: string) => {
    setInputValue(value)

    if (!value.trim()) {
      setError("Please enter a color")
      return
    }

    const c = colord(value)
    if (!c.isValid()) {
      setError("Invalid color format (e.g. #FF0000, rgb(255,0,0), hsl(0,100%,50%), red)")
    } else {
      setError(null)
      setColorHex(c.toHex())
    }
  }

  // Calculate contrast
  // Note: colord.contrast() was added in v2.6.0. Since we may have an older
  // version, let's use the manual luminance math instead just to be safe.
  const luminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map(function (v) {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
  }

  const contrastRatio = (hex1: string, hex2: string) => {
    const rgb1 = colord(hex1).toRgb()
    const rgb2 = colord(hex2).toRgb()

    const lum1 = luminance(rgb1.r, rgb1.g, rgb1.b)
    const lum2 = luminance(rgb2.r, rgb2.g, rgb2.b)

    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)

    return (brightest + 0.05) / (darkest + 0.05)
  }

  const contrastWithWhite = error ? null : contrastRatio(colorHex, "#ffffff")
  const contrastWithBlack = error ? null : contrastRatio(colorHex, "#000000")

  const getWcagLevel = (ratio: number, isLargeText: boolean) => {
    if (isLargeText) {
      if (ratio >= 4.5) return "AAA"
      if (ratio >= 3.0) return "AA"
      return "Fail"
    } else {
      if (ratio >= 7.0) return "AAA"
      if (ratio >= 4.5) return "AA"
      return "Fail"
    }
  }

  return (
    <ToolCard
      title="Color & Contrast Checker"
      description="Verify color contrast ratios against white and black for WCAG compliance."
    >
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
             <label className="text-sm font-medium flex items-center gap-2">
                <Palette className="h-4 w-4" /> Base Color (HEX, RGB, HSL)
             </label>
             <div className="flex gap-2">
                <Input
                  type="color"
                  value={colorHex}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-14 h-14 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="flex-1 font-mono uppercase text-lg h-14"
                  placeholder="#000000 or rgb(0,0,0)"
                />
             </div>
             {error && (
               <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                 <AlertCircle className="h-3 w-3" /> {error}
               </p>
             )}
          </div>
        </div>

        <div className="space-y-4">
           {/* Contrast with White */}
           <div
             className="p-6 rounded-lg border flex items-center justify-between transition-colors duration-300"
             style={{ backgroundColor: "#ffffff", color: colorHex }}
           >
             <div>
                <p className="font-semibold text-xl mb-1">Text on White</p>
                <p className="text-sm opacity-80">White Background</p>
             </div>
             <div className="text-right">
                <p className="font-mono text-2xl font-bold">
                  {contrastWithWhite ? contrastWithWhite.toFixed(2) : "-.--"} : 1
                </p>
                <div className="flex gap-2 mt-1 justify-end text-xs font-semibold">
                   {contrastWithWhite && (
                     <>
                        <span className={`px-2 py-0.5 rounded ${getWcagLevel(contrastWithWhite, false) !== 'Fail' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                           Normal: {getWcagLevel(contrastWithWhite, false)}
                        </span>
                        <span className={`px-2 py-0.5 rounded ${getWcagLevel(contrastWithWhite, true) !== 'Fail' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                           Large: {getWcagLevel(contrastWithWhite, true)}
                        </span>
                     </>
                   )}
                </div>
             </div>
           </div>

           {/* Contrast with Black */}
           <div
             className="p-6 rounded-lg border flex items-center justify-between transition-colors duration-300"
             style={{ backgroundColor: "#000000", color: colorHex }}
           >
             <div>
                <p className="font-semibold text-xl mb-1">Text on Black</p>
                <p className="text-sm opacity-80">Black Background</p>
             </div>
             <div className="text-right">
                <p className="font-mono text-2xl font-bold">
                  {contrastWithBlack ? contrastWithBlack.toFixed(2) : "-.--"} : 1
                </p>
                <div className="flex gap-2 mt-1 justify-end text-xs font-semibold">
                   {contrastWithBlack && (
                     <>
                        <span className={`px-2 py-0.5 rounded ${getWcagLevel(contrastWithBlack, false) !== 'Fail' ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'}`}>
                           Normal: {getWcagLevel(contrastWithBlack, false)}
                        </span>
                        <span className={`px-2 py-0.5 rounded ${getWcagLevel(contrastWithBlack, true) !== 'Fail' ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'}`}>
                           Large: {getWcagLevel(contrastWithBlack, true)}
                        </span>
                     </>
                   )}
                </div>
             </div>
           </div>
        </div>
      </div>
    </ToolCard>
  )
}
