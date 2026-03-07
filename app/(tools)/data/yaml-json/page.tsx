"use client"

import * as React from "react"
import { ToolCard } from "@/components/tool-card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowRightLeft, Check, Copy } from "lucide-react"
import yaml from "yaml"

export default function YamlJsonConverterPage() {
  const [input, setInput] = React.useState("")
  const [output, setOutput] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [mode, setMode] = React.useState<"json-to-yaml" | "yaml-to-json">("yaml-to-json")
  const [copied, setCopied] = React.useState(false)

  const convert = () => {
    try {
      if (!input.trim()) {
        setOutput("")
        setError(null)
        return
      }

      if (mode === "yaml-to-json") {
        const parsed = yaml.parse(input)
        if (typeof parsed !== "object" || parsed === null) {
            throw new Error("Invalid YAML structure")
        }
        setOutput(JSON.stringify(parsed, null, 2))
      } else {
        const parsed = JSON.parse(input)
        setOutput(yaml.stringify(parsed))
      }
      setError(null)
    } catch (err: unknown) {
      setError((err as Error).message || "Conversion failed")
    }
  }

  const toggleMode = () => {
    setMode((prev) => (prev === "yaml-to-json" ? "json-to-yaml" : "yaml-to-json"))
    setInput(output)
    setOutput("")
    setError(null)
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
      title="YAML ↔ JSON Converter"
      description="Convert bi-directionally between YAML and JSON formats."
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-center">
          <Button variant="outline" onClick={toggleMode} className="gap-2">
            <ArrowRightLeft className="h-4 w-4" />
            {mode === "yaml-to-json" ? "YAML → JSON" : "JSON → YAML"}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Input {mode === "yaml-to-json" ? "YAML" : "JSON"}
            </label>
            <Textarea
              placeholder={mode === "yaml-to-json" ? "key: value" : '{"key": "value"}'}
              className="min-h-[400px] font-mono text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <div className="space-y-2 flex flex-col">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Output {mode === "yaml-to-json" ? "JSON" : "YAML"}
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
                className="min-h-[400px] font-mono text-sm bg-muted/50 flex-1"
                value={output}
                placeholder="Converted output will appear here..."
              />
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={convert} className="w-full md:w-auto">
            Convert
          </Button>
        </div>
      </div>
    </ToolCard>
  )
}
