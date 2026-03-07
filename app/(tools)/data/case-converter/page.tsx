"use client"

import * as React from "react"
import { ToolCard } from "@/components/tool-card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { Input } from "@/components/ui/input"

// Helper functions for conversions
const toWords = (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase -> camel Case
    .replace(/[_\-.]/g, " ") // snake_case, kebab-case -> space separated
    .trim()
    .split(/\s+/)
    .map(word => word.toLowerCase())
}

const toCamelCase = (words: string[]) => {
  return words
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("")
}

const toPascalCase = (words: string[]) => {
  return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("")
}

const toSnakeCase = (words: string[]) => {
  return words.join("_")
}

const toKebabCase = (words: string[]) => {
  return words.join("-")
}

const toConstantCase = (words: string[]) => {
  return words.join("_").toUpperCase()
}

export default function CaseConverterPage() {
  const [input, setInput] = React.useState("")
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  const words = input ? toWords(input) : []

  const cases = [
    { id: "camel", label: "camelCase", value: input ? toCamelCase(words) : "" },
    { id: "pascal", label: "PascalCase", value: input ? toPascalCase(words) : "" },
    { id: "snake", label: "snake_case", value: input ? toSnakeCase(words) : "" },
    { id: "kebab", label: "kebab-case", value: input ? toKebabCase(words) : "" },
    { id: "constant", label: "CONSTANT_CASE", value: input ? toConstantCase(words) : "" },
    { id: "lower", label: "lowercase", value: input ? words.join(" ") : "" },
    { id: "upper", label: "UPPERCASE", value: input ? words.join(" ").toUpperCase() : "" },
  ]

  const copyToClipboard = async (text: string, id: string) => {
    try {
      if (!text) return
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy", err)
    }
  }

  return (
    <ToolCard
      title="Text Case Converter"
      description="Instantly convert text between different naming conventions."
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Input Text</label>
          <Textarea
            placeholder="Type or paste text here (e.g. myVariableName, snake_case_string)"
            className="min-h-[150px] font-mono"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cases.map(({ id, label, value }) => (
            <div key={id} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-muted-foreground">{label}</label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => copyToClipboard(value, id)}
                  disabled={!value}
                >
                  {copiedId === id ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  <span className="sr-only">Copy</span>
                </Button>
              </div>
              <Input
                readOnly
                value={value}
                className="font-mono bg-muted/50"
                placeholder={label}
              />
            </div>
          ))}
        </div>
      </div>
    </ToolCard>
  )
}
