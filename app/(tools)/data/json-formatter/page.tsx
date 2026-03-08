"use client"

import * as React from "react"
import { ToolCard } from "@/components/tool-card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Check, Copy } from "lucide-react"

export default function JsonFormatterPage() {
  const [input, setInput] = React.useState("")
  const [output, setOutput] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)

  const formatJson = () => {
    try {
      if (!input.trim()) {
        setOutput("")
        setError(null)
        return
      }
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setError(null)
    } catch (err: unknown) {
      setError((err as Error).message || "Invalid JSON")
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy", err)
    }
  }

  return (
    <ToolCard
      title="JSON Formatter & Validator"
      description="Format, beautify, and validate JSON data instantly."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Input JSON</label>
          <Textarea
            placeholder='{"hello": "world"}'
            className="min-h-[400px] font-mono text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Formatted Output</label>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              onClick={copyToClipboard}
              disabled={!output}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>

          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="font-mono text-xs break-all">
                {error}
              </AlertDescription>
            </Alert>
          ) : (
            <Textarea
              readOnly
              className="min-h-[400px] font-mono text-sm bg-muted/50"
              value={output}
              placeholder="Formatted JSON will appear here..."
            />
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={formatJson} className="w-full md:w-auto">
          Format & Validate JSON
        </Button>
      </div>
    </ToolCard>
  )
}
