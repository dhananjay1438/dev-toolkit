"use client"

import * as React from "react"
import { ToolCard } from "@/components/tool-card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Check, Copy, Terminal } from "lucide-react"

// A very simple client-side parser to simulate curl-to-code
// Full AST parsing of bash in the browser with `curlconverter` is failing
// due to `tree-sitter` and Node `fs` dependencies not resolving in Turbopack.
// So we write a lightweight regex-based one just for the core features (method, url, headers, data).

function parseCurlCommand(cmd: string) {
  const result = {
    method: "GET",
    url: "",
    headers: {} as Record<string, string>,
    data: "",
  }

  // Remove backslashes and newlines
  const cleanCmd = cmd.replace(/\\\n/g, ' ').replace(/\n/g, ' ')

  // Basic tokenization (handle quotes)
  const tokens: string[] = []
  let currentToken = ""
  let inQuotes = false
  let quoteChar = ""

  for (let i = 0; i < cleanCmd.length; i++) {
    const char = cleanCmd[i]
    if ((char === "'" || char === '"') && (i === 0 || cleanCmd[i - 1] !== "\\")) {
      if (inQuotes && char === quoteChar) {
        inQuotes = false
        quoteChar = ""
      } else if (!inQuotes) {
        inQuotes = true
        quoteChar = char
      } else {
        currentToken += char
      }
    } else if (char === " " && !inQuotes) {
      if (currentToken) {
        tokens.push(currentToken)
        currentToken = ""
      }
    } else {
      currentToken += char
    }
  }
  if (currentToken) tokens.push(currentToken)

  if (tokens[0] !== "curl") {
      throw new Error("Command must start with 'curl'")
  }

  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i]

    if (token === "-X" || token === "--request") {
      result.method = tokens[++i].toUpperCase()
    } else if (token === "-H" || token === "--header") {
      const headerRaw = tokens[++i]
      const splitIdx = headerRaw.indexOf(":")
      if (splitIdx > -1) {
        result.headers[headerRaw.substring(0, splitIdx).trim()] = headerRaw.substring(splitIdx + 1).trim()
      }
    } else if (token === "-d" || token === "--data" || token === "--data-raw") {
      result.data = tokens[++i]
      if (result.method === "GET") result.method = "POST"
    } else if (token.startsWith("http")) {
      result.url = token
    }
  }

  if (!result.url) {
      // Find the first token that looks like a URL if not matched
      const urlToken = tokens.find(t => t.startsWith("http://") || t.startsWith("https://"))
      if (urlToken) result.url = urlToken
      else throw new Error("Could not find a valid URL")
  }

  return result
}

function generatePython(parsed: ReturnType<typeof parseCurlCommand>) {
  let code = "import requests\n\n"

  if (Object.keys(parsed.headers).length > 0) {
      code += "headers = {\n"
      for (const [k, v] of Object.entries(parsed.headers)) {
          code += `    '${k}': '${v}',\n`
      }
      code += "}\n\n"
  }

  const headerArg = Object.keys(parsed.headers).length > 0 ? ", headers=headers" : ""

  if (parsed.data) {
      // Attempt to pretty print if it's JSON
      try {
          const jsonObj = JSON.parse(parsed.data)
          code += `json_data = ${JSON.stringify(jsonObj, null, 4)}\n\n`
          code += `response = requests.${parsed.method.toLowerCase()}('${parsed.url}'${headerArg}, json=json_data)\n`
      } catch {
          code += `data = '${parsed.data.replace(/'/g, "\\'")}'\n\n`
          code += `response = requests.${parsed.method.toLowerCase()}('${parsed.url}'${headerArg}, data=data)\n`
      }
  } else {
      code += `response = requests.${parsed.method.toLowerCase()}('${parsed.url}'${headerArg})\n`
  }

  return code
}

function generateJavascript(parsed: ReturnType<typeof parseCurlCommand>) {
    let code = `fetch('${parsed.url}', {\n`
    code += `    method: '${parsed.method}'`

    if (Object.keys(parsed.headers).length > 0) {
        code += ",\n    headers: {\n"
        for (const [k, v] of Object.entries(parsed.headers)) {
            code += `        '${k}': '${v}',\n`
        }
        code += "    }"
    }

    if (parsed.data) {
         code += ",\n    body: "
         try {
             JSON.parse(parsed.data) // Test valid json
             code += `JSON.stringify(${parsed.data})`
         } catch {
             code += `'${parsed.data.replace(/'/g, "\\'")}'`
         }
    }

    code += "\n});"
    return code
}

function generateGo(parsed: ReturnType<typeof parseCurlCommand>) {
    let code = `package main\n\nimport (\n\t"fmt"\n\t"io"\n\t"log"\n\t"net/http"\n`
    if (parsed.data) code += `\t"strings"\n`
    code += `)\n\nfunc main() {\n`

    if (parsed.data) {
        code += `\tbody := strings.NewReader(\`${parsed.data}\`)\n`
        code += `\treq, err := http.NewRequest("${parsed.method}", "${parsed.url}", body)\n`
    } else {
        code += `\treq, err := http.NewRequest("${parsed.method}", "${parsed.url}", nil)\n`
    }

    code += `\tif err != nil {\n\t\tlog.Fatal(err)\n\t}\n`

    for (const [k, v] of Object.entries(parsed.headers)) {
        code += `\treq.Header.Set("${k}", "${v}")\n`
    }

    code += `\n\tresp, err := http.DefaultClient.Do(req)\n`
    code += `\tif err != nil {\n\t\tlog.Fatal(err)\n\t}\n`
    code += `\tdefer resp.Body.Close()\n\n`
    code += `\tbodyText, err := io.ReadAll(resp.Body)\n`
    code += `\tif err != nil {\n\t\tlog.Fatal(err)\n\t}\n`
    code += `\tfmt.Printf("%s\\n", bodyText)\n}`

    return code
}

export default function CurlConverterPage() {
  const [input, setInput] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [outputs, setOutputs] = React.useState({
    python: "",
    javascript: "",
    go: "",
  })
  const [copiedTab, setCopiedTab] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState("python")

  const convert = React.useCallback(() => {
    try {
      if (!input.trim()) {
        setOutputs({ python: "", javascript: "", go: "" })
        setError(null)
        return
      }

      const parsed = parseCurlCommand(input)

      setOutputs({
        python: generatePython(parsed),
        javascript: generateJavascript(parsed),
        go: generateGo(parsed)
      })
      setError(null)
    } catch (err: unknown) {
      setOutputs({ python: "", javascript: "", go: "" })
      setError((err as Error).message || "Failed to parse curl command. Ensure it is a valid curl syntax.")
    }
  }, [input])

  // Auto-convert on input change
  React.useEffect(() => {
      const timeoutId = setTimeout(() => {
          convert()
      }, 500)
      return () => clearTimeout(timeoutId)
  }, [input, convert])


  const copyToClipboard = async (text: string, tabId: string) => {
    try {
      if (!text) return
      await navigator.clipboard.writeText(text)
      setCopiedTab(tabId)
      setTimeout(() => setCopiedTab(null), 2000)
    } catch (err) {
      console.error("Failed to copy", err)
    }
  }

  return (
    <ToolCard
      title="cURL to Code Converter"
      description="Paste a raw curl command to instantly generate code in Python, JavaScript, and Go."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Terminal className="h-4 w-4" /> Raw cURL Command
          </label>
          <Textarea
            placeholder="curl -X POST https://api.example.com -H 'Content-Type: application/json' -d '{&quot;key&quot;:&quot;value&quot;}'"
            className="min-h-[400px] font-mono text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
           {error && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Parse Error</AlertTitle>
              <AlertDescription className="text-xs font-mono break-all">{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-4">
          <Tabs defaultValue="python" value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <TabsList>
                  <TabsTrigger value="python">Python (requests)</TabsTrigger>
                  <TabsTrigger value="javascript">JS (fetch)</TabsTrigger>
                  <TabsTrigger value="go">Go</TabsTrigger>
                </TabsList>

                 <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1"
                    onClick={() => copyToClipboard(outputs[activeTab as keyof typeof outputs], activeTab)}
                    disabled={!outputs[activeTab as keyof typeof outputs]}
                  >
                    {copiedTab === activeTab ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copiedTab === activeTab ? "Copied" : "Copy"}
                  </Button>
            </div>

            <TabsContent value="python" className="mt-0 flex-1 h-full">
                <Textarea
                    readOnly
                    className="h-[400px] font-mono text-sm bg-muted/50 w-full whitespace-pre"
                    value={outputs.python}
                    placeholder="Python requests code will appear here..."
                />
            </TabsContent>

            <TabsContent value="javascript" className="mt-0 flex-1 h-full">
                <Textarea
                    readOnly
                    className="h-[400px] font-mono text-sm bg-muted/50 w-full whitespace-pre"
                    value={outputs.javascript}
                    placeholder="JavaScript fetch code will appear here..."
                />
            </TabsContent>

            <TabsContent value="go" className="mt-0 flex-1 h-full">
                <Textarea
                    readOnly
                    className="h-[400px] font-mono text-sm bg-muted/50 w-full whitespace-pre"
                    value={outputs.go}
                    placeholder="Go net/http code will appear here..."
                />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ToolCard>
  )
}
