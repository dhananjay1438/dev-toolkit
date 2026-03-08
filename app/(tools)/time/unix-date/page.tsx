"use client"

import * as React from "react"
import { ToolCard } from "@/components/tool-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

export default function UnixDatePage() {
  const [unixInput, setUnixInput] = React.useState("")
  const [dateInput, setDateInput] = React.useState("")

  const [localTime, setLocalTime] = React.useState("")
  const [utcTime, setUtcTime] = React.useState("")
  const [isoTime, setIsoTime] = React.useState("")

  const parseUnix = (timestamp: string) => {
    try {
      if (!timestamp) return
      let ms = parseInt(timestamp, 10)
      if (timestamp.length <= 10) ms *= 1000 // Treat as seconds if <= 10 digits

      const d = new Date(ms)
      if (isNaN(d.getTime())) throw new Error()

      setLocalTime(d.toLocaleString())
      setUtcTime(d.toUTCString())
      setIsoTime(d.toISOString())
      setDateInput(d.toISOString().slice(0, 16)) // For local datetime-local input
    } catch {
      setLocalTime("Invalid timestamp")
      setUtcTime("")
      setIsoTime("")
    }
  }

  const parseDate = (dateString: string) => {
    try {
      if (!dateString) return
      const d = new Date(dateString)
      if (isNaN(d.getTime())) throw new Error()

      setUnixInput(Math.floor(d.getTime() / 1000).toString()) // Seconds
      setLocalTime(d.toLocaleString())
      setUtcTime(d.toUTCString())
      setIsoTime(d.toISOString())
    } catch {
       setLocalTime("Invalid date")
       setUtcTime("")
       setIsoTime("")
    }
  }

  const setNow = () => {
    const now = new Date()
    setUnixInput(Math.floor(now.getTime() / 1000).toString())
    parseDate(now.toISOString())
  }

  return (
    <ToolCard
      title="Unix Timestamp ↔ Date"
      description="Convert Unix epoch timestamps to human-readable local and UTC dates."
    >
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Unix Timestamp</label>
              <Button variant="outline" size="sm" onClick={setNow} className="h-7 text-xs gap-1">
                <Clock className="h-3 w-3" /> Now
              </Button>
            </div>
            <Input
              type="number"
              placeholder="e.g. 1672531200"
              value={unixInput}
              onChange={(e) => {
                setUnixInput(e.target.value)
                parseUnix(e.target.value)
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date & Time (Local)</label>
            <Input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => {
                setDateInput(e.target.value)
                parseDate(e.target.value)
              }}
            />
          </div>
        </div>

        <div className="space-y-6 rounded-md border p-4 bg-muted/20">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Local Time
            </label>
            <div className="font-mono text-sm break-all">{localTime || "-"}</div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              UTC Time
            </label>
            <div className="font-mono text-sm break-all">{utcTime || "-"}</div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              ISO 8601
            </label>
            <div className="font-mono text-sm break-all">{isoTime || "-"}</div>
          </div>
        </div>
      </div>
    </ToolCard>
  )
}
