"use client"

import * as React from "react"
import { ToolCard } from "@/components/tool-card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowRightLeft, Check, Copy } from "lucide-react"

export default function Base64EncoderPage() {
  const [input, setInput] = React.useState("")
  const [output, setOutput] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [mode, setMode] = React.useState<"encode" | "decode">("encode")
  const [copied, setCopied] = React.useState(false)

  const processBase64 = () => {
    try {
      if (!input.trim()) {
        setOutput("")
        setError(null)
        return
      }

      if (mode === "encode") {
        // Safe UTF-8 to Base64
        const utf8Bytes = new TextEncoder().encode(input)
        const binaryString = String.fromCodePoint(...utf8Bytes)
        setOutput(btoa(binaryString))
      } else {
        // Safe Base64 to UTF-8
        const binaryString = atob(input)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        setOutput(new TextDecoder().decode(bytes))
      }
      setError(null)
    } catch {
      setError("Invalid input for " + mode)
    }
  }

  const toggleMode = () => {
    setMode((prev) => (prev === "encode" ? "decode" : "encode"))
    setInput(output)
    setOutput("")
    setError(null)
  }

  const copyToClipboard = async () => {
    try {
      if (!output) return
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy", err)
    }
  }

  return (
    <ToolCard
      title="Base64 Encoder / Decoder"
      description="Quickly encode or decode Base64 strings."
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-center">
          <Button variant="outline" onClick={toggleMode} className="gap-2">
            <ArrowRightLeft className="h-4 w-4" />
            {mode === "encode" ? "Switch to Decode" : "Switch to Encode"}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Input String to {mode === "encode" ? "Encode" : "Decode"}
            </label>
            <Textarea
              placeholder={mode === "encode" ? "Hello World" : "SGVsbG8gV29ybGQ="}
              className="min-h-[250px] font-mono text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <div className="space-y-2 flex flex-col">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                {mode === "encode" ? "Encoded" : "Decoded"} Output
              </label>
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
              <Alert variant="destructive" className="mt-2 flex-1">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="font-mono text-xs break-all">
                  {error}
                </AlertDescription>
              </Alert>
            ) : (
              <Textarea
                readOnly
                className="min-h-[250px] font-mono text-sm bg-muted/50 flex-1"
                value={output}
                placeholder="Result will appear here..."
              />
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={processBase64} className="w-full md:w-auto">
            {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
          </Button>
        </div>
      </div>
    </ToolCard>
  )
}
