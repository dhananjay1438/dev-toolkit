"use client"

import * as React from "react"
import { ToolCard } from "@/components/tool-card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CalendarDays } from "lucide-react"
import cronstrue from "cronstrue"

const CRON_EXAMPLES = [
  { label: "Every minute", expr: "* * * * *" },
  { label: "Every 5 minutes", expr: "*/5 * * * *" },
  { label: "Every hour", expr: "0 * * * *" },
  { label: "Every day at midnight", expr: "0 0 * * *" },
  { label: "Every Monday at 9am", expr: "0 9 * * 1" },
  { label: "Weekdays at 10pm", expr: "0 22 * * 1-5" },
]

export default function CronParserPage() {
  const [input, setInput] = React.useState("0 22 * * 1-5")
  const [output, setOutput] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    try {
      if (!input.trim()) {
        setOutput("")
        setError(null)
        return
      }

      const parts = input.trim().split(/\s+/)
      if (parts.length < 5 || parts.length > 6) {
         throw new Error("Invalid cron expression length")
      }

      const humanReadable = cronstrue.toString(input, { use24HourTimeFormat: true })
      setOutput(humanReadable)
      setError(null)
    } catch {
      setOutput("")
      setError("Invalid cron expression. Please check the syntax.")
    }
  }, [input])

  return (
    <ToolCard
      title="Cron Job Parser"
      description="Translate complex cron syntax into human-readable text."
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <label className="text-sm font-medium flex items-center gap-2">
            <CalendarDays className="h-4 w-4" /> Cron Expression
          </label>
          <Input
            placeholder="* * * * *"
            className="font-mono text-lg text-center h-14"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <div className="flex flex-wrap gap-2 justify-center">
            {CRON_EXAMPLES.map((ex) => (
              <button
                key={ex.expr}
                onClick={() => setInput(ex.expr)}
                className="text-xs bg-muted hover:bg-muted-foreground/20 transition-colors px-2 py-1 rounded-md border"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          ) : (
             <div className="p-8 rounded-lg border bg-primary/5 text-center transition-all duration-300 ease-in-out">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Meaning</p>
                <p className="text-xl md:text-2xl font-semibold text-primary">{output || "Waiting for valid cron expression..."}</p>
             </div>
          )}
        </div>

        <div className="grid grid-cols-5 gap-2 pt-4 border-t text-center text-xs text-muted-foreground">
            <div>
              <p className="font-semibold mb-1">Minute</p>
              <p className="font-mono">0-59</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Hour</p>
              <p className="font-mono">0-23</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Day (month)</p>
              <p className="font-mono">1-31</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Month</p>
              <p className="font-mono">1-12</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Day (week)</p>
              <p className="font-mono">0-6</p>
            </div>
        </div>
      </div>
    </ToolCard>
  )
}
