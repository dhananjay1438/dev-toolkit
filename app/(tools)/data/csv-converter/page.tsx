"use client"

import * as React from "react"
import { ToolCard } from "@/components/tool-card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Check, Copy } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Papa from "papaparse"

export default function CsvConverterPage() {
  const [input, setInput] = React.useState("")
  const [outputJson, setOutputJson] = React.useState("")
  const [outputMarkdown, setOutputMarkdown] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("json")

  const convert = () => {
    try {
      if (!input.trim()) {
        setOutputJson("")
        setOutputMarkdown("")
        setError(null)
        return
      }

      // Try parsing as JSON first
      try {
        const parsedJson = JSON.parse(input)
        if (Array.isArray(parsedJson)) {
            // Convert JSON to CSV
            const csv = Papa.unparse(parsedJson)
            setOutputJson(csv)

            // Convert to Markdown
            if (parsedJson.length > 0) {
               const headers = Object.keys(parsedJson[0])
               const headerRow = `| ${headers.join(" | ")} |`
               const separatorRow = `| ${headers.map(() => "---").join(" | ")} |`
               const dataRows = parsedJson.map(row => `| ${headers.map(h => row[h] || "").join(" | ")} |`).join("\n")
               setOutputMarkdown(`${headerRow}\n${separatorRow}\n${dataRows}`)
            } else {
               setOutputMarkdown("")
            }

            setError(null)
            return
        }
      } catch {
        // Not JSON, continue to CSV parsing
      }

      // Parse as CSV
      const result = Papa.parse(input, { header: true, skipEmptyLines: true })

      if (result.errors.length > 0) {
          throw new Error(result.errors[0].message)
      }

      // To JSON
      setOutputJson(JSON.stringify(result.data, null, 2))

      // To Markdown
      if (result.meta.fields && result.data.length > 0) {
        const headers = result.meta.fields
        const headerRow = `| ${headers.join(" | ")} |`
        const separatorRow = `| ${headers.map(() => "---").join(" | ")} |`
        const dataRows = (result.data as Record<string, unknown>[])
          .map((row: Record<string, unknown>) => `| ${headers.map((h) => (row[h] as string) || "").join(" | ")} |`)
          .join("\n")

        setOutputMarkdown(`${headerRow}\n${separatorRow}\n${dataRows}`)
      } else {
          setOutputMarkdown("")
      }

      setError(null)
    } catch (err: unknown) {
      setError((err as Error).message || "Conversion failed")
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy", err)
    }
  }

  return (
    <ToolCard
      title="CSV ↔ JSON / Markdown Converter"
      description="Convert between CSV, JSON, and Markdown tables."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Input (CSV or JSON Array)</label>
          <Textarea
            placeholder="id,name&#10;1,John"
            className="min-h-[400px] font-mono text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <Tabs defaultValue="json" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-2">
                <TabsList>
                  <TabsTrigger value="json">JSON / CSV</TabsTrigger>
                  <TabsTrigger value="markdown">Markdown Table</TabsTrigger>
                </TabsList>
                 <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1"
                    onClick={() => copyToClipboard(activeTab === "json" ? outputJson : outputMarkdown)}
                    disabled={(activeTab === "json" && !outputJson) || (activeTab === "markdown" && !outputMarkdown)}
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
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="font-mono text-xs break-all">
                  {error}
                </AlertDescription>
              </Alert>
            ) : (
                <>
                  <TabsContent value="json" className="mt-0 flex-1">
                    <Textarea
                      readOnly
                      className="min-h-[400px] font-mono text-sm bg-muted/50 w-full"
                      value={outputJson}
                      placeholder="Output will appear here..."
                    />
                  </TabsContent>
                  <TabsContent value="markdown" className="mt-0 flex-1">
                    <Textarea
                      readOnly
                      className="min-h-[400px] font-mono text-sm bg-muted/50 w-full"
                      value={outputMarkdown}
                      placeholder="Markdown table will appear here..."
                    />
                  </TabsContent>
                </>
            )}
          </Tabs>
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={convert} className="w-full md:w-auto">
          Convert Data
        </Button>
      </div>
    </ToolCard>
  )
}
