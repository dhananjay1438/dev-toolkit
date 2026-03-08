"use client"

import * as React from "react"
import { ToolCard } from "@/components/tool-card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function JwtDebuggerPage() {
  const [token, setToken] = React.useState("")
  const [decoded, setDecoded] = React.useState<{ header: Record<string, unknown>; payload: Record<string, unknown>; signature: string } | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!token.trim()) {
      setDecoded(null)
      setError(null)
      return
    }

    try {
      // Remove "Bearer " if present
      const cleanToken = token.replace(/^Bearer\s+/i, "").trim()
      const parts = cleanToken.split(".")

      if (parts.length !== 3) {
        throw new Error("Invalid JWT format (must have 3 parts)")
      }

      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')))
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
      const signature = parts[2]

      setDecoded({ header, payload, signature })
      setError(null)
    } catch {
      setDecoded(null)
      setError("Failed to decode token. Ensure it is a valid JWT.")
    }
  }, [token])

  return (
    <ToolCard
      title="JWT Debugger"
      description="Decode and inspect JSON Web Tokens locally. Data never leaves your browser."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Encoded Token</label>
          <Textarea
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            className="min-h-[400px] font-mono text-sm break-all"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>

        <div className="space-y-4 flex flex-col">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="font-mono text-xs">{error}</AlertDescription>
            </Alert>
          )}

          {!error && decoded && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-red-500 dark:text-red-400">
                  Header <span className="text-muted-foreground font-normal">(Algorithm & Token Type)</span>
                </label>
                <Textarea
                  readOnly
                  className="font-mono text-sm min-h-[100px] border-red-500/50 bg-red-500/5"
                  value={JSON.stringify(decoded.header, null, 2)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-500 dark:text-purple-400">
                  Payload <span className="text-muted-foreground font-normal">(Data)</span>
                </label>
                <Textarea
                  readOnly
                  className="font-mono text-sm min-h-[200px] border-purple-500/50 bg-purple-500/5"
                  value={JSON.stringify(decoded.payload, null, 2)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-500 dark:text-blue-400">
                  Signature
                </label>
                <Textarea
                  readOnly
                  className="font-mono text-sm min-h-[80px] border-blue-500/50 bg-blue-500/5 break-all"
                  value={decoded.signature}
                />
              </div>
            </>
          )}

          {!error && !decoded && (
            <div className="flex-1 flex items-center justify-center border rounded-md border-dashed text-muted-foreground text-sm">
              Paste a token to decode
            </div>
          )}
        </div>
      </div>
    </ToolCard>
  )
}
