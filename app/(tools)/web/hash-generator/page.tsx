"use client"

import * as React from "react"
import { ToolCard } from "@/components/tool-card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Check, Copy, Hash } from "lucide-react"
import CryptoJS from "crypto-js"

export default function HashGeneratorPage() {
  const [input, setInput] = React.useState("")
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  // Generate hashes
  const md5Hash = input ? CryptoJS.MD5(input).toString() : ""
  const sha1Hash = input ? CryptoJS.SHA1(input).toString() : ""
  const sha256Hash = input ? CryptoJS.SHA256(input).toString() : ""
  const sha512Hash = input ? CryptoJS.SHA512(input).toString() : ""

  const hashes = [
    { id: "md5", label: "MD5", value: md5Hash },
    { id: "sha1", label: "SHA-1", value: sha1Hash },
    { id: "sha256", label: "SHA-256", value: sha256Hash },
    { id: "sha512", label: "SHA-512", value: sha512Hash },
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
      title="Hash Generator"
      description="Instantly generate cryptographic hashes from text input."
    >
      <div className="space-y-8">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Hash className="h-4 w-4" /> Input String
          </label>
          <Textarea
            placeholder="Enter text to hash..."
            className="min-h-[150px] font-mono"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="space-y-6">
          {hashes.map(({ id, label, value }) => (
            <div key={id} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-muted-foreground">{label}</label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 gap-1.5 px-2 text-xs"
                  onClick={() => copyToClipboard(value, id)}
                  disabled={!value}
                >
                  {copiedId === id ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  {copiedId === id ? "Copied" : "Copy"}
                </Button>
              </div>
              <Input
                readOnly
                value={value}
                className="font-mono bg-muted/50 break-all text-xs h-10"
                placeholder={`${label} hash will appear here...`}
              />
            </div>
          ))}
        </div>
      </div>
    </ToolCard>
  )
}
