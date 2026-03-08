"use client"

import * as React from "react"
import { ToolCard } from "@/components/tool-card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Check, Copy } from "lucide-react"
import TurndownService from "turndown"

export default function HtmlMarkdownPage() {
  const [input, setInput] = React.useState("")
  const [output, setOutput] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)

  const convert = () => {
    try {
      if (!input.trim()) {
        setOutput("")
        setError(null)
        return
      }

      const turndownService = new TurndownService({
        headingStyle: "atx",
        codeBlockStyle: "fenced",
        emDelimiter: "*",
      })

      // Remove div and span tags, keeping their content
      turndownService.addRule('removeDivSpan', {
        filter: ['div', 'span'],
        replacement: function (content) {
          return content
        }
      })

      const markdown = turndownService.turndown(input)
      setOutput(markdown)
      setError(null)
    } catch (err: unknown) {
      setError((err as Error).message || "Conversion failed")
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
      title="HTML to Clean Markdown"
      description="Convert HTML to barebones Markdown, stripping divs, spans, and classes."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Input HTML</label>
          <Textarea
            placeholder="<div class='container'><h1>Hello</h1><p>World</p></div>"
            className="min-h-[400px] font-mono text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Clean Markdown</label>
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
              placeholder="# Hello\n\nWorld"
            />
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={convert} className="w-full md:w-auto">
          Convert to Markdown
        </Button>
      </div>
    </ToolCard>
  )
}
