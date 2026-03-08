"use client"

import * as React from "react"
import { ToolCard } from "@/components/tool-card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Regex } from "lucide-react"

export default function RegexTesterPage() {
  const [pattern, setPattern] = React.useState("[a-z]+")
  const [flags, setFlags] = React.useState("gi")
  const [testString, setTestString] = React.useState("hello 123 WORLD!")
  const [error, setError] = React.useState<string | null>(null)
  const [matches, setMatches] = React.useState<{ text: string; index: number }[]>([])

  React.useEffect(() => {
    try {
      if (!pattern) {
        setMatches([])
        setError(null)
        return
      }

      const regex = new RegExp(pattern, flags)
      const foundMatches: { text: string; index: number }[] = []

      let match
      while ((match = regex.exec(testString)) !== null) {
        foundMatches.push({
          text: match[0],
          index: match.index,
        })
        if (!regex.global) break
        // Prevent infinite loops if regex matches empty string
        if (match[0].length === 0) {
            regex.lastIndex++
        }
      }

      setMatches(foundMatches)
      setError(null)
    } catch (err: unknown) {
      setError((err as Error).message || "Invalid regular expression")
      setMatches([])
    }
  }, [pattern, flags, testString])

  const renderHighlightedText = () => {
    if (!pattern || error || matches.length === 0) return <>{testString}</>

    const parts = []
    let lastIndex = 0

    matches.forEach((match, i) => {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(<span key={`text-${i}`}>{testString.substring(lastIndex, match.index)}</span>)
      }
      // Add the matched text
      parts.push(
        <mark key={`match-${i}`} className="bg-primary/30 rounded-sm px-[2px] font-medium text-primary-foreground">
          {match.text}
        </mark>
      )
      lastIndex = match.index + match.text.length
    })

    // Add remaining text after the last match
    if (lastIndex < testString.length) {
      parts.push(<span key="text-end">{testString.substring(lastIndex)}</span>)
    }

    return <>{parts}</>
  }

  return (
    <ToolCard
      title="Regular Expression Tester"
      description="Test regular expressions against strings with real-time highlighting."
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1 w-full">
              <label className="text-sm font-medium flex items-center gap-2">
                <Regex className="h-4 w-4" /> Regular Expression
              </label>
              <div className="flex items-center rounded-md border border-input bg-transparent shadow-sm px-3 h-10">
                <span className="text-muted-foreground mr-1">/</span>
                <input
                    type="text"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 sm:text-sm font-mono"
                    placeholder="pattern"
                />
                <span className="text-muted-foreground ml-1">/</span>
              </div>
            </div>

            <div className="space-y-2 w-full md:w-32">
               <label className="text-sm font-medium">Flags</label>
               <Input
                 type="text"
                 value={flags}
                 onChange={(e) => setFlags(e.target.value)}
                 className="font-mono text-center h-10"
                 placeholder="g, i, m..."
               />
            </div>
        </div>

        {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Invalid Regex</AlertTitle>
              <AlertDescription className="text-xs font-mono">{error}</AlertDescription>
            </Alert>
        )}

        <div className="space-y-2">
           <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Test String</label>
              <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                {matches.length} match{matches.length !== 1 ? 'es' : ''}
              </span>
           </div>

           <div className="relative min-h-[200px]">
              {/* Highlighted background layer. Note the border border-transparent to match textarea border */}
              <div
                className="absolute inset-0 p-3 pointer-events-none font-mono text-sm whitespace-pre-wrap break-words border border-transparent rounded-md"
                aria-hidden="true"
              >
                 {renderHighlightedText()}
              </div>

              {/* Actual textarea for input (transparent text) */}
              <textarea
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                className="absolute inset-0 w-full h-full p-3 font-mono text-sm bg-transparent text-transparent caret-foreground outline-none resize-none border rounded-md whitespace-pre-wrap break-words"
                spellCheck="false"
                placeholder="Enter string to test..."
              />
           </div>
        </div>
      </div>
    </ToolCard>
  )
}
