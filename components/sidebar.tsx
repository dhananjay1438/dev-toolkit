"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import {
  FileJson,
  Code2,
  Table,
  FileText,
  Type,
  Link as LinkIcon,
  Key,
  Shield,
  Clock,
  CalendarDays,
  Regex,
  Palette,
  Hash,
  Terminal,
  X,
} from "lucide-react"

const sidebarNavItems = [
  {
    title: "Data Morphers",
    items: [
      { title: "JSON Formatter", href: "/data/json-formatter", icon: FileJson },
      { title: "YAML ↔ JSON", href: "/data/yaml-json", icon: Code2 },
      { title: "CSV Converter", href: "/data/csv-converter", icon: Table },
      { title: "HTML to Markdown", href: "/data/html-markdown", icon: FileText },
      { title: "Case Converter", href: "/data/case-converter", icon: Type },
    ],
  },
  {
    title: "Encoders & Decoders",
    items: [
      { title: "URL Encoder", href: "/encoders/url", icon: LinkIcon },
      { title: "Base64 Encoder", href: "/encoders/base64", icon: Key },
      { title: "JWT Debugger", href: "/encoders/jwt", icon: Shield },
    ],
  },
  {
    title: "Time & Scheduling",
    items: [
      { title: "Unix to Date", href: "/time/unix-date", icon: Clock },
      { title: "Cron Parser", href: "/time/cron-parser", icon: CalendarDays },
    ],
  },
  {
    title: "Web & Logic",
    items: [
      { title: "RegEx Tester", href: "/web/regex-tester", icon: Regex },
      { title: "Color & Contrast", href: "/web/color-picker", icon: Palette },
      { title: "Hash Generator", href: "/web/hash-generator", icon: Hash },
      { title: "Curl Converter", href: "/web/curl-converter", icon: Terminal },
    ],
  },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function Sidebar({ className, isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-background transition-transform duration-300 ease-in-out md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-6 py-4 sm:h-16">
          <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setIsOpen(false)}>
            <Terminal className="h-6 w-6" />
            <span className="">Dev Toolkit</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close Sidebar</span>
          </Button>
        </div>
        <ScrollArea className="flex-1 px-4 py-4">
          {sidebarNavItems.map((group, index) => (
            <div key={index} className="pb-6">
              <h4 className="mb-2 px-2 text-sm font-semibold tracking-tight text-muted-foreground">
                {group.title}
              </h4>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                      pathname === item.href
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </ScrollArea>
      </aside>
    </>
  )
}
